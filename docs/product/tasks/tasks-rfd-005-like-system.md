## Relevant Files

- `app/be/src/controllers/quotes.controller.ts` - Main quotes controller with rate-limited like/unlike endpoints. (modified)
- `app/be/src/controllers/__tests__/quotes.controller.spec.ts` - Unit tests for quotes controller including comprehensive like/unlike endpoint tests. (modified)
- `app/be/src/services/quote.service.ts` - Quote service with existing like/unlike methods that need atomic operation updates.
- `app/be/src/services/quote.service.spec.ts` - Unit tests for quote service including comprehensive concurrency and edge case tests. (modified)
- `app/be/src/repositories/quote.repository.spec.ts` - Unit tests for quote repository including atomic operations tests. (modified)
- `app/be/src/repositories/quote.repository.ts` - Repository with atomic like methods implemented using query builder. (modified)
- `app/be/src/entities/quote.entity.ts` - Quote entity with existing like_count field and constraint.
- `app/be/src/migrations/` - Database migrations directory for any schema updates.
- `app/be/test/e2e/quotes.e2e-spec.ts` - End-to-end tests for like system concurrency scenarios.
- `app/be/src/common/interceptors/response.interceptor.ts` - Response interceptor for consistent API responses.
- `app/be/src/common/middleware/rate-limit.middleware.ts` - Comprehensive rate limiting middleware with configurable settings. (new)
- `app/be/src/common/middleware/middleware.module.ts` - Middleware module for applying rate limiting to like endpoints. (new)
- `app/be/src/common/middleware/__tests__/rate-limit.middleware.spec.ts` - Comprehensive tests for rate limiting middleware. (new)
- `app/be/src/common/middleware/__tests__/middleware.module.spec.ts` - Tests for middleware module configuration. (new)
- `app/be/src/app.module.ts` - Main application module with middleware configuration. (modified)
- `app/be/test/e2e/quotes.e2e-spec.ts` - Comprehensive end-to-end tests for like system including concurrency and performance tests. (modified)
- `app/be/TEST_COVERAGE_REPORT.md` - Detailed test coverage report for like system implementation. (new)

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `quotes.controller.ts` and `quotes.controller.spec.ts` in the same directory).
- Use `pnpm test` to run all tests, or `pnpm test:e2e` for end-to-end tests.
- The existing `like_count` field and constraint are already in place, but the implementation needs to be updated to use atomic operations.

## Tasks

- [x] 1.0 Implement dedicated like/unlike API endpoints ✅
  - [x] 1.1 Add `POST /quotes/{id}/like` endpoint to `QuotesController` that calls `quoteService.likeQuote(id)`
  - [x] 1.2 Add `POST /quotes/{id}/unlike` endpoint to `QuotesController` that calls `quoteService.unlikeQuote(id)`
  - [x] 1.3 Ensure both endpoints return consistent response format using existing response interceptor
  - [x] 1.4 Add proper HTTP status codes (200 OK for successful like/unlike operations)
  - [x] 1.5 Add comprehensive JSDoc documentation for both endpoints including examples

- [x] 2.0 Update repository to use atomic database operations for concurrency safety ✅
  - [x] 2.1 Replace `incrementLikeCount` method to use atomic SQL: `UPDATE quotes SET like_count = like_count + 1 WHERE id = $1 AND like_count >= 0 RETURNING *`
  - [x] 2.2 Replace `decrementLikeCount` method to use atomic SQL: `UPDATE quotes SET like_count = GREATEST(like_count - 1, 0) WHERE id = $1 RETURNING *`
  - [x] 2.3 Update both methods to return the updated quote entity or null if quote not found
  - [x] 2.4 Ensure database constraint `CHECK (like_count >= 0)` is properly enforced at DB level
  - [x] 2.5 Add transaction support to ensure atomicity of like operations

- [x] 3.0 Add comprehensive testing for like system including concurrency scenarios ✅
  - [x] 3.1 Add unit tests for new like/unlike controller endpoints in `quotes.controller.spec.ts`
  - [x] 3.2 Add unit tests for updated atomic repository methods in `quote.service.spec.ts`
  - [x] 3.3 Create concurrency test scenarios that simulate multiple simultaneous like requests
  - [x] 3.4 Add tests to verify like_count never goes negative under any conditions
  - [x] 3.5 Add tests for edge cases: like/unlike non-existent quotes, boundary conditions
  - [x] 3.6 Add integration tests in `test/e2e/quotes.e2e-spec.ts` for like system end-to-end flow

- [x] 4.0 Implement rate limiting and abuse prevention for like endpoints ✅
  - [x] 4.1 Create rate limiting middleware for like endpoints (e.g., 10 requests per minute per IP)
  - [x] 4.2 Apply rate limiting specifically to `POST /quotes/{id}/like` and `POST /quotes/{id}/unlike` endpoints
  - [x] 4.3 Add proper error responses for rate limit exceeded (429 Too Many Requests)
  - [x] 4.4 Add rate limiting configuration that can be easily adjusted for different environments
  - [x] 4.5 Add tests to verify rate limiting works correctly

- [x] 5.0 Add integration tests and update existing test coverage ✅
  - [x] 5.1 Create end-to-end test suite for like system with real database operations
  - [x] 5.2 Add performance tests to verify atomic operations handle concurrent load
  - [x] 5.3 Update existing test coverage reports to include new like system functionality
  - [x] 5.4 Add test data setup/teardown for like system integration tests
  - [x] 5.5 Verify all existing tests still pass after implementing atomic operations

