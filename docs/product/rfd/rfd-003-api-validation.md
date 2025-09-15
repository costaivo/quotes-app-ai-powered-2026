---
title: "REST API endpoints and validation"
filename: "rfd-003-api-validation.md"
date: 2025-09-11
author: generated-by-ai
status: draft
rfd_number: 003
---

# Summary

Define the canonical API contracts, validation strategy, and consistent response/error envelope for the Quotes Application. This RFD requests decisions on validation libraries, DTO patterns, and the response envelope described in the PRD.

# Background & Context

The PRD specifies endpoints (GET/POST/PATCH/DELETE `/quotes`, plus `/quotes/tags` and `/quotes/authors`) and requires consistent responses (`data`, `success`, `message`). We must choose validation and serialization strategies to enforce input constraints (lengths, presence) and produce consistent errors.

# Scope

In-scope:
- DTO/validation approach for NestJS backend
- Global response envelope and error format
- Postman collection to test the completed API endpoints using faker data

Out-of-scope:
- Frontend consumption patterns beyond basic contract examples


# Decision Being Requested

- Choose validation library and DTO pattern (Nest `class-validator` vs Zod vs Joi).
- Confirm global response envelope: `{ data, success, message }` and error format.

# Goals & Success Metrics

- Goal: Enforce PRD validation rules server-side and return consistent JSON responses.
- Metric: All endpoints validate inputs per PRD and tests assert error payload shape and HTTP codes.

# Constraints & Non-Goals

- Constraint: Work within NestJS best practices and minimize custom middleware.
- Non-goal: Implement hyper-custom serialization until needed.

# Options Considered

## Option A — Nest DTOs + `class-validator` (recommended)
- Description: Use NestJS DTO classes with `class-validator` and `class-transformer` for input validation and transformation.
- Pros: Integrates with Nest, widely used, clear decorator-based validation.
- Cons: Less functional-style validation compared to Zod.

## Option B — Zod validation layer
- Description: Use Zod schemas for validation, possibly integrated via pipes or middleware.
- Pros: Strong runtime schemas and type inference; composable.
- Cons: Additional integration work with Nest, less out-of-the-box decorator syntax.

## Option C — Joi
- Description: Use Joi for schema validation.
- Pros: Mature, flexible.
- Cons: Less TypeScript-native than Zod; integration work needed.

# Recommended Option

Recommend Option A: use NestJS DTOs with `class-validator` for initial implementation (lowest friction). Use a standardized response interceptor to wrap responses into `{ data, success, message }` and a global exception filter to format errors.

# Implementation Plan

- Phase 1 (owner: Backend): Implement DTOs for `CreateQuoteDto`, `UpdateQuoteDto` with `class-validator` constraints matching PRD (lengths, required fields). Add a global response interceptor and exception filter for consistent envelope.
- Phase 2 (owner: Backend): Add end-to-end tests verifying validation and response envelope.

Artifacts:

- **Postman collection**: A Postman collection will be provided at `docs/postman/quotes.postman_collection.json`. It includes example requests for `GET /quotes`, `POST /quotes`, `PATCH /quotes/:id`, `DELETE /quotes/:id`, and list endpoints for `/quotes/tags` and `/quotes/authors`.

- **Generating sample create payloads (faker-js)**: For `POST /quotes` the collection uses realistic example bodies created with `@faker-js/faker`. A small Node script is included (or can be run locally) to generate example JSON payloads which you can paste into Postman when running the `Create Quote` request.

Example Node script to generate a `POST /quotes` body with `@faker-js/faker`:

```javascript
// scripts/generate-sample-quote.js
import { faker } from '@faker-js/faker';

function generateQuote() {
  return {
    text: faker.lorem.sentences(2),
    author: `${faker.person.firstName()} ${faker.person.lastName()}`,
    tags: faker.helpers.arrayElements(['inspiration', 'life', 'love', 'wisdom', 'humor', 'philosophy'], faker.number.int({ min: 1, max: 3 })),
    source: faker.internet.url(),
  };
}

console.log(JSON.stringify(generateQuote(), null, 2));
```

Run the script with:

```bash
node --experimental-specifier-resolution=node --enable-source-maps scripts/generate-sample-quote.js | pbcopy
```

and paste the resulting JSON into the `Body` of the `Create Quote` request in Postman. Alternatively, the repository will include pre-generated example bodies under `docs/postman/examples/` that the collection references.

# Dependencies

- NestJS framework and `class-validator`/`class-transformer` packages.

# Risks & Mitigations

- Risk: Validation rules drift from PRD. Mitigation: Add automated tests that assert DTO validation.

# Monitoring & Rollback

- Monitor: Test failures and unexpected 400/500 rates in staging.
- Rollback: Revert DTO changes and restore last known-good behavior.

# Open Questions

-- None remaining specific to pagination (pagination is out-of-scope for this RFD).

# Approvals

- Backend lead — owner — pending


# Change Log

- rfd-003 created 2025-09-11 by generated-by-ai
- updated 2025-09-15 by ivo: removed pagination references; added Postman collection (`docs/postman/quotes.postman_collection.json`) and example `@faker-js/faker` script (`scripts/generate-sample-quote.js`) for generating `POST /quotes` payloads.

