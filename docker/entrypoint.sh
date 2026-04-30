#!/bin/sh
# docker/entrypoint.sh

# Helper functions so every log line has a timestamp and severity.
# Writing to stderr (>&2) for errors means they show up red in 'docker compose logs'.
log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $1"; }
warn() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  $1"; }
err()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" >&2; }

log "Starting Codychat entrypoint..."
log "Container: $(hostname)"

# -- Wait for MariaDB -- #
log "Waiting for MariaDB at $DB_HOST..."
RETRIES=0
MAX_RETRIES=30
until mysqladmin ping -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" --silent 2>/dev/null; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    err "MariaDB did not become ready after $MAX_RETRIES attempts. Aborting."
    exit 1                        # Non-zero exit kills the container — Docker will restart it
  fi                              # if restart: unless-stopped is set
  warn "MariaDB not ready yet (attempt $RETRIES/$MAX_RETRIES). Retrying in 2s..."
  sleep 2
done
log "MariaDB is ready."

# -- Installer -- #
LOCKFILE=/var/www/html/.installed

if [ -f "$LOCKFILE" ]; then
  log "Lockfile found at $LOCKFILE — skipping installer."
else
  log "No lockfile found. Running installer..."

  apache2-foreground &
  APACHE_PID=$!
  log "Apache started in background (PID $APACHE_PID). Waiting for it to bind..."
  sleep 3

  log "Posting to installer endpoint..."

  # -s silences curl's progress meter
  # -w appends the HTTP status code on a new line after the response body
  # We capture the full output, then split the last line off as the status code
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST http://localhost/builder/encoded/component.php \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'X-Requested-With: XMLHttpRequest' \
    --data-urlencode "db_host=$DB_HOST" \
    --data-urlencode "db_name=$DB_NAME" \
    --data-urlencode "db_user=$DB_USER" \
    --data-urlencode "db_pass=$DB_PASSWORD" \
    --data-urlencode "title=$APP_TITLE" \
    --data-urlencode "domain=$APP_DOMAIN" \
    --data-urlencode "username=$APP_ADMIN_USERNAME" \
    --data-urlencode "email=$APP_ADMIN_EMAIL" \
    --data-urlencode "password=$APP_ADMIN_PASSWORD" \
    --data-urlencode "repeat=$APP_ADMIN_PASSWORD" \
    --data-urlencode "language=English" \
    --data-urlencode "purchase=$APP_LICENSE_KEY")

  # Split response body and HTTP status code apart
  HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')   # everything except the last line

  log "Installer HTTP status: $HTTP_STATUS"
  log "Installer response: $BODY"

  # Decide success based on HTTP status code
  if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
    log "Installer completed successfully. Writing lockfile."
    touch "$LOCKFILE"
  else
    err "Installer returned HTTP $HTTP_STATUS. Not writing lockfile — will retry on next restart."
    kill $APACHE_PID
    wait $APACHE_PID 2>/dev/null
    exit 1
  fi

  kill $APACHE_PID
  wait $APACHE_PID 2>/dev/null
  log "Background Apache stopped. Handing off to foreground process."
fi

log "Launching Apache..."
exec apache2-foreground
