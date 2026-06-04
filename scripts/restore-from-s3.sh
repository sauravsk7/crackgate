#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# CrackGate — restore RDS from S3 backup
#
# Lists nightly pg_dump archives in s3://${BACKUP_BUCKET}/db/, lets you pick
# one (or pass --latest), downloads it, and restores into the target database.
#
# USAGE
#   scripts/restore-from-s3.sh                       # interactive pick
#   scripts/restore-from-s3.sh --latest              # most recent backup
#   scripts/restore-from-s3.sh --file 2026-06-04_1930.sql.gz
#   scripts/restore-from-s3.sh --latest --target staging   # restore to a different DB
#
# ENVIRONMENT (sourced from .env.production by default)
#   BACKUP_BUCKET       — S3 bucket holding backups
#   RDS_HOST            — target Postgres host
#   RDS_PORT            — default 5432
#   POSTGRES_USER       — superuser on the target instance
#   POSTGRES_PASSWORD
#   POSTGRES_DB         — DB name to restore INTO (will be dropped + recreated!)
#
# SAFETY
#   This script DROPS and RECREATES the target database. It refuses to run
#   against a DB named "crackgate" unless --force-prod is passed.
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

ENV_FILE="${ENV_FILE:-/opt/crackgate/.env.production}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
TARGET_DB=""
SELECTED=""
USE_LATEST=0
FORCE_PROD=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --latest)     USE_LATEST=1; shift ;;
    --file)       SELECTED="$2"; shift 2 ;;
    --target)     TARGET_DB="$2"; shift 2 ;;
    --env-file)   ENV_FILE="$2"; shift 2 ;;
    --force-prod) FORCE_PROD=1; shift ;;
    -h|--help)    sed -n '1,30p' "$0"; exit 0 ;;
    *)            echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -f "$ENV_FILE" ]] || { echo "✗ env file not found: $ENV_FILE" >&2; exit 1; }
# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

: "${BACKUP_BUCKET:?BACKUP_BUCKET not set}"
: "${RDS_HOST:?RDS_HOST not set}"
: "${POSTGRES_USER:?POSTGRES_USER not set}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD not set}"
: "${POSTGRES_DB:?POSTGRES_DB not set}"
RDS_PORT="${RDS_PORT:-5432}"
TARGET_DB="${TARGET_DB:-$POSTGRES_DB}"

# Guard against accidental prod overwrites
if [[ "$TARGET_DB" == "crackgate" && $FORCE_PROD -ne 1 ]]; then
  echo "✗ Refusing to restore into 'crackgate' without --force-prod." >&2
  echo "  Tip: --target crackgate_restore  to restore alongside prod." >&2
  exit 1
fi

# ─── pick a backup ──────────────────────────────────────────────────────────
if [[ -n "$SELECTED" ]]; then
  KEY="db/$SELECTED"
elif [[ $USE_LATEST -eq 1 ]]; then
  KEY=$(aws s3api list-objects-v2 \
    --bucket "$BACKUP_BUCKET" --prefix "db/" \
    --query 'sort_by(Contents,&LastModified)[-1].Key' --output text)
else
  mapfile -t KEYS < <(aws s3api list-objects-v2 \
    --bucket "$BACKUP_BUCKET" --prefix "db/" \
    --query 'sort_by(Contents,&LastModified)[*].[Key,LastModified,Size]' --output text \
    | tail -20)
  [[ ${#KEYS[@]} -gt 0 ]] || { echo "✗ no backups found in s3://$BACKUP_BUCKET/db/"; exit 1; }
  echo "Recent backups (newest last):"
  for i in "${!KEYS[@]}"; do
    printf "  [%2d] %s\n" "$i" "${KEYS[$i]}"
  done
  read -rp "Pick index: " IDX
  KEY=$(awk '{print $1}' <<<"${KEYS[$IDX]}")
fi

[[ -n "$KEY" && "$KEY" != "None" ]] || { echo "✗ no backup selected"; exit 1; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
LOCAL="$TMP/$(basename "$KEY")"

echo "→ downloading s3://$BACKUP_BUCKET/$KEY"
aws s3 cp "s3://$BACKUP_BUCKET/$KEY" "$LOCAL"

echo "→ verifying gzip integrity"
gzip -t "$LOCAL"

# ─── confirm ────────────────────────────────────────────────────────────────
cat <<SUMMARY

About to restore:
  source : s3://$BACKUP_BUCKET/$KEY  ($(du -h "$LOCAL" | cut -f1))
  target : $POSTGRES_USER@$RDS_HOST:$RDS_PORT/$TARGET_DB

This will DROP database "$TARGET_DB" and recreate it from the dump.
SUMMARY
read -rp "Type 'RESTORE' to continue: " CONFIRM
[[ "$CONFIRM" == "RESTORE" ]] || { echo "aborted"; exit 1; }

# ─── drop + recreate + restore ──────────────────────────────────────────────
export PGPASSWORD="$POSTGRES_PASSWORD"
PG_COMMON=( -h "$RDS_HOST" -p "$RDS_PORT" -U "$POSTGRES_USER" -v ON_ERROR_STOP=1 )

echo "→ terminating active connections to $TARGET_DB"
psql "${PG_COMMON[@]}" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity
   WHERE datname='$TARGET_DB' AND pid<>pg_backend_pid();" >/dev/null

echo "→ DROP DATABASE IF EXISTS $TARGET_DB"
psql "${PG_COMMON[@]}" -d postgres -c "DROP DATABASE IF EXISTS \"$TARGET_DB\";"

echo "→ CREATE DATABASE $TARGET_DB"
psql "${PG_COMMON[@]}" -d postgres -c \
  "CREATE DATABASE \"$TARGET_DB\" OWNER \"$POSTGRES_USER\";"

echo "→ restoring (this may take a few minutes)…"
gunzip -c "$LOCAL" | psql "${PG_COMMON[@]}" -d "$TARGET_DB" >/dev/null

echo "→ sanity check: table count"
psql "${PG_COMMON[@]}" -d "$TARGET_DB" -tAc \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"

echo "✓ restore complete: $TARGET_DB ← $KEY"
