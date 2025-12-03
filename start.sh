
#!/usr/bin/env sh
set -eu

# ============================================================
#  Quotes App - Start Script
#  Description: Starts Docker Compose services in detached mode
#  Options: all | db | be | fe
# ============================================================

# Color definitions
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Navigate to repository root
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Determine services based on argument or interactive choice
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
      echo "${BOLD}Quotes App - Usage:${NC}"
      echo "  $0 [all|db|be|fe]"
      echo "  all/1:        Start all services (backend + frontend + db + adminer + pgadmin + dozzle)"
      echo "  ${GREEN}db/2:${NC}       Start only DB and DB Clients (db + adminer + pgadmin)"
      echo "  be/3:         Start BE + DB + DB clients (backend + db + adminer + pgadmin)"
      echo "  fe/4:         Start only FE (frontend)"
      exit 0
      ;;
    *)
      echo "${RED}Unknown option: $1${NC}"
      echo "Usage: $0 [all|db|be|fe]"
      exit 2
      ;;
  esac
else
  echo "${BOLD}============================================${NC}"
  echo "${BOLD}        Quotes App - Service Options        ${NC}"
  echo "${BOLD}============================================${NC}"
  echo "  ${BLUE}1) Start ALL (backend + frontend + db + adminer + pgadmin + dozzle)${NC}"
  echo "  ${GREEN}2) Start only DB and DB Clients (db + adminer + pgadmin)${NC}"
  echo "  3) Start BE + DB + DB clients (backend + db + adminer + pgadmin)"
  echo "  ${GREEN}4) Start only FE (frontend)${NC}"
  printf "Enter 1, 2, 3, or 4 [default: 1]: "
  read choice || choice="1"
  case "$choice" in
    2) SERVICES="db adminer pgadmin" ;;
    3) SERVICES="be db adminer pgadmin" ;;
    4) SERVICES="fe" ;;
    *) SERVICES="" ;;
  esac
fi

echo "${YELLOW}Starting Docker Compose (detached, with build)...${NC}"

# Run docker compose
if docker compose up -d --build $SERVICES; then
  echo "${GREEN}Docker Compose started successfully.${NC}"
  case "$SERVICES" in
    "")
      echo "Services: ALL"
      echo "Backend:  http://localhost:${PORT:-3000}"
      echo "Frontend: http://localhost:5173"
      echo "Adminer:  http://localhost:8080"
      echo "pgAdmin:  http://localhost:5050"
      echo "Dozzle:   http://localhost:8888"
      ;;
    "db adminer pgadmin")
      echo "Services: DB + Adminer + pgAdmin"
      echo "Adminer:  http://localhost:8080"
      echo "pgAdmin:  http://localhost:5050"
      ;;
    "be db adminer pgadmin")
      echo "Services: Backend + DB + Adminer + pgAdmin"
      echo "Backend:  http://localhost:${PORT:-3000}"
      echo "Adminer:  http://localhost:8080"
      echo "pgAdmin:  http://localhost:5050"
      ;;
    "fe")
      echo "Services: Frontend only"
      echo "Frontend: http://localhost:5173"
      ;;
  esac
  exit 0
else
  echo "${RED}Docker Compose failed.${NC}" >&2
  exit 1
fi
