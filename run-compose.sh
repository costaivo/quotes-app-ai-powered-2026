#!/usr/bin/env bash
set -euo pipefail

# run-compose.sh - Start the development stack under WSL/Linux
# Usage: ./run-compose.sh [up|down|logs] [--detached]

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_CMD="docker compose"

show_help() {
  cat <<EOF
Usage: $0 [up|down|logs|ps] [--detached]

Commands:
  up        Build and start the stack
  down      Stop and remove containers
  logs      Tail logs for all services
  ps        Show running services

Flags:
  --detached  Run containers in background (equivalent to -d)
  --help      Show this message
EOF
}

if [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  show_help
  exit 0
fi

CMD=${1:-up}
DETACHED=""
if [[ ${2:-} == "--detached" || ${2:-} == "-d" ]]; then
  DETACHED="-d"
fi

cd "$ROOT_DIR"

case "$CMD" in
  up)
    echo "Starting compose stack (build + ${DETACHED:-foreground})..."
    $COMPOSE_CMD up $DETACHED --build
    ;;
  down)
    echo "Stopping compose stack and removing containers..."
    $COMPOSE_CMD down
    ;;
  logs)
    echo "Tailing logs (press Ctrl+C to exit)..."
    $COMPOSE_CMD logs -f --tail=200
    ;;
  ps)
    $COMPOSE_CMD ps
    ;;
  *)
    echo "Unknown command: $CMD"
    show_help
    exit 2
    ;;
esac


