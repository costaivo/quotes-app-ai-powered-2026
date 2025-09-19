# Tasks for RFD-004: Tags and Authors Normalization

Based on RFD-004-tags-authors.md, this task list implements the normalization and retrieval behavior for tags and authors endpoints according to the PRD requirements.

## Relevant Files

- `app/be/src/repositories/quote.repository.ts` - Update findAllTags() and findAllAuthors() methods to implement proper normalization (modified)
- `app/be/src/repositories/quote.repository.spec.ts` - Unit tests for updated repository methods with edge cases (modified)
- `app/be/src/services/quote.service.ts` - Service layer methods for tags and authors (already exist, may need updates)
- `app/be/src/services/quote.service.spec.ts` - Unit tests for service layer tag/author methods
- `app/be/src/controllers/quotes.controller.ts` - Controller endpoints for tags and authors (already exist)
- `app/be/src/controllers/__tests__/quotes.controller.spec.ts` - Unit tests for controller endpoints
- `app/be/test/e2e/quotes.e2e-spec.ts` - E2E tests for tags and authors endpoints with normalization verification
- `docs/postman/quotes.postman_collection.json` - Update Postman collection with examples for normalized tags/authors responses
- `app/be/src/common/validators/no-semicolon.validator.ts` - Custom validation decorator to check for semicolons in tag values (new)
- `app/be/src/common/validators/__tests__/no-semicolon.validator.spec.ts` - Unit tests for semicolon validation decorator (new)
- `app/be/src/common/validators/tag-sanitization.validator.ts` - Custom validation decorator and sanitization function for tag input (new)
- `app/be/src/common/validators/__tests__/tag-sanitization.validator.spec.ts` - Unit tests for tag sanitization validator and function (new)
- `app/be/src/dto/create-quote.dto.ts` - Updated to include semicolon and sanitization validation for tags field (modified)
- `app/be/src/dto/__tests__/create-quote.dto.spec.ts` - Updated tests to include semicolon and sanitization validation scenarios (modified)

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Update Tags Normalization Logic
  - [x] 1.1 Implement proper tag normalization in QuoteRepository.findAllTags() method (trim, lowercase, dedupe, sort)
  - [x] 1.2 Add validation to disallow semicolons in tag values during quote creation/update
  - [x] 1.3 Handle edge cases: empty tags, duplicate tags, trailing semicolons, whitespace-only tags
  - [x] 1.4 Update TypeORM query to use proper null filtering instead of `$ne` operator
  - [x] 1.5 Implement robust tag splitting that handles multiple consecutive semicolons
  - [x] 1.6 Add input sanitization to prevent malformed tag strings
- [ ] 2.0 Update Authors Normalization Logic
  - [ ] 2.1 Implement proper author normalization in QuoteRepository.findAllAuthors() method (trim, dedupe, sort alphabetically)
  - [ ] 2.2 Handle edge cases: empty authors, duplicate authors, whitespace-only authors
  - [ ] 2.3 Add case-insensitive author deduplication to handle "John Doe" vs "john doe"
  - [ ] 2.4 Implement proper author trimming and whitespace handling
- [ ] 3.0 Add Semicolon Validation to DTOs
  - [ ] 3.1 Create custom validation decorator to check for semicolons in tag values
  - [ ] 3.2 Update CreateQuoteDto to include semicolon validation for tags field
  - [ ] 3.3 Update UpdateQuoteDto to include semicolon validation for tags field
  - [ ] 3.4 Add appropriate error messages for semicolon validation failures
- [ ] 4.0 Add Comprehensive Test Coverage
  - [ ] 4.1 Add unit tests for tag normalization edge cases (empty, duplicates, semicolons, whitespace)
  - [ ] 4.2 Add unit tests for author normalization edge cases (empty, duplicates, whitespace)
  - [ ] 4.3 Add unit tests for semicolon validation in DTOs
  - [ ] 4.4 Add E2E tests to verify normalized responses from API endpoints
  - [ ] 4.5 Add integration tests for repository methods with various data scenarios
  - [ ] 4.6 Add performance tests to ensure normalization doesn't impact response times
- [ ] 5.0 Update Documentation and Examples
  - [ ] 5.1 Update Postman collection with examples showing normalized tag/author responses
  - [ ] 5.2 Add sample data generation that respects semicolon restrictions
  - [ ] 5.3 Document the normalization rules and semicolon policy in code comments
  - [ ] 5.4 Add API documentation comments explaining the normalization behavior
  - [ ] 5.5 Update README with examples of normalized tag/author responses

## Approval

- **Next Sub-task**: yes
