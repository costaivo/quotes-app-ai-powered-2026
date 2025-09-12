---
title: "Tech stack — Quotes App"
filename: "tech-stack.md"
date: 2025-09-11
author: "<Your Name>"
---

# Tech stack

This document summarizes the detected and recommended technology stack for the Quotes App repository (contents of `app/`). Use this as a high-level reference and link into service-level `ARCHITECTURE.md` files if you need implementation details.

## Summary

- **Monorepo layout**: `app/fe` (frontend) and `app/be` (backend) with separate package manifests and Dockerfiles.
- **Primary runtime**: Node.js 20.9.0 (pinned via `.nvmrc` in each service and used in Dockerfiles).
- **Language**: TypeScript

## Global / repo-level

- Package manager: **pnpm** (`package.json` files in `app/fe` and `app/be` include a `packageManager` field and the repository expects `pnpm` to be used).
- Node version: **20.9.0** (see `app/be/.nvmrc`, `app/fe/.nvmrc`, and Dockerfiles).

## Backend (app/be)

- Framework: **NestJS** (documented in `app/be/README.md`).
- Language: **TypeScript** (compiled to `dist/main.js`, `package.json` `main` points to `dist/main.js`).
- Entry point: `dist/main.js` (artifact of TypeScript compilation).
- Scripts: `start` -> `node dist/main.js` (other scripts are placeholders).
- Container: `app/be/Dockerfile` (multi-stage build; base image `node:20.9.0-alpine`; exposes port `3000`).
- Dependency management: `pnpm install` during build; Dockerfile should use `pnpm install --prod` or `pnpm install --only=production` in the final stage.

## Frontend (app/fe)

- Framework: **React 18** (dependencies `react`, `react-dom`).
- Build tool: **Vite** (`vite` in `devDependencies` and used in `scripts`).
- Language: **TypeScript** (`typescript` in `devDependencies` and `build` runs `tsc && vite build`).
- Dev server: `pnpm run dev` → `vite`.
- Production container: `app/fe/Dockerfile` builds in Node and serves static assets with `nginx:stable-alpine` (built assets copied from `/app/dist` to nginx html dir). Exposes port `80`.

## Tooling & dev dependencies

- TypeScript: ^5.x (frontend `devDependencies` lists `typescript@^5.0.2`).
- Vite: ^4.x
- React: ^18.2.0
- Recommendations: add linting (ESLint), formatting (Prettier), and test runners (Jest / Vitest) if not already present.

## Containers & CI/CD considerations

- Backend and frontend both provide Dockerfiles; backend uses multi-stage Node build, frontend builds with Vite then serves via nginx.
- Ensure CI builds run `pnpm install --frozen-lockfile` (or `pnpm install`) and `pnpm run build` for frontend and any build step for backend.
- Publish images to registry and include environment-specific configuration (env vars, secrets) via your chosen CD pipeline.

## Observability & infra (placeholders)

- Document chosen DB (Postgres/MySQL/Cloud DB), caching (Redis), message queues, and third-party integrations here.
- Add logging, metrics, and tracing tools (e.g., Winston/Logstash, Prometheus, OpenTelemetry) once selected.

## Rationale & notes

- Node.js 20.9.0 is pinned via `.nvmrc` and used in Dockerfiles for consistent runtime across environments.
- Frontend is a static single-page app built with Vite and served by nginx for simplicity and performance.
- Backend references NestJS and compiles TypeScript to `dist/` for production runs.



