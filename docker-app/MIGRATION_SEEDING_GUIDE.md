# Migration & Seeding Quick Reference

## Complete Deployment Workflow

### 1. Initial Setup

```bash
cd docker-app
cp env.example .env
```

### 2. Start Services

```bash
docker compose up -d
```

### 3. Wait for Initialization

```bash
# Watch logs until you see "Nest application successfully started"
docker compose logs -f backend
```

**Migrations run automatically!** No manual intervention needed.

### 4. Seed Database (Optional)

```bash
docker compose exec backend pnpm run seed
```

This populates the database with sample quotes, authors, and tags.

### 5. Verify Everything

```bash
# Check API version
curl http://localhost:8001/api/version

# View all quotes
curl http://localhost:8001/api/v1/quotes | jq .

# Access Swagger
open http://localhost:8001/api/docs

# Access pgAdmin
open http://localhost:9000
```

---

## Migration Commands

### Automatic (Recommended)

Migrations run automatically on app startup. The database is initialized when the app starts.

```bash
# Just start the app
docker compose up -d

# Watch it happen
docker compose logs -f backend
```

### Manual Migrations

Run migrations without restarting:

```bash
# Apply pending migrations
docker compose exec backend pnpm run migration:run

# Show migration status
docker compose exec backend pnpm run migration:show

# Revert the last migration
docker compose exec backend pnpm run migration:revert

# Generate new migration from entities
docker compose exec backend pnpm run migration:generate -n MigrationName

# Create empty migration
docker compose exec backend pnpm run migration:create -n MigrationName
```

---

## Seeding

### Add Sample Data

```bash
# Populate database with initial data
docker compose exec backend pnpm run seed
```

This adds:
- 50+ sample quotes from famous authors
- Tags for organization
- Authors information

### View Seeded Data

```bash
# Via psql
docker compose exec db psql -U postgres -d quotes_db -c "SELECT COUNT(*) FROM quotes;"

# Via API
curl http://localhost:8001/api/v1/quotes | jq '.data | length'

# Via pgAdmin at http://localhost:9000
```

---

## Database Management

### Access Database

```bash
# Interactive psql session
docker compose exec db psql -U postgres -d quotes_db

# Run single query
docker compose exec db psql -U postgres -d quotes_db -c "SELECT * FROM quotes LIMIT 1;"
```

### View Tables

```bash
# In psql
\dt                    # List all tables
\d quotes              # Describe quotes table
SELECT * FROM quotes;  # View data
```

### pgAdmin Web UI

Access at **http://localhost:9000**

**Credentials:**
- Email: `admin@admin.com`
- Password: `admin`

**Connect to Database:**
1. Create new server
2. Host: `db`
3. Port: `5432`
4. Username: `postgres`
5. Password: `postgres`

---

## Troubleshooting

### Reset Everything

```bash
# Stop and remove all data
docker compose down -v

# Start fresh
docker compose up -d

# Migrations run automatically
docker compose logs -f backend
```

### Check Migration Status

```bash
# See which migrations have run
docker compose exec backend pnpm run migration:show

# View logs for errors
docker compose logs backend | grep -i "migration\|error"
```

### Database Connection Issues

```bash
# Test database connectivity
docker compose exec backend pnpm run migration:show

# Check database logs
docker compose logs db

# Access database directly
docker compose exec db psql -U postgres -c "\l"
```

### Seed Failed

If seeding fails:

```bash
# Reset and try again
docker compose down -v
docker compose up -d
sleep 10
docker compose exec backend pnpm run seed
```

---

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `development` | Enables Swagger & migrations |
| `PORT` | `8001` | Backend port |
| `POSTGRES_HOST` | `db` | Database host |
| `POSTGRES_USER` | `postgres` | DB username |
| `POSTGRES_PASSWORD` | `postgres` | DB password |
| `POSTGRES_DB` | `quotes_db` | Database name |
| `PGADMIN_EMAIL` | `admin@admin.com` | pgAdmin login |
| `PGADMIN_PASSWORD` | `admin` | pgAdmin password |

---

## Quick Access

| Service | URL |
|---------|-----|
| API | http://localhost:8001/api |
| Swagger | http://localhost:8001/api/docs |
| API Version | http://localhost:8001/api/version |
| Health | http://localhost:8001/api/health |
| pgAdmin | http://localhost:9000 |

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Migrations not running | Check `NODE_ENV=development`. Restart app: `docker compose restart backend` |
| Port already in use | Change port in `env.example` or stop other services |
| Can't access Swagger | Ensure `NODE_ENV=development` is set |
| pgAdmin can't connect | Use hostname `db` (not localhost), port `5432` |
| Seed data insertion fails | Reset DB: `docker compose down -v && docker compose up -d` |

---

## Notes

✅ Migrations are **automatic** on app startup (no manual run needed)
✅ Database schema is **created automatically** from migrations
✅ Sample data can be **seeded manually** with `pnpm run seed`
✅ pgAdmin provides **visual database management**
✅ Swagger documents **all API endpoints** automatically

