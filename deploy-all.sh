#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'
# ... [your script comments and variables above remain unchanged] ...

# ----------------------------
# Stop and clean existing PM2 apps, delete nginx configs one by one
# ----------------------------

log "Stopping and deleting PM2 apps (one-by-one for OOM safety)"
for app in "${ORDER[@]}"; do
  log "Stopping and deleting PM2 for $app (namespace: ${PM2_NAMESPACE})"
  pm2 stop    "${PM2_NAMESPACE}:${app}" >/dev/null 2>&1 || true
  pm2 delete  "${PM2_NAMESPACE}:${app}" >/dev/null 2>&1 || true
  sleep 2  # quick pause for stability
done

log "Deleting nginx configs for *${DOMAIN_ROOT} (and subdomains, one-by-one)"
for app in "${ORDER[@]}"; do
  # NGINX config files might be named with either the app or full subdomain (pattern match both)
  sudo_if_needed bash -c "rm -f ${NGINX_SITES_ENABLED}/${app}.${DOMAIN_ROOT} 2>/dev/null || true"
  sudo_if_needed bash -c "rm -f ${NGINX_SITES_ENABLED}/*${app}*${DOMAIN_ROOT}* 2>/dev/null || true"
  sudo_if_needed bash -c "rm -f ${NGINX_SITES_AVAILABLE}/${app}.${DOMAIN_ROOT} 2>/dev/null || true"
  sudo_if_needed bash -c "rm -f ${NGINX_SITES_AVAILABLE}/*${app}*${DOMAIN_ROOT}* 2>/dev/null || true"
  sleep 2  # prevent disk IO spikes and ensure sequence
done

# Optionally clean main domain configs
sudo_if_needed bash -c "rm -f ${NGINX_SITES_ENABLED}/${DOMAIN_ROOT} 2>/dev/null || true"
sudo_if_needed bash -c "rm -f ${NGINX_SITES_AVAILABLE}/${DOMAIN_ROOT} 2>/dev/null || true"

log "nginx config test (after deletion, before deploy)"
sudo_if_needed nginx -t
