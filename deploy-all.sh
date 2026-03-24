#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# ============================================================
# iiskills.in VPS deploy (monorepo apps/*) + PM2 + nginx
# - Stops PM2 apps
# - Deletes nginx site configs for iiskills.in and *.iiskills.in (AS REQUESTED)
# - Yarn install at repo root
# - Builds apps one-by-one
# - Starts PM2 apps one-by-one on fixed ports
#
# Assumptions:
# - repo at /var/www/iiskills-in (override with REPO_DIR)
# - apps are at iiskills-in/apps/<app>
# - each app supports either:
#     PORT=xxxx yarn start
#   or:
#     PORT=xxxx yarn start -p xxxx
#   or:
#     next start -p xxxx (typical Next.js)
# ============================================================

REPO_DIR="${REPO_DIR:-/var/www/iiskills-in}"
BRANCH="${BRANCH:-main}"

APPS_DIR="${APPS_DIR:-apps}"

NGINX_SITES_AVAILABLE="${NGINX_SITES_AVAILABLE:-/etc/nginx/sites-available}"
NGINX_SITES_ENABLED="${NGINX_SITES_ENABLED:-/etc/nginx/sites-enabled}"
DOMAIN_ROOT="iiskills.in"

# Node/yarn/pm2 config
PM2_NAMESPACE="${PM2_NAMESPACE:-iiskills}"
NODE_ENV="${NODE_ENV:-production}"

# If your apps require other env vars, export them before running this script:
# export DATABASE_URL=...
# export NEXT_PUBLIC_...=...

log() { printf "\n[%s] %s\n" "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"; }
die() { echo "ERROR: $*" >&2; exit 1; }

require_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

sudo_if_needed() { if [[ "${EUID}" -ne 0 ]]; then sudo "$@"; else "$@"; fi; }

confirm_danger() {
  cat >&2 <<EOF

DANGER:
You asked to DELETE nginx site configs/symlinks for:
- iiskills.in
- *.iiskills.in

This script will remove matching files from:
- ${NGINX_SITES_ENABLED}
- ${NGINX_SITES_AVAILABLE}

Type EXACTLY: DELETE-IISKILLS-NGINX
to continue:
EOF
  read -r ans
  [[ "$ans" == "DELETE-IISKILLS-NGINX" ]] || die "Aborted."
}

# ----------------------------
# App -> port map (from user)
# ----------------------------
# All apps live under iiskills-in/apps/<name>
# Adjust app folder names here if your actual directories differ.
declare -A PORTS=(
  ["main"]="3000"

  ["learn-management"]="3016"
  ["learn-math"]="3017"
  ["learn-geography"]="3011"
  ["learn-physics"]="3020"
  ["learn-pr"]="3021"
  ["learn-ai"]="3024"

  ["learn-chemistry"]="3005"
  ["learn-apt"]="3002"
  ["learn-developer"]="3007"
)

# Build/start order (main first, then learn apps)
ORDER=(
  "main"
  "learn-management"
  "learn-math"
  "learn-geography"
  "learn-physics"
  "learn-pr"
  "learn-ai"
  "learn-chemistry"
  "learn-apt"
  "learn-developer"
)

# ----------------------------
# Start
# ----------------------------
require_cmd git
require_cmd yarn
require_cmd pm2
require_cmd nginx

confirm_danger

log "cd ${REPO_DIR}"
cd "${REPO_DIR}"

log "Updating repo to origin/${BRANCH}"
git fetch --prune origin
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"

log "Stopping PM2 apps (best-effort)"
for app in "${ORDER[@]}"; do
  pm2 delete "${PM2_NAMESPACE}:${app}" >/dev/null 2>&1 || true
done

log "Deleting nginx sites for *${DOMAIN_ROOT} (as requested)"
sudo_if_needed bash -c "rm -f '${NGINX_SITES_ENABLED}'/*'${DOMAIN_ROOT}'* 2>/dev/null || true"
sudo_if_needed bash -c "rm -f '${NGINX_SITES_AVAILABLE}'/*'${DOMAIN_ROOT}'* 2>/dev/null || true"

log "nginx config test (after deletion)"
sudo_if_needed nginx -t

log "Root install (immutable when possible)"
if yarn --version | grep -qE '^(2|3|4)\.'; then
  yarn install --immutable
else
  yarn install --frozen-lockfile
fi

log "Build apps one-by-one"
for app in "${ORDER[@]}"; do
  app_dir="${REPO_DIR}/${APPS_DIR}/${app}"
  [[ -d "${app_dir}" ]] || die "Missing app dir: ${app_dir}"

  log "Building ${app} (dir: ${app_dir})"
  pushd "${app_dir}" >/dev/null

  # Build only if script exists
  if yarn -s run | grep -qE '^  build$'; then
    NODE_ENV="${NODE_ENV}" yarn build
  else
    die "No build script found in ${APPS_DIR}/${app}/package.json"
  fi

  popd >/dev/null
done

log "Start PM2 apps one-by-one with fixed ports"
for app in "${ORDER[@]}"; do
  port="${PORTS[${app}]:-}"
  [[ -n "${port}" ]] || die "No port configured for app: ${app}"

  app_dir="${REPO_DIR}/${APPS_DIR}/${app}"
  [[ -d "${app_dir}" ]] || die "Missing app dir: ${app_dir}"

  log "Starting ${app} on port ${port} via PM2"
  # Try common start patterns:
  # 1) yarn start -- -p PORT
  # 2) yarn start (PORT env)
  # We use a small wrapper so it works regardless of whether the app uses Next or another server.
  pm2 start bash \
    --name "${PM2_NAMESPACE}:${app}" \
    --cwd "${app_dir}" \
    --interpreter bash \
    -- \
    -lc "export NODE_ENV='${NODE_ENV}'; export PORT='${port}'; if yarn -s run | grep -qE '^  start$'; then yarn start -- -p '${port}' || yarn start; else node -e \"console.error('No start script in package.json'); process.exit(1)\"; fi
