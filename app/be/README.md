---
# Backend (be)

This folder contains the backend service for the Quotes Application. Tech stack and rules are defined in `app/be/be-rules`.

## Purpose

The backend implements the Quotes API and persistence layer for the monorepo. It is intended to be a simple, production-ready NestJS scaffold that teams can extend.

## Tech choices

- Framework: NestJS (TypeScript)
- ORM: TypeORM
- Database: PostgreSQL

## Node version

Use Node LTS. See `app/be/.nvmrc` for the exact version (recommended: `lts/*` or `20.x`).

## How to scaffold a starter app

Run the NestJS CLI to generate a new project scaffold in this folder (or use the provided `scaffold` script once `package.json` exists):

```bash
npx @nestjs/cli new app-be --package-manager npm
cd app-be
# Or, if adding into this folder directly:
# npx @nestjs/cli new . --package-manager npm
```

## Example commands

- Start dev server: `npm run start:dev`
- Build: `npm run build`
- Start production: `npm run start:prod`

## Next steps

- Initialize TypeORM and add a connection to PostgreSQL
- Add initial entities and migrations
- Implement basic Quotes CRUD endpoints
- Add tests in `src/__tests__/`

## Links

- RFD: `docs/product/rfd/rfd-001-monorepo-base-project.md`
- Tasks: `docs/product/tasks/tasks-rfd-001-monorepo-base-project.md`


