# Developer Guide: Deploying with Docker Compose

This guide explains how to deploy the Quotes App Backend using the official Docker image.

## Prerequisites

- Docker and Docker Compose installed.

## Quick Start

### 1. Create a Project Directory

Create a new directory for your deployment and navigate into it.

```bash
mkdir quotes-app-deploy
cd quotes-app-deploy
```

### 2. Create `docker-compose.yml`

Create a file named `docker-compose.yml` with the following content:

```yaml
services:
  # Backend Application
  backend:
    image: costaivo/quotes-app-be:latest
    container_name: quotes-backend
    restart: always
    ports:
      - "8001:3000"
    environment:
      - NODE_ENV=development
      - POSTGRES_HOST=db
      - POSTGRES_PORT=5432
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
      - POSTGRES_DB=${POSTGRES_DB:-quotes_db}
      # Log settings (Optional)
      - LOG_LEVEL=INFO
    depends_on:
      - db
    networks:
      - quotes-network

  # Postgres Database
  db:
    image: postgres:15-alpine
    container_name: quotes-db
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
      - POSTGRES_DB=${POSTGRES_DB:-quotes_db}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - quotes-network

  # pgAdmin - Database Administration UI
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: quotes-pgadmin
    restart: always
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_EMAIL:-admin@admin.com}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_PASSWORD:-admin}
    ports:
      - "9000:80"
    depends_on:
      - db
    networks:
      - quotes-network

networks:
  quotes-network:
    driver: bridge

volumes:
  db_data:
```

### 3. Create `.env` File (Optional)

You can create a `.env` file to customize the configuration. If you skip this, the defaults defined in `docker-compose.yml` will be used.

```bash
# .env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=quotes_prod
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=securepassword
```

**Important Environment Variables:**

- `NODE_ENV=development` - Enables Swagger documentation at `/api/docs` and development logging
  - Set to `production` to disable Swagger (recommended for production deployments)
- `POSTGRES_HOST=db` - Database hostname (matches the service name in docker-compose.yml)
- `POSTGRES_PORT=5432` - Database port
- `POSTGRES_USER` - Database username (default: postgres)
- `POSTGRES_PASSWORD` - Database password (default: postgres)
- `POSTGRES_DB` - Database name (default: quotes_db)
- `PGADMIN_EMAIL` - pgAdmin login email (default: admin@admin.com)
- `PGADMIN_PASSWORD` - pgAdmin login password (default: admin)

### 4. Start the Application

Run the following command to start the services:

```bash
docker compose up -d
```

### 5. Access pgAdmin (Database Administration UI)

pgAdmin is automatically started and available at: **http://localhost:9000**

**Login credentials:**
- Email: `admin@admin.com` (or `PGADMIN_EMAIL` from your `.env`)
- Password: `admin` (or `PGADMIN_PASSWORD` from your `.env`)

**To connect to the database in pgAdmin:**
1. Open http://localhost:9000
2. Right-click "Servers" → "Register" → "Server"
3. In the "General" tab, enter: `quotes-db` as the name
4. Switch to "Connection" tab and enter:
   - Host: `db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
5. Click "Save"

Now you can browse tables, run queries, and manage the database!

### 6. Run Database Migrations

After the containers are running, apply database migrations to set up the schema:

**Option A: Automatic (Recommended)**

Migrations run automatically on app startup. Just wait for the backend to fully initialize (check logs):

```bash
docker compose logs -f backend | grep "successfully started"
```

**Option B: Manual Migrations**

If you need to run migrations manually:

```bash
docker compose exec backend pnpm run migration:run
```

If the backend container is not running, use:

```bash
docker compose run --rm backend pnpm run migration:run
```

This ensures your database is ready for use with the latest schema.

### 7. Seed the Database (Optional)

Populate the database with initial sample data:

```bash
docker compose exec backend pnpm run seed
```

This will insert sample quotes, authors, and tags.

**Troubleshooting: "relation already exists" Error**

If you get an error like `error: relation "quotes" already exists`, it means the database volume persists from a previous run. This happens when migrations were tracked before but the migration records were lost. To fix this:

```bash
# Stop containers and remove the database volume
docker compose down -v

# Start fresh
docker compose up -d

# Run migrations again
docker compose exec backend pnpm run migration:run
```

The `-v` flag removes all volumes, giving you a clean database to work with.

---

## Quick Access URLs

Once the application is running, access these URLs:

| Service | URL | Purpose |
|---------|-----|---------|
| **API Root** | http://localhost:8001/api | REST API base |
| **Swagger Docs** | http://localhost:8001/api/docs | Interactive API documentation |
| **API Version** | http://localhost:8001/api/version | Check API version |
| **Health Check** | http://localhost:8001/api/health | Health status |
| **pgAdmin** | http://localhost:9000 | Database administration UI |

---

## Management Tasks

The Docker image `costaivo/quotes-app-be` includes built-in support for running database migrations and seeds.

### Running Migrations

To apply database migrations (create tables, update schema):

```bash
docker compose exec backend pnpm run migration:run
```

*Note: If the container is not running, you can run:*
```bash
docker compose run --rm backend pnpm run migration:run
```

**Migration Management Commands:**

```bash
# Show migration status
docker compose exec backend pnpm run migration:show

# Revert the last migration
docker compose exec backend pnpm run migration:revert

# Generate a new migration from entities
docker compose exec backend pnpm run migration:generate -n MigrationName

# Create an empty migration
docker compose exec backend pnpm run migration:create -n MigrationName
```

### Running Seeds

To populate the database with initial seed data:

```bash
docker compose exec backend pnpm run seed
```

This will insert sample quotes, authors, and tags into the database.

### Checking Logs

To view application logs:

```bash
docker compose logs -f backend
```

To view database logs:

```bash
docker compose logs -f db
```

### Stopping and Resetting

```bash
# Stop all services (keeps data)
docker compose down

# Stop all services and remove all data (DESTRUCTIVE)
docker compose down -v

# Restart services
docker compose restart backend
docker compose restart db
```

### Database Access

Connect directly to the database using psql:

```bash
# Open interactive psql session
docker compose exec db psql -U postgres -d quotes_db

# Run a query directly
docker compose exec db psql -U postgres -d quotes_db -c "SELECT COUNT(*) FROM quotes;"
```

---

## Troubleshooting

### Services won't start

```bash
# Check service status
docker compose ps

# View detailed logs
docker compose logs backend
docker compose logs db

# Check for port conflicts
lsof -i :8001
lsof -i :9000

# Restart everything
docker compose restart
```

### Database migration errors

If you get `error: relation "quotes" already exists`:

```bash
# Remove all volumes and start fresh
docker compose down -v

# Start services again
docker compose up -d

# Wait for migrations to run automatically
docker compose logs -f backend
```

### Can't access Swagger docs

Ensure `NODE_ENV=development` is set in your `.env` file. Swagger is only enabled in development mode for security.

```bash
# Check NODE_ENV
docker compose exec backend printenv NODE_ENV
# Should output: development
```

### pgAdmin won't connect to database

If you can't connect pgAdmin to the database, verify:

1. Database is running: `docker compose ps`
2. Use hostname `db` (not localhost) - they're on the same Docker network
3. Default credentials:
   - Username: `postgres`
   - Password: `postgres`
   - Host: `db`
   - Port: `5432`

