#!/usr/bin/env bash
# After DNS A for api.carlmanuel.com → 162.213.253.122:
# 1) Attach addon domain in cPanel (document root = public_html/api-carlxaeron/public)
# 2) Run this script on the hosting account (SSH)
set -euo pipefail
DOMAIN="${1:-api.carlmanuel.com}"
WEBROOT="${HOME}/public_html/api-carlxaeron/public"
export PATH="${HOME}/.acme.sh:${PATH}"
~/.acme.sh/acme.sh --issue -d "$DOMAIN" -w "$WEBROOT" --keylength 2048 --force
~/.acme.sh/acme.sh --deploy -d "$DOMAIN" --deploy-hook cpanel_uapi
echo "Issued + deployed SSL for ${DOMAIN}"
