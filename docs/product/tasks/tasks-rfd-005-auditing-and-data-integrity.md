## Relevant Files

- `app/be/src/quotes/entities/quote.entity.ts` - The main entity file that needs to be updated with new columns and renamed fields.
- `app/be/src/quotes/dto/create-quote.dto.ts` - Input DTO that needs to accept `quote` instead of `text`.
- `app/be/src/quotes/dto/update-quote.dto.ts` - Update DTO for `quote` and `likeCount`.
- `app/be/src/quotes/dto/quote-response.dto.ts` - (If exists) or the Controller return type needs to map the entity to the new JSON structure.
- `app/be/src/database/migrations/` - New migration file for renaming columns and adding audit fields.
- `app/be/src/quotes/quotes.service.ts` - Business logic updates for new field names.
- `docs/postman-collection/quotes-api-collection.json` - Updated Postman collection with new field names and audit field tests.
- `app/be/test/app.e2e-spec.ts` - Updated E2E tests with schema validation and audit field tests.

### Notes

- The `Quote` entity *already* has `createdAt` and `updatedAt` (camelCase) in the file I just read, but they map to `createdAt` / `updatedAt` columns implicitly or explicitly. The RFD requests snake_case `created_at`, `updated_at` in the database. I need to check if they are currently camelCase in DB or snake_case.
- `text` -> `quote` is a breaking change.
- `likes` -> `like_count` is a breaking change.

**Approval:**
- **Next Sub-task**: Ready for git commit and PR workflow

## Tasks

- [x] 1.0 Database Migration & Schema Update
  - [x] 1.1 Generate a new migration file `RenameAndAuditQuotes` using TypeORM CLI.
  - [x] 1.2 Implement the `up` method to:
    - Rename column `text` to `quote`.
    - Rename column `likes` to `like_count`.
    - Add column `created_by` (UUID/varchar, nullable).
    - Add column `updated_by` (UUID/varchar, nullable).
    - Ensure `created_at` and `updated_at` are using snake_case naming (`created_at`, `updated_at`) if they aren't already (TypeORM default is usually camelCase property -> camelCase column unless naming strategy is used). *Self-correction: Standardize on snake_case for DB columns as per RFD.*
  - [x] 1.3 Implement the `down` method to revert changes.
  - [x] 1.4 Run the migration to verify it works against the local DB.

- [x] 2.0 Entity & DTO Updates
  - [x] 2.1 Update `app/be/src/quotes/entities/quote.entity.ts`:
    - Rename `text` property to `quote`.
    - Rename `likes` property to `likeCount`.
    - Explicitly map `@Column({ name: 'like_count' })` to `likeCount`.
    - Update `createdAt` to map to `@CreateDateColumn({ name: 'created_at' })`.
    - Update `updatedAt` to map to `@UpdateDateColumn({ name: 'updated_at' })`.
    - Add `createdBy` property mapped to `@Column({ name: 'created_by', nullable: true })`.
    - Add `updatedBy` property mapped to `@Column({ name: 'updated_by', nullable: true })`.
  - [x] 2.2 Update `CreateQuoteDto`:
    - Rename `text` to `quote`.
  - [x] 2.3 Update `UpdateQuoteDto`:
    - Rename `text` to `quote`.
    - Rename `likes` to `likeCount`.

- [x] 3.0 Service & Controller Refactoring
  - [x] 3.1 Update `QuotesService` methods (`create`, `findAll`, `findOne`, `update`) to use the new property names (`quote`, `likeCount`).
  - [x] 3.2 Update `QuotesController` to handle the new DTO structure. (Also updated QuoteRepository for consistency)
  - [x] 3.3 Verify any filtering/sorting logic (from Part 2/3) uses the correct database column names (`quote` vs `text`).
    - Updated `quote.repository.ts` to use `quote.quote` instead of `quote.text` in the query builder for filtering.
    - Updated test file `quote.service.spec.ts` to use new field names.
    - Controller has no hardcoded column references and uses DTOs, so it's compatible.

- [x] 4.0 Verification
  - [x] 4.1 Start the application and verify it starts without TypeORM errors.
  - [x] 4.2 Test `POST /quotes` with the new payload structure (`quote` instead of `text`).
  - [x] 4.3 Test `GET /quotes` and ensure response contains `created_at`, `updated_at`, `created_by`, `updated_by` (or camelCase equivalents in JSON depending on serializer settings).
  - [x] 4.4 Test `PATCH /quotes/:id` updates `updated_at`.

- [x] 5.0 Documentation & Tests
  - [x] 5.1 Update Postman collection to reflect new API contract (new field names `quote`, `likeCount` in requests/responses).
    - Updated Create Quote request to use `quote` field.
    - Updated Create Quote tests to validate new audit fields (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`).
    - Updated filter requests to search `quote.quote` instead of `quote.text`.
    - Updated Update Quote test to use `likeCount` and verify `updatedAt` changes.
    - Updated error test name to reflect new field name.
    - Added `createdAt` collection variable to track creation timestamp.
  - [x] 5.2 Add E2E test to validate the schema of the quotes response matches expected DTO with all new fields.
    - Added test `should validate response schema contains all required fields including audit fields`.
    - Validates all core fields and audit fields are present in responses.
  - [x] 5.3 Add E2E test to validate that `createdAt` and `updatedAt` fields have valid date values set upon creation.
    - Added test `should set valid timestamps on creation (createdAt and updatedAt)`.
    - Validates timestamps are within reasonable range and initially equal.
  - [x] 5.4 Add E2E test to validate that `updatedAt` changes when a quote is updated, but `createdAt` remains the same.
    - Added test `should update updatedAt timestamp but keep createdAt immutable`.
    - Validates `createdAt` doesn't change and `updatedAt` is newer after update.
    - Added test `should update likeCount and reflect in timestamp`.
  - [x] 5.5 Add E2E test to validate that `createdBy` and `updatedBy` are present (even if null).
    - Added test `should have createdBy and updatedBy as null (placeholders)`.
    - Validates both fields exist and are null (as expected until auth is implemented).
    - Added test `should return quote with all audit fields` in GET endpoint.
