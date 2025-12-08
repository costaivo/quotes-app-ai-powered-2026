# Port Configuration Reference

## Current Port Setup

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Backend API | 8001 | http://localhost:8001/api | REST API endpoints |
| Swagger Docs | 8001 | http://localhost:8001/api/docs | Interactive API documentation |
| pgAdmin | 9000 | http://localhost:9000 | Database browser & admin |
| PostgreSQL | 5432 | localhost:5432 (internal only) | Database |

## Why These Ports?

### Port 8001 (Backend)
- ✅ High port number (above 1024, no sudo needed)
- ✅ Not used by common services (unlike 3000 for Node, 5000 for Python, 8080 for many apps)
- ✅ Clean separation from standard web server ports (80, 443)
- ✅ Avoids conflicts with port 8000 if running other services
- ✅ Common in development for backend services
- ✅ Avoids conflicts with Grafana (3001), pgAdmin default (5050), etc.

### Port 9000 (pgAdmin)
- ✅ High port, well above standard web services
- ✅ Not conflicting with common development ports
- ✅ Clear visual separation from backend port
- ✅ Often reserved for admin/management consoles
- ✅ More distinctive than 5050 or 5000

### Port 5432 (PostgreSQL)
- ✅ Standard PostgreSQL port (internal only)
- ✅ NOT exposed to host machine
- ✅ Only accessible from Docker containers
- ✅ Prevents local conflicts

## Quick Access

After `docker compose up -d`:

```bash
# Test Backend
curl http://localhost:8001/api/version

# View Swagger
open http://localhost:8001/api/docs

# Access Database UI
open http://localhost:9000

# Connect via psql (from host)
# Not recommended - use pgAdmin instead or:
docker compose exec db psql -U postgres -d quotes_db
```

## Custom Ports

To use different ports, edit `env.example` → `.env`:

```bash
# Change PORT to any available port (must match docker-compose.yml)
PORT=9999

# Change pgAdmin port in docker-compose.yml:
# Change "9000:80" to "YOUR_PORT:80"
```

Then restart:
```bash
docker compose down
docker compose up -d
```

