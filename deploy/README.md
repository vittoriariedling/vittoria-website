# Deploying to DigitalOcean

One Droplet runs everything with Docker Compose: Traefik (HTTPS) → nginx
(the React app) and the API → Postgres. Photos live in Cloudflare R2.

```
internet ──443──> traefik ─┬─ /api/* ──> api :8000 ──> db :5432
                           └─ /*     ──> web :8080 (static files)
```

## 1. Create the Droplet

1. **Create → Droplets**: Ubuntu 24.04 LTS, a US region, Basic shared CPU,
   2 GB RAM. Choose **SSH key** authentication and add your public key.
2. Under **Advanced options → Add initialized data**, paste the contents of
   `deploy/cloud-init.yaml`.
3. Turn on **Backups** if you want DigitalOcean's weekly whole-server images
   too (optional; the database backups below are what matter).
4. **Networking → Firewalls → Create firewall**: inbound SSH (22) from
   *your IP only*, HTTP (80) and HTTPS (443) from anywhere. Apply it to the
   Droplet. This is the main firewall: Docker-published ports bypass ufw.
5. Point your domain's DNS `A` record at the Droplet's IP.

Wait for setup to finish, then log in as `deploy` (root login is disabled):

```sh
ssh deploy@<droplet-ip>
cloud-init status --wait   # should say "done"
```

## 2. Get the code and configure

The repo is private, so give the server a read-only deploy key:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub   # add in GitHub: repo → Settings → Deploy keys (read-only)
printf 'Host github.com\n  IdentityFile ~/.ssh/github_deploy\n' >> ~/.ssh/config
git clone git@github.com:<you>/<repo>.git ~/site && cd ~/site

cp deploy/env.prod.example .env && chmod 600 .env
nano .env    # fill in every value
```

## 3. Start it

```sh
./deploy/deploy.sh
```

The first start builds the images (a few minutes), runs database migrations,
and Traefik fetches a Let's Encrypt certificate.

## 4. Move your content over

Your dev database already has everything (your account, newsletters, books,
projects, map), so copy it instead of re-importing.

On **your computer**, with the dev stack running:

```sh
cp deploy/migrate.env.example deploy/migrate.env   # fill in the R2 photos bucket + token
./deploy/export-dev-content.sh                     # dumps the DB, copies photos to R2
scp migration/dev.dump deploy@<droplet-ip>:~/
```

On the **server**:

```sh
./deploy/import-content.sh ~/dev.dump
rm ~/dev.dump
```

Log in with your dev email and password. Dev sessions and login history are
dropped, and any unused invite/reset links from dev are cancelled. (Starting
from scratch instead? Create an admin with
`docker compose -f compose.yaml -f compose.prod.yaml exec api python -m app.cli create-admin --email you@example.com --name "Your Name"`.)

Future deploys: push to GitHub, then `./deploy/deploy.sh` on the server.

## 5. Database backups

1. In Cloudflare, create a second private R2 bucket (e.g. `site-backups`)
   and an R2 API token with *Object Read & Write* on **that bucket only**.
2. `cp deploy/backup.env.example deploy/backup.env && chmod 600 deploy/backup.env`
   and fill it in. Setting `AGE_RECIPIENT` (encryption) is recommended.
3. Run it once by hand: `./deploy/backup.sh`
4. Schedule it with `crontab -e`:

   ```
   15 3 * * * /home/deploy/site/deploy/backup.sh >> /home/deploy/backup.log 2>&1
   ```

   That's daily at 03:15 UTC. For monthly instead, use `15 3 1 * *`.

**Restore** (test this once, so you know it works):

```sh
rclone copy r2:site-backups/db/<file> .          # with deploy/backup.env loaded
age --decrypt -i backup-key.txt -o db.dump <file>.age   # if encrypted (on a machine with the key)
docker compose -f compose.yaml -f compose.prod.yaml exec -T db \
  sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' < db.dump
```

Photos are not in these backups; they live in R2.

## Maintenance

- Security updates install automatically; the server reboots at 04:30 UTC
  when one needs it, and the containers start again on their own.
- Logs: `docker compose -f compose.yaml -f compose.prod.yaml logs -f api`
- **Image updates are manual.** Every image is pinned by digest
  (`image:tag@sha256:...`), so nothing changes until you change it. Every
  month or so, get the current digest for each tag:

  ```sh
  docker buildx imagetools inspect postgres:17-alpine | grep -m1 Digest
  ```

  update it in `compose.yaml`, `compose.prod.yaml`, `Dockerfile.web` and
  `api/Dockerfile` (commit that), then run `./deploy/deploy.sh`. Major version
  bumps (Postgres 17 → 18) need a dump and restore, not just a new tag.
- The site loads nothing from third-party CDNs: fonts, map data and scripts
  are bundled at build time, and the Content Security Policy in
  `deploy/traefik/dynamic.yml` makes the browser refuse anything else. If you
  add something external later, it has to be allowed there too.
