#!/usr/bin/env sh
set -eu

# Start Docker Compose for the repository root.
# This mirrors the behavior of `start.bat` and runs in detached mode,
# rebuilding images. It prints errors and exits with the compose status.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# If an argument is provided, accept `db` (or variants) to start only DB and Adminer,
# or `all` to start everything. If no argument is provided, prompt interactively.
SERVICES=""
if [ "$#" -gt 0 ]; then
  case "$1" in
    db|db-only|--db|-d)
      SERVICES="db adminer"
      ;;
    all|--all|-a)
      SERVICES=""
      ;;
    help|-h|--help)
      echo "Usage: $0 [all|db]"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [all|db]"
      exit 2
      ;;
  esac
else
  echo "Choose which services to start:"
  echo "  1) All services (backend + frontend + db + adminer) [default]"
  echo "  2) Only db and adminer (development)"
  printf "Enter 1 or 2: "
  if ! read choice; then
    choice="1"
  fi
  case "$choice" in
    2)
      SERVICES="db adminer"
      ;;
    *)
      SERVICES=""
      ;;
  esac
fi

echo "Starting docker compose (detached, with build)..."
if [ -z "$SERVICES" ]; then
  if docker compose up -d --build; then
    echo "Docker compose started successfully."
    # Print where the backend and frontend will be available
    # Backend URL: use PORT env var if set, default to 3000
    BE_PORT="${PORT:-3000}"
    echo "Backend running at http://localhost:${BE_PORT}"
    # Frontend URL: Vite default port 5173 (mapped in docker-compose.yml)
    echo "Frontend running at http://localhost:5173"
    # Adminer (Database UI)
    echo "Adminer (DB UI) running at http://localhost:8080"
    exit 0
  else
    echo "Docker compose failed." >&2
    exit 1
  fi
else
  if docker compose up -d --build $SERVICES; then
    echo "Docker compose started successfully (db + adminer)."
    # Adminer (Database UI)
    echo "Adminer (DB UI) running at http://localhost:8080"
    echo "Database service started."
    exit 0
  else
    echo "Docker compose failed." >&2
    exit 1
  fi
fi


