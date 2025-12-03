## Relevant Files

- `app/be/src/quotes/entities/quote.entity.ts` - The main entity file that needs to be updated with new columns and renamed fields.
- `app/be/src/quotes/dto/create-quote.dto.ts` - Input DTO that needs to accept `quote` instead of `text`.
- `app/be/src/quotes/dto/update-quote.dto.ts` - Update DTO for `quote` and `likeCount`.
- `app/be/src/quotes/dto/quote-response.dto.ts` - (If exists) or the Controller return type needs to map the entity to the new JSON structure.
- `app/be/src/database/migrations/` - New migration file for renaming columns and adding audit fields.
- `app/be/src/quotes/quotes.service.ts` - Business logic updates for new field names.

### Notes

- The `Quote` entity *already* has `createdAt` and `updatedAt` (camelCase) in the file I just read, but they map to `createdAt` / `updatedAt` columns implicitly or explicitly. The RFD requests snake_case `created_at`, `updated_at` in the database. I need to check if they are currently camelCase in DB or snake_case.
- `text` -> `quote` is a breaking change.
- `likes` -> `like_count` is a breaking change.

**Approval:**
- **Next Sub-task**: Awaiting approval for Task 3.0

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

- [ ] 3.0 Service & Controller Refactoring
  - [x] 3.1 Update `QuotesService` methods (`create`, `findAll`, `findOne`, `update`) to use the new property names (`quote`, `likeCount`).
  - [x] 3.2 Update `QuotesController` to handle the new DTO structure. (Also updated QuoteRepository for consistency)
  - [ ] 3.3 Verify any filtering/sorting logic (from Part 2/3) uses the correct database column names (`quote` vs `text`).

- [ ] 4.0 Verification
  - [ ] 4.1 Start the application and verify it starts without TypeORM errors.
  - [ ] 4.2 Test `POST /quotes` with the new payload structure (`quote` instead of `text`).
  - [ ] 4.3 Test `GET /quotes` and ensure response contains `created_at`, `updated_at`, `created_by`, `updated_by` (or camelCase equivalents in JSON depending on serializer settings).
  - [ ] 4.4 Test `PATCH /quotes/:id` updates `updated_at`.

- [ ] 5.0 Documentation & Tests
  - [ ] 5.1 Update Postman collection to reflect new API contract (new field names `quote`, `likeCount` in requests/responses).
  - [ ] 5.2 Add E2E test to validate the schema of the quotes response matches expected DTO with all new fields.
  - [ ] 5.3 Add E2E test to validate that `createdAt` and `updatedAt` fields have valid date values set upon creation.
  - [ ] 5.4 Add E2E test to validate that `updatedAt` changes when a quote is updated, but `createdAt` remains the same.
  - [ ] 5.5 Add E2E test to validate that `createdBy` and `updatedBy` are present (even if null).
