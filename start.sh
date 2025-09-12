#!/usr/bin/env sh
set -eu

# Start Docker Compose for the repository root.
# This mirrors the behavior of `start.bat` and runs in detached mode,
# rebuilding images. It prints errors and exits with the compose status.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "Starting docker compose (detached, with build)..."
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


