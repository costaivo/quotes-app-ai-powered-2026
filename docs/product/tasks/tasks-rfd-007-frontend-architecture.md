## Relevant Files

- `app/fe/` - Frontend application scaffold (React + Vite + TypeScript). Contains initial `src/` with `App.tsx` and `main.tsx`.
- `docs/product/prd-frontend.md` - Frontend PRD with user stories and requirements.
- `docs/product/rfd/rfd-007-frontend-architecture.md` - RFD describing frontend architecture choices.
- `docs/product/decisions/adr-007-frontend-architecture.md` - ADR recording accepted frontend architecture decisions.
- `docs/product/rfd/rfd-008-frontend-design-system.md` - (new) Design system RFD to be created
- `docs/product/tasks/tasks-rfd-008-frontend-design-system.md` - (new) Task list for design system

### Notes

- Place tests alongside components (e.g., `src/components/QuoteCard.test.tsx`).
- Use `pnpm` scripts in `app/fe/package.json` for build/test/lint tasks.

## Tasks

- [ ] 1.0 Bootstrap frontend feature structure
  - [ ] 1.1 Create `src/features/quotes/` with `QuotesList`, `QuoteDetail`, `QuoteForm` components
  - [ ] 1.2 Add routing (Vite + React Router)
  - [ ] 1.3 Add API client using `fetch` with centralized error handling or use `react-query`

- [ ] 2.0 Implement core UI components
  - [ ] 2.1 Implement `QuoteCard` component with tags and like button
  - [ ] 2.2 Implement `Pagination` component and integrate with `GET /quotes`
  - [ ] 2.3 Implement `AuthorList` and `TagList` pages

- [ ] 3.0 State and data fetching
  - [ ] 3.1 Integrate `React Query` (or SWR) for server state caching
  - [ ] 3.2 Implement global error and loading handling

- [ ] 4.0 Testing and CI
  - [ ] 4.1 Add unit tests for components with Jest + React Testing Library
  - [ ] 4.2 Add e2e tests with Cypress and a basic CI workflow

- [ ] 5.0 Design system and accessibility
  - [ ] 5.1 Define design tokens and base styles (Tailwind or CSS variables)
  - [ ] 5.2 Implement accessible components and run axe checks in CI


