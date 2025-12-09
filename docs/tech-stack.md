---
title: "Tech stack — Quotes App"
filename: "tech-stack.md"
date: 2025-12-09
author: "Technical Team"
---

# Tech stack

This document summarizes the technology stack for the Quotes App repository. It provides a comprehensive overview of all services, tools, and infrastructure components used across the monorepo. Use this as a high-level reference and link into service-level `ARCHITECTURE.md` files for implementation details.

## Summary

- **Monorepo layout**: `app/be` (backend) and `app/fe` (frontend) with separate package manifests and Dockerfiles
- **Package manager**: pnpm 9.15.0 (pinned globally)
- **Primary runtime**: Node.js 24.11.0 (pinned via `.nvmrc` files; note: Dockerfiles use 20.9.0 for stability)
- **Language**: TypeScript 5.x
- **Container orchestration**: Docker Compose with multi-service stack

## Global / repo-level

- **Package manager**: **pnpm** `9.15.0` (enforced via `preinstall` script; uses corepack)
- **Node version**: **24.11.0** (see `.nvmrc` files; local development)
  - **Docker runtime**: Node.js 20.9.0-alpine (used in production Dockerfiles for stability)
- **TypeScript**: ~5.9.3 (root workspace)
- **Code quality tools**:
  - **Linter**: Biome 2.3.6 (shared configuration via `biome.json`)
  - **Formatter**: Biome 2.3.6 (100-char line width, 2-space indent, single quotes, LF line endings)
- **Commit management**: Husky 9.1.7, @commitlint/cli 19.8.1 (conventional commits enforced)
- **Testing utilities**: @faker-js/faker 10.0.0 (for generating test data)

## Backend (app/be)

### Core Stack
- **Framework**: **NestJS** 11.0.1 (TypeScript-first, modular architecture)
- **Language**: **TypeScript** 5.5.4 (compiled to `dist/main.js`)
- **ORM**: **TypeORM** 0.3.27 (database abstraction layer)
- **Database**: **PostgreSQL** 15 (defined in docker-compose)

### Database & Migrations
- **Package**: `@nestjs/typeorm` 11.0.0
- **CLI**: TypeORM with `ts-node` support for migrations and seeds
- **Migration commands**: 
  - `migration:generate` - Auto-generate migrations
  - `migration:run` - Execute pending migrations
  - `seed` - Execute seed scripts (uses `src/database/seeds/seed.ts`)

### API & Validation
- **REST API**: @nestjs/platform-express (HTTP adapter)
- **API Documentation**: @nestjs/swagger 11.2.3, swagger-ui-express 5.0.1
- **Data validation**: class-validator 0.14.1, class-transformer 0.5.1 (DTO validation)

### Observability & Logging
- **Logging**: nest-winston 1.10.2, winston 3.18.3, winston-daily-rotate-file 5.0.0
- **Log output**: Rotated daily logs to `logs/app.log` (configured via `.env`)
- **Log aggregation**: Promtail 2.9.2 → Loki 2.9.2 (optional local stack)

### Database Driver
- **PostgreSQL Driver**: pg 8.16.3

### Runtime & Compilation
- **Entry point**: `dist/main.js` (compiled TypeScript)
- **Build command**: `nest build` (uses NestJS CLI)
- **Development**: `nest start --watch` (hot-reload with file watching)
- **Production**: `node dist/main.js`

### Testing
- **Test framework**: Jest 29.7.0
- **Configuration**: 
  - Test files: `**/*.spec.ts`
  - Coverage reports: `coverage/` directory
- **Test utilities**: @nestjs/testing 11.0.1, supertest 7.0.0, @types/jest 29.5.12

### Container
- **Dockerfile**: Multi-stage build (`app/be/Dockerfile`)
  - **Builder stage**: Node 20.9.0-alpine (compiles TypeScript)
  - **Development stage**: Node 20.9.0-alpine (includes dev dependencies, watch mode)
  - **Production stage**: Node 20.9.0-alpine (optimized, non-root user, supports migrations/seeds)
- **Port**: 3000
- **pnpm lockfile**: `pnpm-lock.yaml`

## Frontend (app/fe)

### Core Stack
- **Framework**: **React** 19.2.0 (latest, with concurrent features)
- **DOM library**: react-dom 19.2.0
- **Build tool**: **Vite** 6.4.1 (fast bundler, modern ES modules)
- **Language**: **TypeScript** 5.9.3 (with strict mode)
- **Routing**: @tanstack/react-router 1.136.11 (file-based and imperative routing)

### UI & Styling
- **CSS Framework**: **Tailwind CSS** 4.1.17 with **@tailwindcss/vite** 4.1.17
- **UI Components**:
  - **Radix UI Navigation**: @radix-ui/react-navigation-menu 1.2.14
  - **Icons**: lucide-react 0.554.0 (consistent SVG icons)
  - **Utility libraries**: 
    - clsx 2.1.1 (className merging)
    - tailwind-merge 3.4.0 (Tailwind class conflict resolution)
    - class-variance-authority 0.7.1 (component variant management)

### HTTP & API
- **HTTP Client**: axios 1.13.2 (configured to `VITE_API_BASE_URL` from `.env`)
- **VITE prefix**: All client-side env vars use `VITE_` prefix

### Build & Compilation
- **Type checking**: `tsc -b` (TypeScript compiler, project mode)
- **Build command**: `tsr generate && tsc -b && vite build`
  - `tsr generate` - TanStack Router type-safe route generation
  - `tsc -b` - Type checking
  - `vite build` - Production bundling to `dist/`
- **Dev server**: `tsr generate && vite` (auto-generates type-safe routes)
- **Preview**: `vite preview` (local preview of built assets)

### Development Tools
- **Router CLI**: @tanstack/router-cli 1.136.11
- **Vite Plugin**: @vitejs/plugin-react 4.3.4 (Fast Refresh support)
- **Animations**: tw-animate-css 1.4.0 (Tailwind animation library)

### Container
- **Dockerfile**: Multi-stage build (`app/fe/Dockerfile`)
  - **Builder stage**: Node 20.9.0-alpine (compiles React/TypeScript)
  - **Serve stage**: nginx:stable-alpine (serves built SPA)
  - **nginx config**: `nginx.conf` (SPA routing configuration)
- **Port**: 80 (nginx)
- **Static assets**: Copied from `/app/dist` to `/usr/share/nginx/html`

## Docker Compose Stack

The `docker-compose.yml` orchestrates a complete local development environment:

### Services
| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **be** | Custom (app/be) | 3000 | Backend API |
| **fe** | Custom (app/fe) | 5173→80 | Frontend SPA |
| **db** | postgres:15 | 5432 | Main application database |
| **adminer** | adminer | 8080 | Database GUI (lightweight) |
| **pgadmin** | dpage/pgadmin4 | 5050 | Database GUI (full-featured) |
| **dozzle** | amir20/dozzle:latest | 8888 | Log viewer UI |
| **loki** | grafana/loki:2.9.2 | 3100 | Log aggregation backend |
| **promtail** | grafana/promtail:2.9.2 | — | Log collector → Loki |
| **grafana** | grafana/grafana:latest | 3001 | Analytics & log querying UI |

### Network
- **Driver**: bridge (`app-network`)
- **Mounts**: Source code volumes for hot-reload in dev mode

### Database
- **Volume**: `postgres_data` (persistent PostgreSQL data)
- **Environment**: Credentials from `.env` (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)

## Development Scripts

### Root workspace (`package.json`)
```bash
pnpm dev              # Run both backend and frontend concurrently
pnpm dev:be           # Backend only with hot-reload
pnpm dev:fe           # Frontend only with Vite dev server
pnpm build            # Build both backend and frontend
pnpm test             # Run tests for both
pnpm lint             # Lint both (Biome)
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Check formatting (Biome)
pnpm format:write     # Auto-format code (Biome)
```

## Environment Configuration

### Shared `.env` file
Located at repository root; symlinked to both `app/be/.env` and `app/fe/.env`

**Backend variables:**
- NODE_ENV, PORT, DATABASE_URL, POSTGRES_* (credentials)
- LOG_LEVEL, LOG_FILE_PATH, LOG_MAX_SIZE, LOG_MAX_FILES

**Frontend variables:**
- VITE_API_BASE_URL (API endpoint for axios)
- VITE_APP_TITLE (application title)

See `env.example` for defaults suitable for Docker development.

## Infrastructure & Deployment

### Container Strategy
- **Backend**: Multi-stage Node build → optimized Alpine image with non-root user
- **Frontend**: Node build → static assets served by nginx (highly optimized)
- **Database**: PostgreSQL 15 (production-ready, persisted volumes)

### CI/CD Integration
- **Linting**: `pnpm lint` runs Biome on both services
- **Building**: `pnpm build` compiles both frontend and backend
- **Testing**: `pnpm test` runs Jest tests (backend), placeholder (frontend)
- **Locked dependencies**: `pnpm-lock.yaml` ensures reproducible installs

### Observability Stack (Optional)
- **Logs**: Promtail → Loki → Grafana (query, visualize, alert on logs)
- **Log viewer**: Dozzle (quick, lightweight log browsing)
- **Application logs**: Winston (daily rotation, configurable levels)

## Key Decisions & Rationale

### Node.js Versions
- **Local dev**: 24.11.0 (latest stable features)
- **Docker**: 20.9.0 (LTS, proven stability, compatible with all services)
- **Reason**: Stability in production while supporting modern local development

### pnpm 9.15.0
- **Faster, more efficient** than npm
- **Monorepo support** with workspace filtering (`pnpm --filter be`)
- **Stricter dependency management** (phantom dependencies are prevented)
- **Enforced via preinstall hook** to prevent accidental npm/yarn usage

### Biome over ESLint + Prettier
- **Single unified tool** for linting, formatting, and type checking
- **Built in Rust** (faster than Node.js-based tools)
- **Shared configuration** (single `biome.json` for both services)

### NestJS + TypeORM
- **Enterprise-ready** with built-in dependency injection
- **Full TypeScript support** for type safety at compile time
- **Database abstraction** via TypeORM for easy migrations and entity management

### React 19 + Vite + TanStack Router
- **React 19**: Latest features, better concurrent rendering
- **Vite**: Fast HMR, modern bundler, minimal configuration
- **TanStack Router**: Type-safe routing without manual configuration

### PostgreSQL 15 + Adminer/pgAdmin
- **PostgreSQL 15**: Stable, feature-rich, suitable for production
- **Adminer**: Lightweight alternative to pgAdmin for quick DB tasks
- **pgAdmin**: Full-featured GUI for advanced database management

### Tailwind CSS 4 + Radix UI
- **Tailwind 4**: Latest with JSX support, smaller bundle
- **Radix UI**: Headless components (unstyled, composable, accessible)
- **lucide-react**: Consistent icon library (200+ icons, single dependency)



