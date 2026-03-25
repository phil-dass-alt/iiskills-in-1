#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# ============================================================
# iiskills.in VPS deploy (Yarn workspaces monorepo apps/*) + PM2 + nginx
# - Updates repo
# - Stops PM2 apps (best-effort)
# - DISABLES nginx sites for iiskills.in by removing symlinks from sites-enabled ONLY
# - Yarn install at repo root
# - Builds apps via yarn workspaces (from repo root)
# - Starts PM2 apps one-by-one on fixed ports
# - Saves PM2 process list (assumes pm2 startup already set)
# ============================================================

REPO_DIR="${REPO_DIR:-/var/www/iiskills-in}"
BRANCH="${BRANCH:-main}"

APPS_DIR="${APPS_DIR:-apps}"

NGINX_SITES_AVAILABLE="${NGINX_SITES_AVAILABLE:-/etc/nginx/sites-available}"
NGINX_SITES_ENABLED="${NGINX_SITES_ENABLED:-/etc/nginx/sites-enabled}"
DOMAIN_ROOT="iiskills.in"

PM2_NAMESPACE="${PM2_NAMESPACE:-iiskills}"
NODE_ENV="${NODE_ENV:-production}"

# If your workspaces are named like "@iiskills/main", "@iiskills/learn-math", etc:
WORKSPACE_PREFIX="${WORKSPACE_PREFIX:-@iiskills}"

log() { printf "\n[%s] %s\n" "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$*"; }
die() { echo "ERROR: $*" >&2; exit 1; }

require_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

sudo_if_needed() { if [[ "${EUID}" -ne 0 ]]; then sudo "$@"; else "$@"; fi; }

confirm_danger() {
  cat >&2 <<EOF

DANGER:
You asked to DISABLE nginx sites for:
- iiskills.in
- *.iiskills.in

This script will REMOVE matching symlinks/files from:
- ${NGINX_SITES_ENABLED}

It will NOT delete anything from:
- ${NGINX_SITES_AVAILABLE}

Type EXACTLY: DISABLE-IISKILLS-NGINX
to continue:
EOF
  read -r ans
  [[ "$ans" == "DISABLE-IISKILLS-NGINX" ]] || die "Aborted."
}

# ----------------------------
# App -> port map (learn-ai removed)
# ----------------------------
declare -A PORTS=(
  ["main"]="3000"

  ["learn-management"]="3016"
  ["learn-math"]="3017"
  ["learn-geography"]="3011"
  ["learn-physics"]="3020"
  ["learn-pr"]="3021"

  ["learn-chemistry"]="3005"
  ["learn-apt"]="3002"
  ["learn-developer"]="3007"
)

ORDER=(
  "main"
  "learn-management"
  "learn-math"
  "learn-geography"
  "learn-physics"
  "learn-pr"
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

log "Disabling nginx sites for *${DOMAIN_ROOT} (remove from sites-enabled ONLY)"
# Safer than matching everything: only remove entries in sites-enabled.
sudo_if_needed bash -c "rm -f '${NGINX_SITES_ENABLED}'/*'${DOMAIN_ROOT}'* 2>/dev/null || true"

log "nginx config test (after disabling sites)"
sudo_if_needed nginx -t

log "Reloading nginx"
# Use reload so nginx keeps running even if no sites remain enabled.
sudo_if_needed nginx -s reload

log "Root install (immutable when possible)"
if yarn --version | grep -qE '^(2|3|4)\.'; then
  yarn install --immutable
else
  yarn install --frozen-lockfile
fi

log "Build apps one-by-one (Yarn workspaces)"
for app in "${ORDER[@]}"; do
  # Workspace name assumption: "${WORKSPACE_PREFIX}/${app}"
  ws="${WORKSPACE_PREFIX}/${app}"
  log "Building workspace ${ws}"
  NODE_ENV="${NODE_ENV}" yarn workspace "${ws}" run build
done

log "Start PM2 apps one-by-one with fixed ports"
for app in "${ORDER[@]}"; do
  port="${PORTS[${app}]:-}"
  [[ -n "${port}" ]] || die "No port configured for app: ${app}"

  app_dir="${REPO_DIR}/${APPS_DIR}/${app}"
  [[ -d "${app_dir}" ]] || die "Missing app dir: ${app_dir}"

  ws="${WORKSPACE_PREFIX}/${app}"

  log "Starting ${app} on port ${port} via PM2 (workspace ${ws})"

  pm2 start bash \
    --name "${PM2_NAMESPACE}:${app}" \
    --cwd "${REPO_DIR}" \
    --interpreter bash \
    -- \
    -lc "export NODE_ENV='${NODE_ENV}'; export PORT='${port}'; yarn workspace '${ws}' run start -- -p '${port}' || yarn workspace '${ws}' run start"
done

log "Saving PM2 process list (pm2 startup assumed already configured)"
pm2 save

log "Done. Current PM2 status:"
pm2 ls
