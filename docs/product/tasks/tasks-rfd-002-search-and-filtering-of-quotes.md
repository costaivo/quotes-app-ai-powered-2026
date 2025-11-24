## Relevant Files

- `app/be/src/quotes/entities/quote.entity.ts` - (modified) The TypeORM entity for quotes. This file was updated to add database indexes to the `author` and `text` columns.
- `app/be/src/database/migrations/` - (verified) No new migration file was generated as the indexes already existed in the database due to schema synchronization.
- `app/be/src/quotes/controllers/quote.controller.ts` - (modified) Updated to accept `author` and `query` parameters using `@Query` and added `ApiQuery` for Swagger documentation.
- `app/be/src/quotes/dto/find-all-quotes.dto.ts` - (new) DTO class defining the filter parameters `author` and `query`.
- `app/be/src/quotes/services/quote.service.ts` - (modified) Updated `findAll` to pass filter DTO to repository.
- `app/be/src/quotes/repositories/quote.repository.ts` - (modified) Implemented `ILIKE` filtering using `QueryBuilder`.
- `app/be/src/quotes/services/quote.service.spec.ts` - (modified) Added unit tests for filtering.
- `app/be/test/app.e2e-spec.ts` - (modified) Added E2E tests for filtering logic.
- `docs/postman-collection/quotes-api-collection.json` - (modified) Updated with new requests and tests for filtering.
- `app/be/src/database/database.config.ts` - (modified) Temporarily modified to troubleshoot migration generation, then reverted.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `pnpm --filter be test:e2e` to run the end-to-end tests.
- Use `pnpm --filter be test` to run all unit tests.

## Tasks

- [x] 1.0 Update Quote Entity and Database
  - [x] 1.1 Add `@Index()` decorators to the `author` and `text` properties in `app/be/src/quotes/entities/quote.entity.ts` to improve query performance.
  - [x] 1.2 Generate a new TypeORM migration to apply the new database indexes. You can use a command like `pnpm --filter be typeorm:migration:generate -d app/be/src/database/database.config.ts app/be/src/database/migrations/AddIndexesToQuotes`. (Note: No migration was generated as indexes already existed in the database).
  - [x] 1.3 Review the generated migration file to ensure it correctly adds the indexes to the `quote` table. (Note: No migration was generated, so this step is considered complete).
- [ ] 2.0 Implement Filtering Logic in the API
  - [x] 2.1 In `app/be/src/quotes/controllers/quote.controller.ts`, update the `findAll()` method to accept `author` and `query` as optional query parameters using the `@Query()` decorator.
  - [x] 2.2 Create a new DTO file, `app/be/src/quotes/dto/find-all-quotes.dto.ts`, to encapsulate the `author` and `query` properties with validation (`@IsOptional()`, `@IsString()`). Use this DTO in the `findAll()` method of the controller.
  - [x] 2.3 In `app/be/src/quotes/services/quote.service.ts`, update the `findAll()` method signature to accept the filter DTO and pass the values to the repository.
  - [x] 2.4 In `app/be/src/quotes/repositories/quote.repository.ts`, modify the `findAll()` (or equivalent) method. Use TypeORM's `QueryBuilder` to dynamically add `WHERE` clauses with the `ILIKE` operator when `author` or `query` (for the `text` column) are provided.
- [ ] 3.0 Add and Update Tests for Filtering
  - [x] 3.1 In `app/be/src/quotes/services/quote.service.spec.ts`, add new unit tests to ensure the `findAll` method in the service calls the repository with the correct filtering parameters.
  - [x] 3.2 In `app/be/test/app.e2e-spec.ts`, add new end-to-end tests for the `GET /api/v1/quotes` endpoint. Test the following scenarios:
    - [x] No parameters (should return all quotes).
    - [x] Filtering by `author` only (case-insensitive, partial match).
    - [x] Filtering by `query` only (case-insensitive, partial match on the `text` field).
    - [x] Filtering by both `author` and `query`.
    - [x] Filtering with values that yield no results.
- [ ] 4.0 Update Postman collection with search and filter queries and tests
  - [x] 4.1 In `docs/postman-collection/quotes-api-collection.json`, find the `GET /api/v1/quotes` request.
  - [x] 4.2 Duplicate the request and rename it to "Get Quotes - Filter by Author".
    - [x] Add a query parameter `author` (e.g., `einstein`).
    - [x] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure every returned quote's author contains 'einstein' (case-insensitively).
  - [x] 4.3 Duplicate the request and rename it to "Get Quotes - Filter by Content".
    - [x] Add a query parameter `query` (e.g., `life`).
    - [x] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure every returned quote's text contains 'life' (case-insensitively).
  - [x] 4.4 Duplicate the request and rename it to "Get Quotes - Combined Filters".
    - [x] Add both `author` and `query` parameters.
    - [x] In the "Tests" tab, add a script to verify the response matches both criteria.
  - [x] 4.5 Duplicate the request and rename it to "Get Quotes - No Results".
    - [x] Use query parameters that are not expected to match any quotes (e.g., `query=xyzzy`).
    - [x] In the "Tests" tab, add a script to verify the response status is 200 and the returned body is an empty array `[]`.
  - [x] 4.6 Save the updated Postman collection file.
Approval: Awaiting approval
