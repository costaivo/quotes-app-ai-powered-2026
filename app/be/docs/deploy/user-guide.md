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
      - "3000:3000"
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
networks:
  quotes-network:
    driver: bridge

volumes:
  db_data:
```

### 3. Create `.env` File (Optional)

You can create a `.env` file to customize the database credentials. If you skip this, the defaults defined in `docker-compose.yml` will be used.

```bash
# .env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=quotes_prod
```

**Important Environment Variables in docker-compose.yml:**

- `NODE_ENV=development` - Enables Swagger documentation at `/api/docs` and development logging
  - Set to `production` to disable Swagger (recommended for production deployments)
- `POSTGRES_HOST=db` - Database hostname (matches the service name in docker-compose.yml)
- `POSTGRES_PORT=5432` - Database port
- `POSTGRES_USER` - Database username (default: postgres)
- `POSTGRES_PASSWORD` - Database password (default: postgres)
- `POSTGRES_DB` - Database name (default: quotes_db)

### 4. Start the Application

Run the following command to start the services:

```bash
docker compose up -d
```

The application will be available at `http://localhost:3000`.

### 5. Run Database Migrations

After the containers are running, apply database migrations to set up the schema:

```bash
docker compose exec backend pnpm run migration:run
```

If the backend container is not running, use:

```bash
docker compose run --rm backend pnpm run migration:run
```

This ensures your database is ready for use with the latest schema.

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

### Running Seeds

To populate the database with initial seed data:

```bash
docker compose exec backend pnpm run seed
```

### Checking Logs

To view application logs:

```bash
docker compose logs -f backend
```

