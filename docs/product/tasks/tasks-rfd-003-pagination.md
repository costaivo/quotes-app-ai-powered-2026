## Relevant Files

- `app/be/src/quotes/dto/pagination-query.dto.ts` - New DTO for `page` and `limit` query parameters. (new)
- `app/be/src/quotes/dto/paginated-response.dto.ts` - New DTO for the standardized paginated response structure. (new)
- `app/be/src/quotes/dto/pagination-meta.dto.ts` - New DTO for pagination metadata. (new)
- `app/be/src/quotes/repositories/quote.repository.ts` - Updates to `findAll` to support `skip` and `take`.
- `app/be/src/quotes/services/quote.service.ts` - Logic to calculate pagination metadata and structure the response.
- `app/be/src/quotes/api/quote.controller.ts` - Updates to the `findAll` endpoint signature.
- `app/be/src/quotes/services/quote.service.spec.ts` - Unit tests for pagination calculations.

### Notes

- The `limit` parameter is capped at 100 to prevent performance issues.
- Pagination uses 1-based indexing for the `page` parameter but 0-based `skip` for the database.
- The existing `author` and `query` filters must be preserved and work in conjunction with pagination.

## Tasks

- [ ] 1.0 Define DTOs and Interfaces
  - [x] 1.1 Create `PaginationQueryDto` with `page` (default 1) and `limit` (default 20, max 100) properties, extending `FindAllQuotesDto` if appropriate or composing it.
  - [x] 1.2 Create `PaginationMetaDto` to define the shape of the pagination metadata (`currentPage`, `totalPages`, `totalRecords`, etc.).
  - [x] 1.3 Create `PaginatedResponseDto<T>` generic class that contains `data: T[]` and `pagination: PaginationMetaDto`.

- [ ] 2.0 Implement Repository Layer Changes
  - [x] 2.1 Update `QuoteRepository.findAll` to accept `skip` and `take` parameters derived from the query.
  - [x] 2.2 Modify the query builder to return both the data and the total count using `getManyAndCount()`.
  - [x] 2.3 Ensure existing filters (`author`, `query`) are applied before counting and pagination.

- [x] 3.0 Update Service Layer Logic
  - [x] 3.1 Update `QuoteService.findAll` method signature to return `Promise<PaginatedResponseDto<QuoteResponseDto>>` instead of `Promise<QuoteResponseDto[]>`.
  - [x] 3.2 Implement logic to calculate `skip` from `page` and `limit` (e.g., `skip = (page - 1) * limit`).
  - [x] 3.3 Call the updated repository method to get `[items, total]`.
  - [x] 3.4 Implement logic to calculate derived metadata: `totalPages`, `hasNextPage`, `hasPreviousPage`.
  - [x] 3.5 Map the entity results to `QuoteResponseDto` and construct the final `PaginatedResponseDto`.

- [x] 4.0 Update Controller
  - [x] 4.1 Update `QuoteController.findAll` to use `PaginationQueryDto` (merging search params if needed).
  - [x] 4.2 Update the `@ApiResponse` decorator to reflect the new paginated schema.
  - [x] 4.3 Pass the query parameters correctly to the service.

- [ ] 5.0 Testing and Verification
  - [x] 5.1 Add unit tests to `QuoteService` to verify pagination math (e.g., correct `skip` calculation, correct `totalPages`).
  - [x] 5.2 Verify that default values (page=1, limit=20) are applied when parameters are missing.
  - [x] 5.3 Verify that the `limit` cap (100) is enforced (via validation pipe or manual check).
  - [x] 5.4 Test that `hasNextPage` and `hasPreviousPage` flags are correct at boundaries (first page, last page, middle page).
  - [x] 6.0 Update Postman collection with pagination queries and tests
  - [x] 6.1 Duplicate the request and rename it to "Get Quotes - Pagination".
    - [x] Add a query parameter `page` (e.g., `page=2`).
    - [x] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure the `currentPage` is 2.
  - [x] 6.2 Duplicate the request and rename it to "Get Quotes - Pagination with Filter".
    - [x] Add a query parameter `page` (e.g., `page=2`).
    - [x] Add a query parameter `author` (e.g., `author=einstein`).
    - [x] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure the `currentPage` is 2.
  - [x] 6.3 Duplicate the request and rename it to "Get Quotes - Pagination with Filter and Limit".
    - [x] Add a query parameter `page` (e.g., `page=2`).
    - [x] Add a query parameter `author` (e.g., `author=einstein`).
    - [x] Add a query parameter `limit` (e.g., `limit=10`).
    - [x] In the "Tests" tab, add a script to verify the response. It should check for a 200 status code and ensure the `currentPage` is 2.


**Approval:**
- **Next Sub-task**: yes
