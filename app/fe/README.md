---
# Frontend (fe)

This folder contains the frontend client for the Quotes Application. Tech stack and rules are defined in `app/fe/fe-rules`.

## Purpose

The frontend provides the UI for browsing and managing quotes. The scaffold uses Vite + React + TypeScript.

## Tech choices

- Build tool: Vite
- Framework: React (TypeScript)
- UI: TailwindCSS and Shadcn UI (optional)

## Node version

Use Node LTS. See `app/fe/.nvmrc` for the exact version (recommended: `lts/*` or `20.x`).

## How to scaffold a starter app

Use Vite to create a React + TypeScript project in this folder, or follow the `scaffold` script once `package.json` exists:

```bash
npm create vite@latest app-fe -- --template react-ts
cd app-fe
# Or to scaffold into this folder:
# npm create vite@latest . -- --template react-ts
```

## Example commands

- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Next steps

- Configure TailwindCSS and Shadcn UI
- Add initial pages and components under `src/`
- Add tests in `src/__tests__/`

## Links

- RFD: `docs/product/rfd/rfd-001-monorepo-base-project.md`
- Tasks: `docs/product/tasks/tasks-rfd-001-monorepo-base-project.md`


