# ADR 007 — Frontend architecture and framework

- **Status:** accepted
- **Date:** 2025-09-16
- **Decider / Owner:** Ivo

## Context

The frontend scaffold exists under `app/fe/` using React + Vite + TypeScript. We need to record the final architecture decisions so future contributors understand the chosen stack, patterns, and rationale.

## Decision

We accept the following architecture for the frontend:

- Framework: **React 18+**
- Build tool: **Vite**
- Language: **TypeScript**
- State management: **Start with React Context + SWR or React Query for data fetching; evolve to Redux Toolkit if needed**
- UI library: **TailwindCSS + headless UI components** (or Material UI if a component-heavy approach is preferred)
- Testing: **Jest + React Testing Library** for unit tests; **Cypress** for e2e tests
- Accessibility: **WCAG 2.1 AA** targets, automated checks in CI

## Consequences

- The project will standardize on the chosen stack across the frontend codebase.
- Documentation and onboarding will reference these choices.
- If state complexity increases, migrate to Redux Toolkit for predictable patterns.

## Implementation / Next steps

- Document design system and component library decisions in `docs/product/rfd/rfd-008-frontend-design-system.md` and follow up with a task list.
- Create initial CI steps to run frontend tests in the existing pipeline.

## Related

- RFD: `docs/product/rfd/rfd-007-frontend-architecture.md`


