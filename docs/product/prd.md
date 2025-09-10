# Quotes Application - Product Requirements Document (PRD)

**Version**: 1.0  
**Date**: 2025-09-10  
**Author**: generated-by-ai

## Introduction / Overview

This PRD describes the Quotes Application (Part 1) focused on Quotes Management. The product provides REST APIs to generate, retrieve, and manage quotes, enabling clients to store and query quotes, authors, tags, and track simple like counts.

## Goals

- Provide a RESTful quotes management API with full CRUD for quotes.
- Support a simple tagging and author extraction system for organization and discovery.
- Track engagements through a non-authenticated like counter.
- Ensure consistent JSON responses, validation, and error handling.

## User Stories

- As an API consumer, I want to create, read, update, and delete quotes so that I can manage a quotes collection.
- As an API consumer, I want to fetch all unique tags so that I can build tag-based filters or UI elements.
- As an API consumer, I want to fetch all unique authors so that I can list authors alphabetically.
- As an API consumer, I want to increment likes for a quote so that I can track engagement.

## Functional Requirements

- **Entity Structure**: Manage quotes with the following fields:
  - `id`: UUID (auto-generated)
  - `quote`: string, required, max 1000 characters
  - `author`: string, required, max 100 characters
  - `like_count`: integer, default 0, non-negative
  - `tags`: string, optional, semicolon-separated, max 500 characters

- **API Endpoints**:
  1. GET `/quotes` — Fetch all quotes
  2. POST `/quotes` — Add new quote
  3. PATCH `/quotes/{id}` — Update quote (partial updates)
  4. DELETE `/quotes/{id}` — Delete quote
  5. GET `/quotes/{id}` — Fetch quote by ID
  6. GET `/quotes/tags` — Fetch all unique tags from quotes
  7. GET `/quotes/authors` — Fetch all unique authors from quotes

- **Tag Processing**: Extract tags from the `tags` field, split on semicolons, normalize (trim, lowercase), deduplicate, and sort.
- **Author Processing**: Normalize author names (trim), deduplicate, and return alphabetically sorted list.
- **Like System**: Increment/decrement constrained to never go below 0. (Increment API can be implemented or managed via PATCH.)
- **Response Format**: All responses use a consistent JSON structure with `data`, `success`, and `message` fields; use proper HTTP status codes (200, 201, 400, 404, 500).
- **Validation & Error Handling**: Validate inputs (lengths, presence), return descriptive errors.
- **Persistence**: Data persisted to a database (PostgreSQL recommended) with UUID primary keys.

## Non-Goals (Out of Scope)

- User authentication and per-user like tracking.
- Complex analytics or real-time features.
- UI/Frontend implementations (API-only for Part 1).

## Design Considerations

- Keep APIs stateless and RESTful; use standard HTTP methods and codes.
- Tags are stored as semicolon-separated strings for simplicity; extraction occurs at read-time for `tags` endpoint.
- Ensure `like_count` never becomes negative and is an integer.

## Technical Considerations

- Use UUIDs for `id` fields.
- Use server-side validation libraries and return consistent error payloads.
- Recommended persistence: PostgreSQL with an ORM (e.g., TypeORM or Prisma).
- Consider pagination for `GET /quotes` if dataset grows.

## Success Metrics

- All endpoints implemented and passing integration tests.
- API validates inputs and returns correct status codes and error messages.
- Tags and authors endpoints return correct normalized, deduplicated, and sorted lists.

## Open Questions

- Should likes be a separate endpoint (e.g., `POST /quotes/{id}/like`) or handled via `PATCH`?
- Are tags ever expected to contain semicolons as part of a tag value? If so, a different delimiter or storage strategy should be used.

## Acceptance Criteria

- Implement all listed endpoints with validation and consistent response format.
- Ensure `tags` and `authors` endpoints return unique, normalized, sorted lists.
- Ensure `like_count` never drops below zero.
- Use UUIDs and persist data in PostgreSQL.

## Related RFDs

- (Add RFD links here when design-level decisions are required, e.g., `rfd/rfd-database-schema.md`)
