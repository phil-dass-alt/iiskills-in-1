# iiskills.in — Production-Readiness Checklist

> **Date reviewed:** 2026-03-24  
> **Stack:** Turborepo · 11 Next.js 15 apps · Yarn 4 · Node 22 · PM2 · Nginx · Supabase · single VPS

---

## 0 · GO / NO-GO Rubric

Ship only when **every** GO condition below is true.

| # | Condition | GO | NO-GO |
|---|-----------|-------|-------|
| 1 | All 11 apps build without errors (`yarn build` exits 0) | ✅ | ❌ block |
| 2 | `yarn lint` and `yarn typecheck` both exit 0 | ✅ | ❌ block |
| 3 | `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set as GitHub secrets | ✅ | ❌ block |
| 4 | `SUPABASE_SERVICE_ROLE_KEY` exists in VPS `.env.production.local` (not in Git) | ✅ | ❌ block |
| 5 | TLS certificates exist and are valid for all 11 subdomains | ✅ | ❌ block |
| 6 | `nginx -t` passes on VPS | ✅ | ❌ block |
| 7 | All 11 PM2 processes show `online` in `pm2 list` | ✅ | ❌ block |
| 8 | `pm2 save` + `pm2 startup` have been run (survives reboot) | ✅ | ❌ block |
| 9 | CI workflow passes on `main` branch | ✅ | ❌ block |
| 10 | Smoke test: `curl -I https://iiskills.in` returns HTTP 200 | ✅ | ❌ block |
| 11 | Firewall allows only 22 / 80 / 443 inbound | ✅ | ❌ block |
| 12 | Root SSH login disabled, deploy key or deploy user in place | ✅ | ❌ block |
| 13 | `fail2ban` or equivalent brute-force protection running | ✅ | ⚠ warn |
| 14 | Uptime monitor configured (e.g. UptimeRobot free) | ✅ | ⚠ warn |
| 15 | Cert auto-renewal tested (`certbot renew --dry-run`) | ✅ | ⚠ warn |

---

## 1 · VPS Hardening

### SSH

```bash
# 1a. Disable root login and password auth
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sudo systemctl reload sshd

# 1b. Create a non-root deploy user (once)
sudo adduser deploy --disabled-password --gecos ""
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh && sudo chmod 600 /home/deploy/.ssh/authorized_keys

# 1c. Give deploy user only sudo for pm2/nginx (no full sudo)
echo 'deploy ALL=(ALL) NOPASSWD: /usr/bin/nginx, /usr/bin/systemctl reload nginx, /usr/local/bin/pm2' \
  | sudo tee /etc/sudoers.d/deploy
```

- [ ] Root SSH login disabled (`PermitRootLogin no`)
- [ ] Password auth disabled (`PasswordAuthentication no`)
- [ ] Deploy user created with SSH key only
- [ ] Non-default SSH port considered (optional but helpful)
- [ ] `~/.ssh/authorized_keys` mode 600, `~/.ssh` mode 700

### Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP (redirect to HTTPS)'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw enable
sudo ufw status verbose
```

- [ ] Only ports 22, 80, 443 open inbound
- [ ] All Node.js ports (3000–3040) blocked externally (listen on 127.0.0.1 only)
- [ ] IPv6 rules mirrored (UFW handles this automatically)

### Automatic Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Verify config: /etc/apt/apt.conf.d/50unattended-upgrades
```

- [ ] `unattended-upgrades` enabled for security patches
- [ ] `apt-get upgrade` run before go-live
- [ ] Kernel updates scheduled (reboots during maintenance window)

### fail2ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
# Create /etc/fail2ban/jail.local:
cat << 'EOF' | sudo tee /etc/fail2ban/jail.local
[sshd]
enabled  = true
port     = ssh
filter   = sshd
maxretry = 5
bantime  = 3600
findtime = 600

[nginx-http-auth]
enabled  = true
EOF
sudo systemctl restart fail2ban
sudo fail2ban-client status sshd
```

- [ ] `fail2ban` installed and running
- [ ] SSH jail enabled (max 5 retries / 1 h ban)
- [ ] Nginx auth jail enabled if admin area is behind HTTP auth
- [ ] `fail2ban-client status` shows active jails

### Least Privilege

- [ ] Node.js processes run as `deploy` user, not root
- [ ] App directory owned by `deploy`, not world-writable
- [ ] `.env.production.local` mode 600, owned by `deploy`
- [ ] PM2 logs directory `/var/log/pm2` owned by `deploy`

---

## 2 · Nginx

### TLS via Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx

# Issue a wildcard cert (requires DNS challenge) or multi-domain cert:
sudo certbot certonly --nginx \
  -d iiskills.in -d www.iiskills.in -d admin.iiskills.in \
  -d learn-ai.iiskills.in -d learn-chemistry.iiskills.in \
  -d learn-developer.iiskills.in -d learn-geography.iiskills.in \
  -d learn-management.iiskills.in -d learn-math.iiskills.in \
  -d learn-physics.iiskills.in -d learn-pr.iiskills.in \
  -d learn-apt.iiskills.in

# Test auto-renewal
sudo certbot renew --dry-run

# Verify cron / systemd timer is active
systemctl list-timers | grep certbot
```

- [ ] Certificate covers all 12 subdomains (wildcard or multi-domain SAN)
- [ ] `options-ssl-nginx.conf` and `ssl-dhparams.pem` generated by Certbot
- [ ] TLS 1.2 minimum enforced (Certbot defaults)
- [ ] `certbot renew --dry-run` exits 0
- [ ] Certbot timer active (`systemctl is-active certbot.timer`)

### Redirects

- [ ] `http://` → `https://` 301 redirect for all domains
- [ ] `www.iiskills.in` → `iiskills.in` (or keep `www`, pick one)
- [ ] No mixed-content warnings in browser console

### Security Headers

Confirmed in `nginx/iiskills.in.conf` for every server block:

- [ ] `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [ ] `X-Frame-Options: SAMEORIGIN` (or `DENY` for admin)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- [ ] Verify with [securityheaders.com](https://securityheaders.com)

### Gzip / Brotli

- [ ] `gzip on` with `gzip_comp_level 6` (balance CPU vs ratio)
- [ ] `gzip_types` includes JS, CSS, JSON, SVG, fonts
- [ ] `gzip_vary on` so CDN/proxy stores both compressed and uncompressed
- [ ] (Optional) Install `libnginx-mod-http-brotli` for brotli support

### Caching Rules

- [ ] `/_next/static/**` → `Cache-Control: public, max-age=31536000, immutable`
- [ ] `/_next/image` → `Cache-Control: public, max-age=86400, stale-while-revalidate=3600`
- [ ] HTML pages → no `Cache-Control` override (Next.js sets appropriate headers)

### WebSocket Support

All server blocks include:

```nginx
proxy_set_header Upgrade    $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_cache_bypass          $http_upgrade;
```

- [ ] HMR (dev only) and any WS-based features work through proxy

### Timeouts

Each location block sets:

```nginx
proxy_connect_timeout  10s;
proxy_send_timeout     60s;
proxy_read_timeout     60s;
```

- [ ] `proxy_connect_timeout` ≤ 10 s (fail fast if app is down)
- [ ] `proxy_read_timeout` ≥ 60 s (covers slow server-rendered pages)

### Max Body Size

- [ ] `client_max_body_size 10m` for all learn apps
- [ ] `client_max_body_size 50m` for admin (file uploads)

### Upstream Health

```bash
# Verify all upstreams respond before enabling Nginx:
for PORT in 3000 3002 3005 3006 3007 3008 3009 3010 3011 3012 3040; do
  curl -sf http://127.0.0.1:${PORT}/api/health -o /dev/null \
    && echo "Port ${PORT} OK" || echo "Port ${PORT} FAIL"
done

# Rate-limiting zones (add to /etc/nginx/nginx.conf http block):
# limit_req_zone  $binary_remote_addr zone=iiskills_req:10m  rate=60r/m;
# limit_conn_zone $binary_remote_addr zone=iiskills_conn:10m;
```

- [ ] `keepalive 8` set on all upstream blocks (connection reuse)
- [ ] `nginx -t && systemctl reload nginx` after every config change
- [ ] Access log and error log paths confirmed (`/var/log/nginx/`)

---

## 3 · Node / Next.js Monorepo Production

### Node Version Pinning

```bash
# .nvmrc pinned to "22" (see repo root)
node --version   # must print v22.x.x
nvm use          # reads .nvmrc automatically
```

- [ ] `.nvmrc` exists at repo root (`22`)
- [ ] CI workflow uses `node-version-file: .nvmrc`
- [ ] VPS Node version matches: `node -e "require('assert').strictEqual(process.version.split('.')[0],'v22')"`
- [ ] `engines` field considered in root `package.json` (optional but good)

### Dependency Install

```bash
# Always use --immutable in CI and on the VPS
yarn install --immutable

# Verify no unresolved peer deps
yarn dedupe --check
```

- [ ] `yarn install --immutable` used in CI (fails if `yarn.lock` is stale)
- [ ] `yarn install --immutable` used in deploy script
- [ ] `node_modules` NOT committed to Git
- [ ] `.yarn/cache` committed or restored via CI cache (speeds up cold installs)

### Build vs Start Scripts

Each app has explicit port flags:

```json
"dev":   "next dev --port <PORT>",
"build": "next build",
"start": "next start --port <PORT>"
```

- [ ] All 11 apps have `start` scripts with correct ports
- [ ] `output: 'standalone'` enabled in each `next.config.ts` (required for PM2 standalone server)
- [ ] `.next/standalone/server.js` exists after build for each app
- [ ] Static files copied: `cp -r apps/<app>/.next/static apps/<app>/.next/standalone/.next/static`
- [ ] Public folder copied if present: `cp -r apps/<app>/public apps/<app>/.next/standalone/public`

> **Important:** Next.js standalone output requires manual copy of `public/` and `.next/static/` into the standalone directory. Add this to the deploy script.

### Environment Variable Strategy

```
Commit:     .env.example           (placeholder values only — safe)
Never:      .env.local             (real secrets — git-ignored)
VPS:        /srv/iiskills-in/.env.production.local (real secrets, mode 600)
CI:         GitHub Actions secrets (injected at build time via env:)
```

- [ ] `.env.example` committed and kept up to date with all required keys
- [ ] `.env.local` and `.env.production.local` in `.gitignore`
- [ ] No real secrets in `turbo.json`, `next.config.ts`, or source files
- [ ] `NEXT_PUBLIC_*` vars set as GitHub Actions secrets (needed at `next build`)
- [ ] Server-only vars (`SUPABASE_SERVICE_ROLE_KEY`) never in `NEXT_PUBLIC_*`
- [ ] `turbo.json` `globalPassThroughEnv` lists all vars needed during build

### `next.config.ts` — Standalone Output

Add to every app's `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... existing config
};
```

- [ ] All 11 apps have `output: 'standalone'`
- [ ] Confirm `.next/standalone/server.js` present after `yarn build`

---

## 4 · Process Management (PM2)

### Initial Setup

```bash
# Install PM2 globally
npm install -g pm2

# Install log rotation plugin
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown deploy:deploy /var/log/pm2
```

### Starting Apps

```bash
# Start all 11 apps from ecosystem config
pm2 start ecosystem.config.js

# Save process list for auto-start on reboot
pm2 save

# Generate and enable startup script (run as deploy user)
pm2 startup                         # prints a sudo command — run it
# e.g.: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
```

- [ ] `ecosystem.config.js` exists at repo root (see committed file)
- [ ] All 11 apps started via ecosystem config
- [ ] `pm2 list` shows all 11 processes `online`
- [ ] `pm2 save` run after last `pm2 start`
- [ ] `pm2 startup` run and the generated `sudo` command executed
- [ ] VPS rebooted and verified all 11 apps restart automatically

### Auto-restart & Memory Limits

Each process in `ecosystem.config.js` has:

```js
max_memory_restart: '512M',
autorestart: true,
min_uptime: '10s',
max_restarts: 10,
```

- [ ] `max_memory_restart` set per app (512 MB is a safe default for a learn app)
- [ ] `max_restarts: 10` prevents infinite restart loops on fatal crashes
- [ ] Check `pm2 monit` after 24 h in production for memory trends

### Log Rotation

- [ ] `pm2-logrotate` installed (`pm2 list` shows `pm2-logrotate` module)
- [ ] `max_size 50M`, `retain 14` days, `compress true`
- [ ] Logs in `/var/log/pm2/<name>-{out,err}.log`
- [ ] `logrotate` checked: `pm2 set pm2-logrotate:rotateInterval '0 0 * * *'`

### Graceful Reload (Zero-Downtime Deploy)

```bash
# Reload without downtime (sends SIGINT, waits, spawns new)
pm2 reload ecosystem.config.js --update-env

# Hard restart if reload hangs
pm2 restart ecosystem.config.js
```

- [ ] `kill_timeout: 10000` set (Next.js needs ~5–10 s to drain)
- [ ] `wait_ready: true` set (PM2 waits for process to signal readiness)
- [ ] Deploy script uses `pm2 reload`, not `pm2 restart`

---

## 5 · CI/CD (GitHub Actions)

### CI Workflow (`.github/workflows/ci.yml`)

Triggers on every push to `main` and every PR targeting `main`.

- [ ] `actions/checkout@v4` — always use a pinned major version
- [ ] `actions/setup-node@v4` with `node-version-file: .nvmrc`
- [ ] Corepack enabled before `yarn install`
- [ ] `yarn install --immutable` (fails if `yarn.lock` is dirty)
- [ ] `yarn lint` — ESLint across all apps
- [ ] `yarn typecheck` — `tsc --noEmit` across all apps
- [ ] `yarn build` — full Turbo build with Supabase env vars from secrets
- [ ] Build artifacts cached via Turbo remote cache (optional)
- [ ] CI workflow succeeds on `main` before deploying

### Deploy Workflow (`.github/workflows/deploy.yml`)

Triggers on push to `main`. Manual trigger supports a `rollback_sha` input.

- [ ] Builds on GitHub Actions (not on VPS) — avoids OOM on small VPS
- [ ] Uses `webfactory/ssh-agent` to inject deploy key
- [ ] `rsync` syncs built `.next/` directories to VPS (no `npm install` on VPS for each deploy)
- [ ] `pm2 reload ecosystem.config.js --update-env` for zero-downtime
- [ ] Smoke test: `curl https://iiskills.in` returns 200
- [ ] Rollback step on failure: re-runs `pm2 reload` with existing build

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```
VPS_HOST                    — IP or hostname of VPS
VPS_USER                    — SSH deploy user (e.g. "deploy")
VPS_SSH_KEY                 — Private SSH key (no passphrase)
VPS_DEPLOY_PATH             — e.g. /srv/iiskills-in
NEXT_PUBLIC_SUPABASE_URL    — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key
```

- [ ] All 6 secrets added to GitHub repository
- [ ] `VPS_SSH_KEY` public part added to VPS `~/.ssh/authorized_keys`
- [ ] Deploy workflow runs successfully end-to-end at least once manually

### Rollback Strategy

```bash
# Option A — re-deploy a specific SHA via workflow_dispatch
# GitHub UI → Actions → Deploy → Run workflow → enter rollback_sha

# Option B — manual on VPS (last resort)
cd /srv/iiskills-in
git checkout <previous-sha>
yarn install --immutable
yarn build
pm2 reload ecosystem.config.js --update-env
```

- [ ] Rollback procedure documented (this checklist)
- [ ] At least one full deploy + rollback tested before go-live

---

## 6 · Observability

### Structured Logs

```bash
# PM2 logs are in /var/log/pm2/
pm2 logs --lines 100 main
pm2 logs --lines 100 learn-ai

# Tail all logs in real time
pm2 logs
```

- [ ] PM2 log files confirmed at `/var/log/pm2/`
- [ ] `log_date_format: 'YYYY-MM-DD HH:mm:ss Z'` in `ecosystem.config.js`
- [ ] `merge_logs: true` (stdout + stderr in one file per app)
- [ ] (Optional) Ship logs to a log aggregator (Loki + Grafana, or Datadog free tier)

### Error Tracking

```bash
# Sentry free tier — add to each Next.js app
yarn workspace @iiskills/main add @sentry/nextjs
# npx @sentry/wizard@latest -i nextjs  (interactive setup)
```

- [ ] Sentry (or equivalent) DSN configured via `NEXT_PUBLIC_SENTRY_DSN` env var
- [ ] Sentry source maps uploaded during `next build`
- [ ] Alert rule: notify on first occurrence of new error
- [ ] (Minimum) `console.error` calls visible in PM2 error logs

### Metrics

- [ ] `pm2 monit` — live CPU/RAM per process
- [ ] (Optional) `pm2-prometheus-exporter` + Grafana for trending
- [ ] VPS-level metrics: `htop`, `df -h`, `free -h` checked daily initially

### Uptime Checks

```bash
# UptimeRobot (free, 5-min intervals) — check all 11 subdomains:
# https://iiskills.in
# https://learn-ai.iiskills.in
# … (all 11)
```

- [ ] Uptime monitor configured for all 11 public URLs
- [ ] Alert email/Slack webhook configured for downtime
- [ ] SSL expiry check configured (UptimeRobot or `certbot certificates`)

### Alerts

- [ ] Alert on: process crash (`pm2` restart > 3 times in 5 min)
- [ ] Alert on: HTTP 5xx rate spike (Nginx access log grep or monitoring tool)
- [ ] Alert on: cert expiry < 30 days (`certbot certificates` in a cron)
- [ ] Alert on: disk > 85% (`df -h` cron alert)

---

## 7 · Backup & Recovery

### Configuration Backups

```bash
# Back up Nginx config, ecosystem config, and .env files
tar -czf /srv/backups/config-$(date +%Y%m%d).tar.gz \
  /etc/nginx/sites-available/ \
  /srv/iiskills-in/ecosystem.config.js \
  /srv/iiskills-in/.env.production.local \
  /etc/letsencrypt/
```

- [ ] `/etc/nginx/` backed up (or version-controlled configs symlinked from repo)
- [ ] `ecosystem.config.js` committed to Git
- [ ] `.env.production.local` backed up to encrypted off-VPS storage (NOT Git)
- [ ] Backups run via cron: `0 3 * * * /srv/scripts/backup-configs.sh`

### App Data

- [ ] Next.js apps are stateless (no local file state)
- [ ] Any uploaded files backed up if stored on disk
- [ ] Supabase handles its own backups (verify under Supabase dashboard → Backups)

### Database (Supabase)

```bash
# Point-in-time recovery is available on Supabase paid plans.
# On free plan, export regularly:
pg_dump "postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres" \
  -f /srv/backups/db-$(date +%Y%m%d).sql
```

- [ ] Supabase automatic backups enabled (verify in dashboard)
- [ ] Manual SQL dump scheduled weekly (cron) and uploaded to off-site storage
- [ ] Recovery procedure tested: `psql < /srv/backups/db-<date>.sql` works

### Certificate Renewal Verification

```bash
# Certbot auto-renewal systemd timer
systemctl is-active certbot.timer       # should print "active"
systemctl next certbot.timer            # shows next renewal attempt

# Manual dry run (test every 3 months)
sudo certbot renew --dry-run

# Add cron alert for cert expiry < 30 days
0 8 * * * certbot certificates 2>&1 | grep -E 'VALID: [0-9]+ day' \
  | awk '{if ($NF+0 < 30) print "CERT EXPIRING: " $0}' | mail -s "Cert Warning" admin@iiskills.in
```

- [ ] `certbot.timer` active and next run confirmed
- [ ] `certbot renew --dry-run` passes
- [ ] Cert expiry alert cron in place

---

## 8 · Top 20 Single-VPS Next.js Monorepo Production Blockers

These are the most common reasons a deployment fails or degrades in production.

| # | Blocker | Fix |
|---|---------|-----|
| 1 | **`output: 'standalone'` not set** — PM2 can't find `server.js` | Add `output: 'standalone'` to every `next.config.ts` |
| 2 | **`public/` and `.next/static/` not copied into standalone dir** — 404 on all assets | `cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public` |
| 3 | **Build-time env vars missing** — `NEXT_PUBLIC_*` undefined in HTML | Add to GitHub Actions `env:` block and `turbo.json` `globalPassThroughEnv` |
| 4 | **`yarn install` skipped on VPS** — stale `node_modules` after `git pull` | Run `yarn install --immutable` in every deploy script |
| 5 | **PM2 not persisted** — all apps gone after VPS reboot | Run `pm2 save` + `pm2 startup` and execute the printed `sudo` command |
| 6 | **Node.js version mismatch** — different Node on VPS vs CI | Pin `.nvmrc` to `22`, use `nvm use` in deploy script |
| 7 | **Port collision** — two apps share a port | Verify port map in `ecosystem.config.js` matches `nginx/iiskills.in.conf` |
| 8 | **Nginx `server_name` mismatch** — wrong subdomain served | Each subdomain must have exactly one matching `server_name` directive |
| 9 | **`iiskills.cloud` config accidentally enabled** — port 80/443 collision | Keep `iiskills.cloud.conf` in `sites-available` only, never symlink |
| 10 | **No `client_max_body_size`** — file uploads fail with 413 | Set `client_max_body_size 10m` (50m for admin) |
| 11 | **HSTS preload without testing** — blocks HTTP access for years | Test redirect flow first; only add `preload` after confirming HTTPS works |
| 12 | **`turbo: latest`** — non-deterministic builds | Pin Turbo to an exact version in `package.json` |
| 13 | **Secrets in `.env.local` committed to Git** | Verify `.gitignore` covers all `.env*` variants; run `git log -p .env.local` |
| 14 | **`pm2 restart` used instead of `pm2 reload`** — causes downtime | Use `pm2 reload ecosystem.config.js --update-env` for zero-downtime deploys |
| 15 | **Turbo build cache not invalidated after env change** — stale build served | Run `turbo clean` or delete `.turbo/` when env vars change |
| 16 | **No health-check endpoint** — Nginx can't distinguish app crash from slow response | Add `GET /api/health` returning `{"status":"ok"}` to each app |
| 17 | **Large `.next/cache` bloating VPS disk** — OOM or disk full during build | Build on CI (not VPS), rsync only `.next/standalone/` and `.next/static/` |
| 18 | **Supabase anon key in server-side code** — exposes Row Level Security bypass opportunity | Ensure `SUPABASE_SERVICE_ROLE_KEY` is never in `NEXT_PUBLIC_*` and never logged |
| 19 | **No log rotation** — `/var/log/pm2/` fills disk over weeks | Install `pm2-logrotate`; set `max_size 50M`, `retain 14` |
| 20 | **Cert renewal blocks on interactive prompt** — auto-renewal silently fails | Ensure certbot is configured non-interactively; test with `certbot renew --dry-run` |

---

## Quick Reference — Daily Operator Commands

```bash
# Check all app statuses
pm2 list

# Tail all logs (Ctrl+C to exit)
pm2 logs

# Check Nginx config and reload
sudo nginx -t && sudo systemctl reload nginx

# Zero-downtime redeploy (after rsync)
pm2 reload ecosystem.config.js --update-env

# Check TLS cert expiry
sudo certbot certificates

# Check disk usage
df -h /srv /var/log

# UFW firewall status
sudo ufw status verbose

# Fail2ban banned IPs
sudo fail2ban-client status sshd
```

---

*Last updated: 2026-03-24 by Copilot coding agent.*
