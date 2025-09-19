## Relevant Files

- `app/be/src/controllers/quotes.controller.ts` - Main quotes controller where like/unlike endpoints will be added.
- `app/be/src/controllers/__tests__/quotes.controller.spec.ts` - Unit tests for quotes controller including new like endpoints.
- `app/be/src/services/quote.service.ts` - Quote service with existing like/unlike methods that need atomic operation updates.
- `app/be/src/services/quote.service.spec.ts` - Unit tests for quote service including concurrency tests.
- `app/be/src/repositories/quote.repository.ts` - Repository with existing like methods that need atomic database operations.
- `app/be/src/entities/quote.entity.ts` - Quote entity with existing like_count field and constraint.
- `app/be/src/migrations/` - Database migrations directory for any schema updates.
- `app/be/test/e2e/quotes.e2e-spec.ts` - End-to-end tests for like system concurrency scenarios.
- `app/be/src/common/interceptors/response.interceptor.ts` - Response interceptor for consistent API responses.
- `app/be/src/common/middleware/rate-limit.middleware.ts` - (new) Rate limiting middleware for like endpoints.

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `quotes.controller.ts` and `quotes.controller.spec.ts` in the same directory).
- Use `pnpm test` to run all tests, or `pnpm test:e2e` for end-to-end tests.
- The existing `like_count` field and constraint are already in place, but the implementation needs to be updated to use atomic operations.

## Tasks

- [ ] 1.0 Implement dedicated like/unlike API endpoints
  - [ ] 1.1 Add `POST /quotes/{id}/like` endpoint to `QuotesController` that calls `quoteService.likeQuote(id)`
  - [ ] 1.2 Add `POST /quotes/{id}/unlike` endpoint to `QuotesController` that calls `quoteService.unlikeQuote(id)`
  - [ ] 1.3 Ensure both endpoints return consistent response format using existing response interceptor
  - [ ] 1.4 Add proper HTTP status codes (200 OK for successful like/unlike operations)
  - [ ] 1.5 Add comprehensive JSDoc documentation for both endpoints including examples

- [ ] 2.0 Update repository to use atomic database operations for concurrency safety
  - [ ] 2.1 Replace `incrementLikeCount` method to use atomic SQL: `UPDATE quotes SET like_count = like_count + 1 WHERE id = $1 AND like_count >= 0 RETURNING *`
  - [ ] 2.2 Replace `decrementLikeCount` method to use atomic SQL: `UPDATE quotes SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1 RETURNING *`
  - [ ] 2.3 Update both methods to return the updated quote entity or null if quote not found
  - [ ] 2.4 Ensure database constraint `CHECK (like_count >= 0)` is properly enforced at DB level
  - [ ] 2.5 Add transaction support to ensure atomicity of like operations

- [ ] 3.0 Add comprehensive testing for like system including concurrency scenarios
  - [ ] 3.1 Add unit tests for new like/unlike controller endpoints in `quotes.controller.spec.ts`
  - [ ] 3.2 Add unit tests for updated atomic repository methods in `quote.service.spec.ts`
  - [ ] 3.3 Create concurrency test scenarios that simulate multiple simultaneous like requests
  - [ ] 3.4 Add tests to verify like_count never goes negative under any conditions
  - [ ] 3.5 Add tests for edge cases: like/unlike non-existent quotes, boundary conditions
  - [ ] 3.6 Add integration tests in `test/e2e/quotes.e2e-spec.ts` for like system end-to-end flow

- [ ] 4.0 Implement rate limiting and abuse prevention for like endpoints
  - [ ] 4.1 Create rate limiting middleware for like endpoints (e.g., 10 requests per minute per IP)
  - [ ] 4.2 Apply rate limiting specifically to `POST /quotes/{id}/like` and `POST /quotes/{id}/unlike` endpoints
  - [ ] 4.3 Add proper error responses for rate limit exceeded (429 Too Many Requests)
  - [ ] 4.4 Add rate limiting configuration that can be easily adjusted for different environments
  - [ ] 4.5 Add tests to verify rate limiting works correctly

- [ ] 5.0 Add integration tests and update existing test coverage
  - [ ] 5.1 Create end-to-end test suite for like system with real database operations
  - [ ] 5.2 Add performance tests to verify atomic operations handle concurrent load
  - [ ] 5.3 Update existing test coverage reports to include new like system functionality
  - [ ] 5.4 Add test data setup/teardown for like system integration tests
  - [ ] 5.5 Verify all existing tests still pass after implementing atomic operations
