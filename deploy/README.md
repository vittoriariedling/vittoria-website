# Deploying to DigitalOcean

One Droplet runs everything with Docker Compose: Traefik (HTTPS) → nginx
(the React app) and the API → Postgres. Photos live in Cloudflare R2.

```
internet ──443──> traefik ─┬─ /api/* ──> api :8000 ──> db :5432
                           ├─ /*     ──> web :8080 (static files)
                           └─ www.*  ──> redirect to the main domain
```

Steps 1–3 are accounts and settings in web dashboards; you can do them in
any order. Steps 4 onward happen on the server.

## 1. Domain

1. Buy a domain from **Cloudflare Registrar** (dash.cloudflare.com →
   Domain Registration) or Porkbun. Skip any add-ons (hosting, email,
   "protection"). Turn on WHOIS privacy if it isn't already.
2. You'll add the DNS records in step 4, once the Droplet has an IP.

## 2. Photo storage and backups: Cloudflare R2

1. dash.cloudflare.com → **R2 Object Storage** → enable it (needs a payment
   method; the free tier covers this site).
2. Create two buckets, both private (the default):
   - `media` for photos
   - `backups` for database backups
3. Note your **account ID**: the S3 endpoint is
   `https://<account-id>.r2.cloudflarestorage.com`.
4. **R2 → Manage API tokens → Create API token**, twice:
   - `site-photos`: *Object Read & Write*, applied to the `media` bucket only
   - `site-backups`: *Object Read & Write*, applied to the `backups` bucket only

   Each gives an **Access Key ID** and **Secret Access Key**. They're only
   shown once; keep them in your password manager.

## 3. DigitalOcean

1. Create an account and turn on two-factor authentication.
2. **Create → Droplets**: Ubuntu 24.04 LTS, a US region, Basic shared CPU,
   **1 GB RAM** (resize to 2 GB later if needed; choose "CPU and RAM only"
   so you can size back down). Choose **SSH key** authentication and add
   your public key.
3. Under **Advanced options**, add an initialization script ("user data")
   and paste the contents of `deploy/cloud-init.yaml`.
4. Optional: turn on DigitalOcean **Backups** for weekly whole-server images.
   The database backups in step 7 are what matter.
5. **Networking → Firewalls → Create firewall**: inbound SSH (22) from
   *your IP only*, HTTP (80) and HTTPS (443) from anywhere. Apply it to the
   Droplet. This is the main firewall: Docker-published ports bypass ufw.
   If your home IP changes and SSH stops working, update this rule.

## 4. DNS and first login

At your registrar (Cloudflare: your domain → DNS), add two records pointing
at the Droplet's IP:

| Type | Name  | Value         | Cloudflare proxy           |
|------|-------|---------------|----------------------------|
| A    | `@`   | `<droplet-ip>` | **DNS only** (grey cloud) |
| A    | `www` | `<droplet-ip>` | **DNS only** (grey cloud) |

Leave the proxy off: with it on, Traefik can't get its certificate and the
app would see Cloudflare's IPs instead of visitors' (breaking login history
and lockouts).

Log in as `deploy` (root login is disabled) and wait for setup to finish:

```sh
ssh deploy@<droplet-ip>
cloud-init status --wait   # should say "done"
```

## 5. Get the code, configure, start

The repo is private, so give the server a read-only deploy key:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub   # GitHub: repo → Settings → Deploy keys → Add (leave write access off)
printf 'Host github.com\n  IdentityFile ~/.ssh/github_deploy\n' >> ~/.ssh/config
git clone git@github.com:vittoriariedling/vittoria-website.git ~/site && cd ~/site

cp deploy/env.prod.example .env && chmod 600 .env
nano .env
```

Fill in every value in `.env`: your domain, two JWT secrets and a Postgres
password (generate each with the command at the top of the file), and the
R2 endpoint plus the `site-photos` token from step 2.

```sh
./deploy/deploy.sh
```

The first start builds the images (a few minutes, longer on 1 GB), runs
database migrations, and Traefik fetches Let's Encrypt certificates. Visit
`https://<your-domain>`: you should see the login page.

Future deploys: merge to `main` on GitHub, then `./deploy/deploy.sh` on the
server.

## 6. Move your content over

Your dev database already has everything (your account, newsletters, books,
projects, map), so copy it instead of re-importing.

On **your computer** (in Git Bash), with the dev stack running:

```sh
cp deploy/migrate.env.example deploy/migrate.env   # R2 endpoint + the site-photos token
./deploy/export-dev-content.sh                     # dumps the DB, copies photos to R2
scp migration/dev.dump deploy@<droplet-ip>:~/
```

On the **server**:

```sh
cd ~/site
./deploy/import-content.sh ~/dev.dump
rm ~/dev.dump
```

Log in with your dev email and password. Dev sessions and login history are
dropped, and any unused invite/reset links from dev are cancelled. (Starting
from scratch instead? Create an admin with
`docker compose -f compose.yaml -f compose.prod.yaml exec api python -m app.cli create-admin --email you@example.com --name "Your Name"`.)

Then open the travel map and the admin pages with the browser console open
(F12). A "Refused to load" message means the Content Security Policy is
blocking something; see Maintenance.

## 7. Database backups

1. **On your computer**, install age (Windows: `winget install FiloSottile.age`)
   and make an encryption key pair: `age-keygen -o backup-key.txt`. Keep `backup-key.txt` in your password
   manager, never on the server. It prints the public key (`age1...`).
2. On the server:
   `cp deploy/backup.env.example deploy/backup.env && chmod 600 deploy/backup.env`,
   then fill in the R2 endpoint, the `site-backups` token, and the `age1...`
   public key as `AGE_RECIPIENT`.
3. Run it once by hand: `./deploy/backup.sh`
4. Schedule it with `crontab -e`:

   ```
   15 3 * * * /home/deploy/site/deploy/backup.sh >> /home/deploy/backup.log 2>&1
   ```

   That's daily at 03:15 UTC. Backups older than 30 days are deleted from
   R2, and the server keeps the last 7 days locally.

**Restore** (do this once as a test, so you know it works):

```sh
# On the server: download the backup into ~/backups
cd ~/site
./deploy/rclone.sh lsf r2:backups/db/                          # pick a file
./deploy/rclone.sh copy r2:backups/db/<file>.age /backups/

# On your computer (where the private key is): decrypt, then send it back
scp deploy@<droplet-ip>:~/backups/<file>.age .
age --decrypt -i backup-key.txt -o db.dump <file>.age
scp db.dump deploy@<droplet-ip>:~/

# On the server: restore (asks before replacing anything, and saves the
# current database first)
./deploy/import-content.sh ~/db.dump
```

`import-content.sh` also clears sessions and login history, which is what
you want after a restore anyway.

Photos aren't in these backups. They live in R2, and the originals are
still on your computer.

## Maintenance

The recurring checklist (weekly, monthly, quarterly, yearly) and what to do
when something goes wrong are in [OPERATIONS.md](OPERATIONS.md).

- Security updates install automatically; the server reboots at 04:30 UTC
  when one needs it, and the containers start again on their own.
- Logs: `docker compose -f compose.yaml -f compose.prod.yaml logs -f api`
- **Image updates are manual.** Every image is pinned by digest
  (`image:tag@sha256:...`), so nothing changes until you change it. Every
  month or so, run `./deploy/check-image-updates.sh` on your laptop. It
  lists which tags have newer images and which files to update. Commit,
  merge, then run `./deploy/deploy.sh` on the server.
  Major version bumps (Postgres 17 → 18) need a dump and restore, not just
  a new tag.
- The site loads nothing from third-party CDNs: fonts, map data and scripts
  are bundled at build time, and the Content Security Policy in
  `deploy/traefik/dynamic.yml` makes the browser refuse anything else. If you
  add something external later, it has to be allowed there too.
