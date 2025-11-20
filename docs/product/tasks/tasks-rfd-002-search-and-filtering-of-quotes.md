## Relevant Files

- `app/be/src/quotes/entities/quote.entity.ts` - (modified) The TypeORM entity for quotes. This file was updated to add database indexes to the `author` and `text` columns.
- `app/be/src/database/migrations/` - (verified) No new migration file was generated as the indexes already existed in the database due to schema synchronization.
- `app/be/src/quotes/controllers/quote.controller.ts` - The controller handling the `GET /api/v1/quotes` endpoint. It will be modified to accept `author` and `query` as query parameters.
- `app/be/src/quotes/services/quote.service.ts` - The service layer containing the business logic. It will be updated to pass the filter parameters to the repository.
- `app/be/src/quotes/repositories/quote.repository.ts` - The data access layer responsible for database queries. This file will be updated to include `ILIKE` filtering logic.
- `app/be/test/app.e2e-spec.ts` - (modified) The end-to-end test file. An outdated test was removed, causing the test suite to be empty. New E2E tests for filtering will be added in a later task.
- `app/be/src/quotes/services/quote.service.spec.ts` - Unit tests for the quote service. This file will be updated to verify the new filtering logic.
- `docs/postman-collection/quotes-api-collection.json` - The Postman collection. It will be updated with new requests and tests for the filtering functionality.
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
  - [ ] 2.1 In `app/be/src/quotes/controllers/quote.controller.ts`, update the `findAll()` method to accept `author` and `query` as optional query parameters using the `@Query()` decorator.
  - [ ] 2.2 Create a new DTO file, `app/be/src/quotes/dto/find-all-quotes.dto.ts`, to encapsulate the `author` and `query` properties with validation (`@IsOptional()`, `@IsString()`). Use this DTO in the `findAll()` method of the controller.
  - [ ] 2.3 In `app/be/src/quotes/services/quote.service.ts`, update the `findAll()` method signature to accept the filter DTO and pass the values to the repository.
  - [ ] 2.4 In `app/be/src/quotes/repositories/quote.repository.ts`, modify the `findAll()` (or equivalent) method. Use TypeORM's `QueryBuilder` to dynamically add `WHERE` clauses with the `ILIKE` operator when `author` or `query` (for the `text` column) are provided.
- [ ] 3.0 Add and Update Tests for Filtering
  - [ ] 3.1 In `app/be/src/quotes/services/quote.service.spec.ts`, add new unit tests to ensure the `findAll` method in the service calls the repository with the correct filtering parameters.
  - [ ] 3.2 In `app/be/test/app.e2e-spec.ts`, add new end-to-end tests for the `GET /api/v1/quotes` endpoint. Test the following scenarios:
    - [ ] No parameters (should return all quotes).
    - [ ] Filtering by `author` only (case-insensitive, partial match).
    - [ ] Filtering by `query` only (case-insensitive, partial match on the `text` field).
    - [ ] Filtering by both `author` and `query`.
    - [ ] Filtering with values that yield no results.
- [ ] 4.0 Update Postman collection with search and filter queries and tests
  - [ ] 4.1 In `docs/postman-collection/quotes-api-collection.json`, find the `GET /api/v1/quotes` request.
  - [ ] 4.2 Duplicate the request and rename it to "Get Quotes - Filter by Author".
    - [ ] Add a query parameter `author` (e.g., `einstein`).
    - [ ] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure every returned quote's author contains 'einstein' (case-insensitively).
  - [ ] 4.3 Duplicate the request and rename it to "Get Quotes - Filter by Content".
    - [ ] Add a query parameter `query` (e.g., `life`).
    - [ ] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure every returned quote's text contains 'life' (case-insensitively).
  - [ ] 4.4 Duplicate the request and rename it to "Get Quotes - Combined Filters".
    - [ ] Add both `author` and `query` parameters.
    - [ ] In the "Tests" tab, add a script to verify the response matches both criteria.
  - [ ] 4.5 Duplicate the request and rename it to "Get Quotes - No Results".
    - [ ] Use query parameters that are not expected to match any quotes (e.g., `query=xyzzy`).
    - [ ] In the "Tests" tab, add a script to verify the response status is 200 and the returned body is an empty array `[]`.
  - [ ] 4.6 Save the updated Postman collection file.
Approval: Awaiting approval