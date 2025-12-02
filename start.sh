#!/usr/bin/env sh
set -eu

# Start Docker Compose for the repository root.
# This mirrors the behavior of `start.bat` and runs in detached mode,
# rebuilding images. It prints errors and exits with the compose status.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# If an argument is provided, accept options for different service combinations.
# If no argument is provided, prompt interactively.
SERVICES=""
if [ "$#" -gt 0 ]; then
  case "$1" in
    all|--all|-a|1)
      SERVICES=""
      ;;
    db|db-only|--db|-d|2)
      SERVICES="db adminer pgadmin"
      ;;
    be|backend|--be|--backend|-b|3)
      SERVICES="be db adminer pgadmin"
      ;;
    fe|frontend|--fe|--frontend|-f|4)
      SERVICES="fe"
      ;;
    help|-h|--help)
      echo "Usage: $0 [all|db|be|fe]"
      echo "  all/1: Start all services (backend + frontend + db + adminer + pgadmin)"
      echo "  db/2:  Start only DB and DB Clients (db + adminer + pgadmin)"
      echo "  be/3:  Start only BE and DB and DB clients (backend + db + adminer + pgadmin)"
      echo "  fe/4:  Start only FE (frontend)"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [all|db|be|fe]"
      exit 2
      ;;
  esac
else
  echo "Choose which services to start:"
  echo "  1) Start ALL (backend + frontend + db + adminer + pgadmin)"
  echo "  2) Start only DB and DB Clients (db + adminer + pgadmin)"
  echo "  3) Start only BE and DB and DB clients (backend + db + adminer + pgadmin)"
  echo "  4) Start only FE (frontend)"
  printf "Enter 1, 2, 3, or 4 [default: 1]: "
  if ! read choice; then
    choice="1"
  fi
  case "$choice" in
    2)
      SERVICES="db adminer pgadmin"
      ;;
    3)
      SERVICES="be db adminer pgadmin"
      ;;
    4)
      SERVICES="fe"
      ;;
    *)
      SERVICES=""
      ;;
  esac
fi

echo "Starting docker compose (detached, with build)..."
if [ -z "$SERVICES" ]; then
  if docker compose up -d --build; then
    echo "Docker compose started successfully (all services)."
    # Print where the backend and frontend will be available
    # Backend URL: use PORT env var if set, default to 3000
    BE_PORT="${PORT:-3000}"
    echo "Backend running at http://localhost:${BE_PORT}"
    # Frontend URL: Vite default port 5173 (mapped in docker-compose.yml)
    echo "Frontend running at http://localhost:5173"
    # Adminer (Database UI)
    echo "Adminer (DB UI) running at http://localhost:8080"
    # pgAdmin (PostgreSQL Admin)
    echo "pgAdmin (DB UI) running at http://localhost:5050"
    exit 0
  else
    echo "Docker compose failed." >&2
    exit 1
  fi
elif [ "$SERVICES" = "db adminer pgadmin" ]; then
  if docker compose up -d --build $SERVICES; then
    echo "Docker compose started successfully (db + adminer + pgadmin)."
    # Adminer (Database UI)
    echo "Adminer (DB UI) running at http://localhost:8080"
    # pgAdmin (PostgreSQL Admin)
    echo "pgAdmin (DB UI) running at http://localhost:5050"
    echo "Database service started."
    exit 0
  else
    echo "Docker compose failed." >&2
    exit 1
  fi
elif [ "$SERVICES" = "be db adminer pgadmin" ]; then
  if docker compose up -d --build $SERVICES; then
    echo "Docker compose started successfully (backend + db + adminer + pgadmin)."
    # Backend URL: use PORT env var if set, default to 3000
    BE_PORT="${PORT:-3000}"
    echo "Backend running at http://localhost:${BE_PORT}"
    # Adminer (Database UI)
    echo "Adminer (DB UI) running at http://localhost:8080"
    # pgAdmin (PostgreSQL Admin)
    echo "pgAdmin (DB UI) running at http://localhost:5050"
    echo "Database service started."
    exit 0
  else
    echo "Docker compose failed." >&2
    exit 1
  fi
elif [ "$SERVICES" = "fe" ]; then
  if docker compose up -d --build $SERVICES; then
    echo "Docker compose started successfully (frontend only)."
    # Frontend URL: Vite default port 5173 (mapped in docker-compose.yml)
    echo "Frontend running at http://localhost:5173"
    exit 0
  else
    echo "Docker compose failed." >&2
    exit 1
  fi
fi


