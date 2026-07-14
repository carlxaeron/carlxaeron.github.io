#!/usr/bin/env bash
# Load local Namecheap credentials then start the MCP server (stdio).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy .env.example to .env and fill Namecheap API credentials." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${NAMECHEAP_API_KEY:-}" || -z "${NAMECHEAP_API_USER:-}" || -z "${NAMECHEAP_USERNAME:-}" ]]; then
  echo "NAMECHEAP_API_USER, NAMECHEAP_USERNAME, and NAMECHEAP_API_KEY are required in .env" >&2
  exit 1
fi

exec node "$ROOT/dist/index.js"
