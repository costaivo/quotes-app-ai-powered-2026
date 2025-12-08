# Quotes App Backend - Docker Deployment

This directory contains the necessary files to deploy the Quotes App Backend using Docker Compose.

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your desired configuration (optional - defaults are fine for local testing)
# nano .env
```

### 2. Start the Application

```bash
# Start all services (backend + database)
docker compose up -d

# Wait for services to be healthy (check logs)
docker compose logs -f backend
```

The application will be available at: **http://localhost:8001/api**

### 4. Access Database Administration UI (pgAdmin)

pgAdmin is automatically started and available at: **http://localhost:9000**

**Login credentials:**
- Email: `admin@admin.com` (or `PGADMIN_EMAIL` from your `.env`)
- Password: `admin` (or `PGADMIN_PASSWORD` from your `.env`)

**To connect to the database in pgAdmin:**
1. Open http://localhost:9000
2. Right-click "Servers" → "Register" → "Server"
3. Name: `quotes-db` (or any name)
4. Connection tab:
   - Host: `db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
5. Click "Save"

Now you can browse tables, run queries, and manage the database!

### 5. Verify Everything Works

```bash
# Check the API version
curl http://localhost:8001/api/version

# View all quotes
curl http://localhost:8001/api/v1/quotes | jq .

# Access Swagger documentation
# Visit: http://localhost:8001/api/docs

# Access pgAdmin database UI
# Visit: http://localhost:9000
```

---

## File Descriptions

### `docker-compose.yml`
Defines three services:
- **backend**: The Quotes App API service (port 8001)
- **db**: PostgreSQL database service (port 5432 - internal only)
- **pgadmin**: Database administration UI (port 9000)

Includes health checks for both backend and database services to ensure they start properly.

### `env.example`
Template environment file with all available configuration options. Copy this to `.env` and customize as needed.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Set to `development` for Swagger docs, `production` to disable |
| `PORT` | `8001` | Backend application port |
| `POSTGRES_HOST` | `db` | Database hostname (use `db` for docker-compose) |
| `POSTGRES_PORT` | `5432` | Database port |
| `POSTGRES_USER` | `postgres` | Database username |
| `POSTGRES_PASSWORD` | `postgres` | Database password |
| `POSTGRES_DB` | `quotes_db` | Database name |
| `PGADMIN_EMAIL` | `admin@admin.com` | pgAdmin login email |
| `PGADMIN_PASSWORD` | `admin` | pgAdmin login password |
| `LOG_LEVEL` | `info` | Logging level (trace, debug, info, warn, error) |

---

## Common Commands

```bash
# View logs
docker compose logs -f backend
docker compose logs -f db

# Stop services
docker compose down

# Stop services and remove data (DESTRUCTIVE)
docker compose down -v

# Run migrations manually (if needed)
docker compose exec backend pnpm run migration:run

# Seed the database
docker compose exec backend pnpm run seed

# Access the database directly
docker compose exec db psql -U postgres -d quotes_db
```

---

## API Endpoints

Once running, access these endpoints:

- **API Version**: `GET http://localhost:8001/api/version`
- **Health Check**: `GET http://localhost:8001/api/health`
- **Swagger Docs**: `http://localhost:8001/api/docs` (only in development mode)
- **Get All Quotes**: `GET http://localhost:8001/api/v1/quotes`
- **Create Quote**: `POST http://localhost:8001/api/v1/quotes`
- **Get Quote by ID**: `GET http://localhost:8001/api/v1/quotes/{id}`
- **Update Quote**: `PATCH http://localhost:8001/api/v1/quotes/{id}`
- **Delete Quote**: `DELETE http://localhost:8001/api/v1/quotes/{id}`
- **Get All Tags**: `GET http://localhost:8001/api/v1/quotes/tags/all`
- **Get All Authors**: `GET http://localhost:8001/api/v1/quotes/authors/all`

---

## Troubleshooting

### Services won't start
```bash
# Check for port conflicts
docker compose ps

# View detailed logs
docker compose logs backend
docker compose logs db

# Restart everything
docker compose restart
```

### Database migration errors
```bash
# Remove all volumes and start fresh
docker compose down -v
docker compose up -d

# Wait for DB to be ready, then check logs
sleep 5
docker compose logs backend
```

### Can't access Swagger docs
Ensure `NODE_ENV=development` is set in your `.env` file. Swagger is only enabled in development mode for security.

---

## Production Deployment Notes

For production deployments:

1. Set `NODE_ENV=production` to disable Swagger documentation
2. Use strong, unique database passwords (not `postgres`)
3. Consider using environment secrets management (e.g., AWS Secrets Manager, HashiCorp Vault)
4. Add SSL/TLS certificates for HTTPS
5. Use a reverse proxy (nginx, Traefik) for load balancing
6. Enable database backups
7. Add monitoring and logging aggregation

---

## Docker Hub Image

This uses the official image: `costaivo/quotes-app-be:latest`

To use a specific version:
```yaml
image: costaivo/quotes-app-be:0.0.6
```

See available versions: https://hub.docker.com/r/costaivo/quotes-app-be/tags

