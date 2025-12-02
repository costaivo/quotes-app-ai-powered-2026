# Docker Migrations and Seed Commands Guide

This guide explains how to run migrations and seed commands when using the Docker image for the Quotes API backend.

## Problem Overview

Your current Dockerfile uses `pnpm install --prod` in production, which removes dev dependencies like `ts-node` and `typeorm-ts-node-commonjs`. These are required to run migration and seed commands.

## Solutions

### Option 1: Using Docker Override Commands (Recommended for existing image)

Run migration and seed commands directly by overriding the default CMD:

#### Run Migrations
```bash
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_password \
  your-docker-user/quotes-api:latest \
  pnpm run migration:run
```

#### Run Seed
```bash
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_password \
  your-docker-user/quotes-api:latest \
  pnpm run seed
```

#### Show Migration Status
```bash
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_password \
  your-docker-user/quotes-api:latest \
  pnpm run migration:show
```

### Option 2: Using Docker Compose (Recommended for complete setup)

Create a `docker-compose.yml` that supports multiple commands:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: quotes_postgres
    environment:
      POSTGRES_DB: quotes_db
      POSTGRES_USER: quotes_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - quotes-network

  quotes-api:
    image: your-docker-user/quotes-api:latest
    container_name: quotes_api
    depends_on:
      - postgres
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: quotes_db
      DATABASE_USER: quotes_user
      DATABASE_PASSWORD: your_secure_password
      NODE_ENV: production
    ports:
      - "3000:3000"
    networks:
      - quotes-network
    command: pnpm start

  # Service to run migrations
  migrations:
    image: your-docker-user/quotes-api:latest
    depends_on:
      - postgres
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: quotes_db
      DATABASE_USER: quotes_user
      DATABASE_PASSWORD: your_secure_password
    networks:
      - quotes-network
    command: pnpm run migration:run
    profiles:
      - setup

  # Service to seed the database
  seed:
    image: your-docker-user/quotes-api:latest
    depends_on:
      - postgres
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: quotes_db
      DATABASE_USER: quotes_user
      DATABASE_PASSWORD: your_secure_password
    networks:
      - quotes-network
    command: pnpm run seed
    profiles:
      - setup

volumes:
  postgres_data:

networks:
  quotes-network:
    driver: bridge
```

**Usage with Docker Compose:**

```bash
# Start the API
docker-compose up -d

# Run migrations (in another terminal)
docker-compose --profile setup run migrations

# Run seed (in another terminal)
docker-compose --profile setup run seed

# Or run both in sequence
docker-compose --profile setup run migrations && docker-compose --profile setup run seed
```

### Option 3: Improve Your Dockerfile (Recommended for future builds)

The improved Dockerfile (`Dockerfile.improved`) installs all dependencies (including dev) in production:

**Key Changes:**
1. Install all dependencies instead of just production ones
2. Copy source code for migration/seed scripts
3. Copy `ormconfig.ts` and `tsconfig.json` needed by typeorm

This allows the image to support both running the app and running migrations/seeds:

```bash
# Build with improved Dockerfile
docker build -f Dockerfile.improved -t your-docker-user/quotes-api:latest .

# Push to Docker Hub
docker push your-docker-user/quotes-api:latest

# Now you can run migrations/seed with the same image
docker run --rm --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_password \
  your-docker-user/quotes-api:latest \
  pnpm run migration:run
```

## Environment Variables Required

When running migrations or seeds, ensure these environment variables are set:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_HOST` | `localhost` | PostgreSQL host |
| `DATABASE_PORT` | `5432` | PostgreSQL port |
| `DATABASE_NAME` | `quotes_db` | Database name |
| `DATABASE_USER` | - | Database username |
| `DATABASE_PASSWORD` | - | Database password |
| `NODE_ENV` | `development` | Environment (development/production) |

## Complete Workflow Example

```bash
# 1. Start PostgreSQL
docker run -d \
  --name postgres \
  --network quotes-network \
  -e POSTGRES_DB=quotes_db \
  -e POSTGRES_USER=quotes_user \
  -e POSTGRES_PASSWORD=mysecretpassword \
  postgres:16-alpine

# 2. Run migrations
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=mysecretpassword \
  your-docker-user/quotes-api:latest \
  pnpm run migration:run

# 3. Seed the database
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=mysecretpassword \
  your-docker-user/quotes-api:latest \
  pnpm run seed

# 4. Start the API
docker run -d \
  --name quotes-api \
  --network quotes-network \
  -e DATABASE_HOST=postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=mysecretpassword \
  -p 3000:3000 \
  your-docker-user/quotes-api:latest
```

## Troubleshooting

### "ts-node: command not found"

**Cause:** Dev dependencies were not installed during image build.

**Solution:** 
- Use Option 2 (Docker Compose with improved setup)
- Or use Option 3 (Improved Dockerfile)
- Or use Option 1 but rebuild image with all dependencies

### "Database connection refused"

**Cause:** PostgreSQL is not running or networking is not configured.

**Solution:**
- Ensure PostgreSQL container is running: `docker ps`
- Ensure both containers are on the same Docker network
- Verify DATABASE_HOST is correct (use service name in Docker Compose)

### "Migration files not found"

**Cause:** Source code was not copied into the image in production stage.

**Solution:** Use the improved Dockerfile which copies source code

## Recommended Setup for Production

1. **Use Improved Dockerfile** for builds going forward
2. **Use Docker Compose** for orchestration
3. **Use profiles** to separate setup tasks from runtime
4. **Run migrations/seed once** before scaling the API service
5. **Monitor logs** to ensure migrations succeed before starting the API

```bash
# Production workflow
docker-compose --profile setup run migrations
docker-compose --profile setup run seed
docker-compose up -d  # Start API without profile
```

