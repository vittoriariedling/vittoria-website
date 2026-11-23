# Operations runbook

What keeps the site healthy after it's deployed: what runs by itself, what
to check and when, and what to do when something specific comes up. Setup
from scratch is in [README.md](README.md).

All server commands run as `deploy` from the repo folder:

```sh
ssh deploy@<droplet-ip>
cd ~/site
```

Commands marked **(laptop)** run in WSL in your local copy of the repo.

## At a glance

| When | Task | Time |
|---|---|---|
| Daily | Nothing (all automatic, see below) | — |
| Weekly | [Quick health check](#weekly-quick-health-check) | 2 min |
| Monthly | [Updates and housekeeping](#monthly-updates-and-housekeeping) | 20–30 min |
| Quarterly | [Restore test and access review](#quarterly-restore-test-and-access-review) | 30 min |
| Yearly | [Renewals and long-term planning](#yearly-renewals-and-long-term-planning) | 15 min |
| As needed | [Deploys, people, incidents](#as-needed) | — |

## What runs by itself

| What | When | Where to look if it breaks |
|---|---|---|
| Database backup → R2 (encrypted, 30 days kept, 7 days on the server) | Daily 03:15 UTC | `~/backup.log` |
| Ubuntu security updates | Daily | `/var/log/unattended-upgrades/` |
| Reboot when an update needs it (containers restart on their own) | 04:30 UTC, only if needed | `last reboot` |
| HTTPS certificate renewal (Let's Encrypt via Traefik) | ~30 days before expiry | `docker compose -f compose.yaml -f compose.prod.yaml logs traefik` |
| Old login history deleted (older than 180 days) | On every successful login | — |
| fail2ban blocking repeated SSH failures | Continuously | `sudo fail2ban-client status sshd` |

Not automatic, on purpose: Docker image updates, Docker Engine updates,
and app dependency updates. Those are the monthly tasks.

## Weekly: quick health check

- [ ] Site is up: open `https://<your-domain>` and log in.
- [ ] Last backup succeeded:
  ```sh
  tail -3 ~/backup.log        # last line: "backup ok: db-<date>.dump.age (...)"
  ```
  The date should be today or yesterday. If it says anything else, see
  [Backup failed](#backup-failed).

## Monthly: updates and housekeeping

**1. Check for image updates (laptop)**

```sh
git checkout main && git pull
./deploy/check-image-updates.sh
```

For each `UPDATE AVAILABLE`, replace the old digest with the new one in the
files it lists, then:

```sh
git checkout -b image-updates-$(date +%Y-%m)
git commit -am "Update image digests"
git push -u origin HEAD      # open a PR on GitHub and merge it
```

Then on the server: `./deploy/deploy.sh`, and check the site still works.

**2. Check for app dependency vulnerabilities (laptop)**

```sh
npm audit
docker compose run --rm --no-deps -T api sh -c "pip install -q --user pip-audit && ~/.local/bin/pip-audit -r requirements.txt"
```

If either reports problems, ask Claude to update them (or `npm audit fix`
for the JavaScript side), test locally, then PR, merge and deploy as above.

**3. Update Docker Engine on the server**

Security updates don't cover Docker (it comes from Docker's own repository):

```sh
sudo apt update && sudo apt upgrade -y
[ -f /var/run/reboot-required ] && echo "reboot needed" || echo "no reboot needed"
```

If a reboot is needed, either let the 04:30 auto-reboot handle it or run
`sudo reboot` now (the site is down for about a minute).

**4. Housekeeping on the server**

```sh
df -h /                       # disk use; act if above ~80%
free -h                       # memory; if swap is heavily used, consider 2 GB
docker system df              # space used by images and build cache
docker builder prune -f       # clear old build cache (safe)
```

**5. Look at the Logins tab** (admin → Logins)

- [ ] Any account with lots of failed attempts?
- [ ] Any account logging in from an IP or country you don't recognise?

If something looks wrong, see [Suspicious logins](#suspicious-logins).

## Quarterly: restore test and access review

**1. Test that a backup actually restores (laptop)**

This restores into a throwaway database on your laptop. Production is never
touched.

```sh
# On the server: fetch last night's backup into ~/backups
f=$(./deploy/rclone.sh lsf r2:backups/db/ | sort | tail -1); echo "$f"
./deploy/rclone.sh copy "r2:backups/db/$f" /backups/
```

```sh
# Laptop (WSL): download, decrypt with the key from your password manager
scp deploy@<droplet-ip>:~/backups/<file>.age .
nano ~/backup-key.txt && chmod 600 ~/backup-key.txt      # paste the key
age --decrypt -i ~/backup-key.txt -o restore-test.dump <file>.age

# Restore into a temporary Postgres and count what's there
docker run -d --name restore-test -e POSTGRES_PASSWORD=restore-test postgres:17-alpine
until docker exec restore-test pg_isready -h 127.0.0.1 -U postgres -q; do sleep 1; done
docker exec -i restore-test pg_restore -h 127.0.0.1 -U postgres -d postgres --no-owner < restore-test.dump
docker exec restore-test psql -h 127.0.0.1 -U postgres -c "select (select count(*) from users) as users, (select count(*) from posts) as newsletters, (select count(*) from books) as books, (select count(*) from media) as photos, (select max(updated_at)::date from posts) as last_newsletter_edit"

# Clean up: the dump and the key contain personal data
docker rm -f restore-test
rm restore-test.dump <file>.age ~/backup-key.txt
```

- [ ] Restore finished without errors.
- [ ] The counts look right and `last_newsletter_edit` is recent.

Then delete the copy on the server: `rm ~/backups/<file>.age`.

**2. Review who has access** (admin → People)

- [ ] Revoke invite links that are still active but no longer needed.
- [ ] Deactivate anyone who shouldn't have access any more.
- [ ] Check who is an admin.

**3. Review cloud access**

- [ ] DigitalOcean firewall: the SSH rule allows only your current IP.
- [ ] Cloudflare → R2 → API tokens: only `site-photos` and `site-backups`
  exist; delete anything else. `site-backups` still has its IP filter.
- [ ] GitHub → repo → Settings → Deploy keys: only the server's read-only key.
- [ ] Two-factor authentication is still on for DigitalOcean, Cloudflare and GitHub.

**4. Check upstream versions**

- [ ] [Traefik releases](https://github.com/traefik/traefik/releases): if a
  newer v3 minor version is out (e.g. v3.8), switch the tag in
  `compose.prod.yaml`. Only the newest minor version gets security fixes.
- [ ] nginx: a new stable line comes out each spring (1.30 → 1.32). Switch
  the tag in `Dockerfile.web` when it does.

## Yearly: renewals and long-term planning

- [ ] **Domain**: auto-renew is on at the registrar, and the card on file is
  valid. WHOIS privacy still on (check at lookup.icann.org).
- [ ] **Billing**: look over the DigitalOcean and Cloudflare invoices. Set a
  billing alert in DigitalOcean (Billing → Billing alerts) if you haven't.
- [ ] **End-of-life dates**: plan an upgrade a few months ahead of each.

  | Component | Support ends | Upgrade means |
  |---|---|---|
  | Node 24 (build only) | April 2028 | Change the tag in `Dockerfile.web` and `compose.override.yaml` |
  | Ubuntu 24.04 LTS | April 2029 | New Droplet on the next LTS, then redeploy and restore (README) |
  | Python 3.13 | October 2029 | Change the tag in `api/Dockerfile`, run the tests |
  | PostgreSQL 17 | November 2029 | Back up, switch to the new major version, restore. Not just a tag change |

## As needed

### Deploying a code change

1. Make and test the change locally, open a PR, merge into `main`.
2. Server: `./deploy/deploy.sh`
3. Check the site. If the change touched the database, migrations run
   automatically when the API starts:
   `docker compose -f compose.yaml -f compose.prod.yaml logs api | grep -i alembic`

### Adding or removing people

- **Invite**: admin → People → create an invite (email-bound or a shareable link).
- **Forgotten password**: admin → People → *Reset link* next to their name,
  and send them the link. For your own account, see
  [Suspicious logins](#suspicious-logins) step 3.
- **Remove**: admin → People → *Deactivate*. They're logged out everywhere
  at once.

### Your home IP changed (SSH times out)

DigitalOcean → Networking → Firewalls → your firewall → edit the SSH rule to
your new IP. You can still reach the dashboard from anywhere.

### Backup failed

```sh
tail -20 ~/backup.log
./deploy/backup.sh            # run it by hand to see the error
```

- `403 Forbidden`: the `site-backups` token's IP filter doesn't include the
  server's current IP, or `BACKUP_BUCKET` in `deploy/backup.env` isn't `backups`.
- `pg_dump` errors: is the database running?
  `docker compose -f compose.yaml -f compose.prod.yaml ps`

### Site is down

```sh
docker compose -f compose.yaml -f compose.prod.yaml ps                 # all four should be "Up"
docker compose -f compose.yaml -f compose.prod.yaml logs --tail 50 api
docker compose -f compose.yaml -f compose.prod.yaml logs --tail 50 traefik
docker compose -f compose.yaml -f compose.prod.yaml up -d              # start anything that stopped
```

Certificate problem? Check its expiry date:
```sh
echo | openssl s_client -connect <your-domain>:443 -servername <your-domain> 2>/dev/null | openssl x509 -noout -enddate
```

Server out of memory during a deploy (build killed)? Resize the Droplet to
2 GB: DigitalOcean → Droplet → Resize → **CPU and RAM only**.

### Suspicious logins

1. Admin → Logins: note the account and IP.
2. If it's someone else's account: *Deactivate* them, then send a reset
   link once you've confirmed with them.
3. If it's your account, make yourself a reset link on the server (the
   admin page only offers reset links for other people):
   ```sh
   docker compose -f compose.yaml -f compose.prod.yaml exec api python -m app.cli reset-link --email you@example.com
   ```
   Open the link and set a new password. That logs out every session,
   including whoever else was logged in as you. Works for any account, and
   also if you've simply forgotten your own password.

### Suspected server compromise or leaked secret

Do whichever apply. After each `.env` change, run `./deploy/deploy.sh`.

- **R2 key leaked**: Cloudflare → R2 → API tokens → create a new token with
  the same settings, put its keys in `.env` (photos) or `deploy/backup.env`
  (backups), deploy, then delete the old token.
- **JWT secrets**: generate two new ones (command at the top of `.env`),
  replace both, deploy. Everyone is logged out.
- **Postgres password**: generate a new one, then:
  ```sh
  docker compose -f compose.yaml -f compose.prod.yaml exec db \
    sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "ALTER USER \"$POSTGRES_USER\" PASSWORD '"'"'<new-password>'"'"';"'
  ```
  Put the same value in `.env` as `POSTGRES_PASSWORD` and deploy.
- **SSH key leaked**: put your new public key in `~/.ssh/authorized_keys`
  (and remove the old one) before closing your current session.
- **Server itself compromised**: don't try to clean it. Create a new
  Droplet from the README, restore last night's backup, rotate every secret
  above, then destroy the old Droplet.
