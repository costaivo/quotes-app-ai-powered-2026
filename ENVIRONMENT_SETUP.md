# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=quotes_app

# Application Configuration
NODE_ENV=development
PORT=3000

# Database URL (alternative format)
DATABASE_URL=postgresql://postgres:password@db:5432/quotes_app
```

## Docker Setup

1. Copy the environment variables above to a `.env` file in the root directory
2. Run the application with Docker Compose:
   ```bash
   docker-compose up
   ```

## Database Migration

After starting the containers, run the database migration:

```bash
# Run migration inside the backend container
docker-compose exec be npm run typeorm:migration:run
```

## Access Points

- Backend API: http://localhost:3000
- Adminer (Database Admin): http://localhost:8080
- Frontend: http://localhost:5173

## Database Connection Details for Adminer

- Server: `db`
- Username: `postgres`
- Password: `password`
- Database: `quotes_app`
