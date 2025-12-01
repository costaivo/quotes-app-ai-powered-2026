# Copilot Instructions for AI Coding Agents

## Architecture Overview
- **Monorepo**: Contains both backend (`app/be`) and frontend (`app/fe`) projects. Uses `pnpm` for dependency management and scripts.
- **Backend**: Built with NestJS, TypeORM, and PostgreSQL. Exposes a REST API for quote management (CRUD, tags, authors, likes). See `app/be/README.md` for endpoints and database schema.
- **Frontend**: React + TypeScript + Vite. Uses Biome for linting/formatting. See `app/fe/README.md` for scripts and conventions.
- **Docker Compose**: Used for local development. See root `docker-compose.yml` and `start.sh` for orchestration.

## Developer Workflows
- **Install dependencies**: `pnpm install` (run from repo root)
- **Start all services**: `./start.sh` (runs Docker Compose, builds images, starts BE/FE)
- **Backend only**: `pnpm dev:be` (from `app/be`)
- **Frontend only**: `pnpm dev:fe` (from `app/fe`)
- **Run backend tests**: `pnpm test:be` (from `app/be`)
- **Lint/format frontend**: `pnpm run lint`, `pnpm run format` (from `app/fe`)

## Project Conventions
- **Use pnpm**: All package management and scripts use `pnpm` (not npm/yarn).
- **Biome**: Linting/formatting is enforced via `biome.json` at the repo root.
- **DTOs for validation**: Backend uses DTOs for request validation (see `app/be/src/quotes/` and `common/`).
- **Swagger docs**: Backend API docs at `/api/docs` when running locally.
- **Database**: PostgreSQL schema defined in `app/be/README.md` and `ormconfig.ts`.

## Integration & Patterns
- **API endpoints**: All backend endpoints are versioned under `/api/v1/`.
- **Cross-component communication**: FE communicates with BE via REST API (see Postman collection in `docs/postman-collection/`).
- **Error handling**: Global error filters in backend (`app/be/src/common/filters/`).
- **Testing**: Backend uses Jest (see `app/be/test/`).

## References
- **Tech stack**: `docs/tech-stack.md`
- **RFDs**: `docs/product/rfd/`
- **Backend API**: `app/be/README.md`, Swagger UI
- **Frontend scripts**: `app/fe/README.md`
- **Postman collection**: `docs/postman-collection/quotes-api-collection.json`

## Examples
- **Add a new backend endpoint**: Follow patterns in `app/be/src/quotes/`, update DTOs, service, and controller.
- **Add a new frontend component**: Place in `app/fe/src/components/`, follow Biome formatting.

---
For more details, see the referenced files and documentation directories. If a workflow or pattern is unclear, check the relevant `README.md` or ask for clarification.
