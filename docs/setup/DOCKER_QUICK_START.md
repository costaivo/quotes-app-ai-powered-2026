# Docker Quick Start Guide - costaivo/quotes-app-be

Your Docker image is published at: **`costaivo/quotes-app-be`**

## Running Migrations and Seed with Your Current Image

### Prerequisites
- Docker installed
- PostgreSQL running (or use Docker)
- Docker network setup (optional but recommended)

## Quick Commands

### 1. Start PostgreSQL (if not already running)
```bash
docker network create quotes-network

docker run -d \
  --name quotes-postgres \
  --network quotes-network \
  -e POSTGRES_DB=quotes_db \
  -e POSTGRES_USER=quotes_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Run Migrations
```bash
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=quotes-postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_secure_password \
  costaivo/quotes-app-be:latest \
  pnpm run migration:run
```

### 3. Seed the Database
```bash
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=quotes-postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_secure_password \
  costaivo/quotes-app-be:latest \
  pnpm run seed
```

### 4. Start the API
```bash
docker run -d \
  --name quotes-api \
  --network quotes-network \
  -e DATABASE_HOST=quotes-postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_secure_password \
  -p 3000:3000 \
  costaivo/quotes-app-be:latest
```

### 5. Verify the API is Running
```bash
# Check if container is running
docker ps | grep quotes-api

# Test the API
curl http://localhost:3000/api/v1/quotes

# View logs
docker logs quotes-api
```

## Using Docker Compose (Recommended)

Create a `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: quotes-postgres
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U quotes_user -d quotes_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  quotes-api:
    image: costaivo/quotes-app-be:latest
    container_name: quotes-api
    depends_on:
      postgres:
        condition: service_healthy
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

volumes:
  postgres_data:

networks:
  quotes-network:
    driver: bridge
```

### Using Docker Compose

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Wait for PostgreSQL to be healthy
docker-compose exec postgres pg_isready -U quotes_user -d quotes_db

# Run migrations
docker-compose run --rm quotes-api pnpm run migration:run

# Seed the database
docker-compose run --rm quotes-api pnpm run seed

# Start the API
docker-compose up -d quotes-api

# Check if everything is working
curl http://localhost:3000/api/v1/quotes

# View logs
docker-compose logs -f quotes-api
```

## Stopping Everything

```bash
# Stop all containers
docker-compose down

# Or manually stop individual containers
docker stop quotes-api
docker stop quotes-postgres

# Remove network and containers
docker-compose down -v  # -v removes volumes
```

## Troubleshooting

### Issue: "ts-node: command not found"
**Current Image Limitation:** The current image doesn't include dev dependencies needed for migrations.

**Solutions:**
1. **Build improved image locally:**
```bash
# Clone repo (if you don't have it)
git clone your-repo

# Build with improved Dockerfile
docker build -f app/be/Dockerfile.improved -t costaivo/quotes-app-be:improved .

# Push to Docker Hub (optional)
docker push costaivo/quotes-app-be:improved
```

2. **Use docker exec (if you have source code locally):**
```bash
docker exec -it quotes-api pnpm run migration:run
docker exec -it quotes-api pnpm run seed
```

### Issue: "Database connection refused"
- Verify PostgreSQL is running: `docker ps`
- Check DATABASE_HOST is correct (use `postgres` in docker-compose, or `quotes-postgres` if using separate network)
- Verify credentials match

### Issue: "Migration files not found"
- Current image doesn't have source code
- Solution: Use improved Dockerfile or run migrations before starting API

## Migration Commands Reference

Available commands in your application:

```bash
# Run all pending migrations
docker run --rm ... costaivo/quotes-app-be:latest pnpm run migration:run

# Show migration status
docker run --rm ... costaivo/quotes-app-be:latest pnpm run migration:show

# Revert last migration
docker run --rm ... costaivo/quotes-app-be:latest pnpm run migration:revert

# Seed the database
docker run --rm ... costaivo/quotes-app-be:latest pnpm run seed
```

## Complete Setup Script

Save as `setup.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating Docker network...${NC}"
docker network create quotes-network 2>/dev/null || true

echo -e "${BLUE}Starting PostgreSQL...${NC}"
docker run -d \
  --name quotes-postgres \
  --network quotes-network \
  -e POSTGRES_DB=quotes_db \
  -e POSTGRES_USER=quotes_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  postgres:16-alpine

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
sleep 10

echo -e "${BLUE}Running migrations...${NC}"
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=quotes-postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_secure_password \
  costaivo/quotes-app-be:latest \
  pnpm run migration:run

echo -e "${BLUE}Seeding database...${NC}"
docker run --rm \
  --network quotes-network \
  -e DATABASE_HOST=quotes-postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_secure_password \
  costaivo/quotes-app-be:latest \
  pnpm run seed

echo -e "${BLUE}Starting API...${NC}"
docker run -d \
  --name quotes-api \
  --network quotes-network \
  -e DATABASE_HOST=quotes-postgres \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=quotes_db \
  -e DATABASE_USER=quotes_user \
  -e DATABASE_PASSWORD=your_secure_password \
  -p 3000:3000 \
  costaivo/quotes-app-be:latest

echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}✓ API is running at http://localhost:3000${NC}"
echo -e "${BLUE}Waiting 5 seconds for API to start...${NC}"
sleep 5

echo -e "${BLUE}Testing API...${NC}"
curl http://localhost:3000/api/v1/quotes

echo -e "${GREEN}✓ Done!${NC}"
```

Usage:
```bash
chmod +x setup.sh
./setup.sh
```

## Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| DATABASE_HOST | `quotes-postgres` (Docker) or `localhost` (local) | PostgreSQL host |
| DATABASE_PORT | `5432` | PostgreSQL port |
| DATABASE_NAME | `quotes_db` | Database name |
| DATABASE_USER | `quotes_user` | Database user |
| DATABASE_PASSWORD | `your_secure_password` | Database password |
| NODE_ENV | `production` | Environment |

## Next Steps

1. **Option A (Recommended):** Build improved image locally:
```bash
docker build -f app/be/Dockerfile.improved -t costaivo/quotes-app-be:improved .
docker push costaivo/quotes-app-be:improved
```

2. **Option B:** Continue using current image with the commands above

3. **Test the API:**
```bash
# Get all quotes
curl http://localhost:3000/api/v1/quotes

# Test pagination
curl http://localhost:3000/api/v1/quotes?page=1&limit=10

# Get tags
curl http://localhost:3000/api/v1/quotes/tags/all

# Get authors
curl http://localhost:3000/api/v1/quotes/authors/all
```

## Cleanup

```bash
# Stop all containers
docker-compose down

# Remove the network
docker network rm quotes-network

# Or manually:
docker stop quotes-api quotes-postgres
docker rm quotes-api quotes-postgres
docker network rm quotes-network
```

