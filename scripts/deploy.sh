#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# CrackGate deploy — pull latest, rebuild web image, rolling restart.
# Run as the `deploy` user from inside the repo:
#     cd ~/crackgate && ./scripts/deploy.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env.production ]]; then
  echo "❌ .env.production not found. Copy .env.production.example and fill it in." >&2
  exit 1
fi

log() { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }

log "Pulling latest from origin/main"
git fetch --all --prune
git checkout main
git pull --ff-only origin main

log "Building images (web)"
docker compose --env-file .env.production build web

log "Starting / updating stack"
docker compose --env-file .env.production up -d --remove-orphans

log "Waiting for web to become healthy"
for i in {1..30}; do
  status=$(docker inspect --format='{{.State.Health.Status}}' crackgate-web-1 2>/dev/null || echo "starting")
  if [[ "$status" == "healthy" ]]; then
    echo "✓ web is healthy"
    break
  fi
  printf '.'
  sleep 2
done

log "Pruning dangling images"
docker image prune -f >/dev/null

log "Status"
docker compose ps

cat <<EOF

✅ Deploy complete.
   Logs:    docker compose logs -f web
   Shell:   docker compose exec web sh
   Prisma:  docker compose exec web npx prisma studio --schema=./packages/database/prisma/schema.prisma

EOF
