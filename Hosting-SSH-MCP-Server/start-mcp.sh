#!/usr/bin/env bash
# Load local SSH credentials then start the Hosting SSH MCP server (stdio).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy .env.example to .env and set SSH key path." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

KEY_PATH="${SSH_PRIVATE_KEY_PATH:-.ssh/tahanan_mcp}"
if [[ "$KEY_PATH" != /* ]]; then
  KEY_PATH="$ROOT/$KEY_PATH"
fi

if [[ ! -f "$KEY_PATH" && -z "${SSH_PASSWORD:-}" ]]; then
  echo "SSH key not found at $KEY_PATH and SSH_PASSWORD is empty." >&2
  exit 1
fi

if [[ ! -f "$ROOT/dist/index.js" ]]; then
  echo "dist/index.js missing — run: cd \"$ROOT\" && npm install && npm run build" >&2
  exit 1
fi

exec node "$ROOT/dist/index.js"
