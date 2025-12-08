# 📚 Documentation Index

Complete guide to deploying and managing the Quotes App Backend.

## Quick Links

### 🚀 Quick Start (5 minutes)
Start here if you want to get running immediately:
- **File**: `docker-app/README.md` (Section: Quick Start)
- **Steps**: Setup → Start → Migrate → Access

### 📖 Complete Deployment Guide
Detailed step-by-step with all configuration options:
- **File**: `app/be/docs/deploy/user-guide.md`
- **Includes**: docker-compose.yml template, .env setup, pgAdmin config

### 🔧 Migration & Seeding Reference
All migration and seeding commands in one place:
- **File**: `docker-app/MIGRATION_SEEDING_GUIDE.md`
- **Covers**: Automatic migrations, manual commands, troubleshooting

---

## Documentation Files

| File | Purpose | Audience | Length |
|------|---------|----------|--------|
| **docker-app/README.md** | Quick deployment guide | Developers | 266 lines |
| **docker-app/MIGRATION_SEEDING_GUIDE.md** | Migration/seeding reference | DevOps/Developers | 5.1 KB |
| **docker-app/docker-compose.yml** | Service configuration | DevOps | 70 lines |
| **docker-app/env.example** | Environment template | Everyone | 1.4 KB |
| **app/be/docs/deploy/user-guide.md** | Comprehensive guide | All | 350 lines |

---

## Deployment Paths

### Path 1: Quick Deployment (Recommended)
```bash
cd docker-app
cp env.example .env
docker compose up -d
# That's it! Migrations run automatically
```

**Time**: ~2 minutes
**Read**: `docker-app/README.md`

### Path 2: Manual with Seeding
```bash
cd docker-app
cp env.example .env
docker compose up -d
docker compose exec backend pnpm run seed
```

**Time**: ~3 minutes
**Read**: `docker-app/MIGRATION_SEEDING_GUIDE.md`

### Path 3: Production Deployment
```bash
# Edit .env with production values
# Update docker-compose for your infrastructure
# Set NODE_ENV=production (disable Swagger)
# Use strong passwords
```

**Time**: ~15 minutes
**Read**: `app/be/docs/deploy/user-guide.md` + `docker-app/README.md` (Production section)

---

## Key Configuration

### Ports
- **Backend**: 8001 (instead of 3000)
- **pgAdmin**: 9000
- **PostgreSQL**: 5432 (internal)

### Services
- **Backend**: NestJS API with automatic migrations
- **Database**: PostgreSQL 15 Alpine
- **Admin**: pgAdmin 4 for database management

### Environment
- **NODE_ENV**: development (enables Swagger)
- **Credentials**: All configurable via `.env`

---

## Common Tasks

### Start Fresh
```bash
docker compose down -v
docker compose up -d
```

### Run Migrations
```bash
# Automatic on startup
docker compose logs -f backend

# Or manual
docker compose exec backend pnpm run migration:run
```

### Seed Database
```bash
docker compose exec backend pnpm run seed
```

### Access Services
- **API**: http://localhost:8001/api
- **Swagger**: http://localhost:8001/api/docs
- **pgAdmin**: http://localhost:9000

### Troubleshoot
```bash
# Check logs
docker compose logs backend

# Check environment
docker compose exec backend printenv | grep NODE_ENV

# Check database
docker compose exec db psql -U postgres -d quotes_db
```

---

## Features

✅ **Automatic Migrations** - No manual setup needed, runs on startup
✅ **Sample Data Seeding** - 50+ quotes ready to load
✅ **Database UI** - pgAdmin for visual database management
✅ **API Documentation** - Swagger at /api/docs (development mode)
✅ **Production Ready** - Easy NODE_ENV switch to disable dev features
✅ **Health Checks** - Both backend and database monitored
✅ **Persistent Storage** - Docker volumes keep data safe

---

## Environment Variables

```bash
# Node environment
NODE_ENV=development          # Set to 'production' to disable Swagger

# Backend
PORT=8001                     # Application port

# Database
POSTGRES_HOST=db              # Database hostname
POSTGRES_PORT=5432            # Database port
POSTGRES_USER=postgres         # Database user
POSTGRES_PASSWORD=postgres     # Database password
POSTGRES_DB=quotes_db         # Database name

# pgAdmin
PGADMIN_EMAIL=admin@admin.com # pgAdmin login
PGADMIN_PASSWORD=admin        # pgAdmin password
```

---

## Verification Checklist

- [ ] Services started: `docker compose ps`
- [ ] Backend healthy: `curl http://localhost:8001/api/version`
- [ ] Swagger accessible: `curl http://localhost:8001/api/docs | grep -c "Swagger UI"`
- [ ] pgAdmin accessible: `curl http://localhost:9000 | head -1`
- [ ] Database has data: `curl http://localhost:8001/api/v1/quotes | jq '.data | length'`

---

## Troubleshooting

### Services won't start
→ Check `docker compose logs`, verify ports aren't in use

### Migrations not running
→ Check `NODE_ENV=development`, verify database started

### Can't access Swagger
→ Ensure `NODE_ENV=development`, check port 8001 is open

### pgAdmin can't connect
→ Use hostname `db` (not localhost), verify credentials

### Database error "relation already exists"
→ Run `docker compose down -v` to reset database

---

## Next Steps

1. **For Quick Start**: Follow `docker-app/README.md` sections 1-3
2. **For Full Setup**: Follow `app/be/docs/deploy/user-guide.md`
3. **For Details**: See `docker-app/MIGRATION_SEEDING_GUIDE.md`
4. **For Production**: Read production notes in `docker-app/README.md`

---

## Support References

| Need | See |
|------|-----|
| Quick start | `docker-app/README.md` |
| Migration help | `docker-app/MIGRATION_SEEDING_GUIDE.md` |
| Full setup | `app/be/docs/deploy/user-guide.md` |
| Troubleshooting | Any guide → Troubleshooting section |
| Production | `docker-app/README.md` → Production Notes |

---

## Summary

✅ **Fully automated deployment** - Just run `docker compose up -d`
✅ **Migrations handled automatically** - No manual steps needed
✅ **Sample data available** - Optional seeding with real quotes
✅ **Complete documentation** - Everything needed for any scenario
✅ **Production ready** - Easy configuration for any environment

**You're ready to deploy!** 🚀

