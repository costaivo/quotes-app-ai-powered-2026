---
title: "Search and Filtering of Quotes"
filename: "rfd-002-search-and-filtering-of-quotes.md"
date: 2025-11-20
author: Gemini
status: draft
rfd_number: 002
---

# Summary
This document outlines the design and implementation for adding search and filtering capabilities to the Quotes API's `GET /api/v1/quotes` endpoint. The primary decision is to adopt a database-specific, case-insensitive search strategy to provide a flexible and user-friendly search experience for client applications.

# Background & Context
The Product Requirements Document (`docs/product/prd.md`), under "Feature: API Search and Filtering (Part 2)," defines the need for users to find quotes based on author and content. This RFD proposes the technical implementation to satisfy those requirements, specifically focusing on providing case-insensitive, partial matching for search queries.

# Scope
This RFD covers the implementation of search and filtering for the `GET /api/v1/quotes` endpoint. This includes changes to the API controller, service layer, and data access layer to support filtering by `author` and `query` (content) parameters. It does not cover the implementation of pagination or complex search syntax.

# Decision Being Requested
1.  Approval to use the database-specific `ILIKE` operator for case-insensitive, partial-match searches.
2.  Adoption of `author` and `query` as the query parameter names for filtering.

# Goals & Success Metrics
-   **Goal**: Enhance quote retrieval by allowing filtering by author and content.
-   **Goal**: Maintain backward compatibility for requests without filter parameters.
-   **Metric**: The `GET /api/v1/quotes` endpoint successfully returns filtered results based on `author` and `query` parameters, verified via automated tests.
-   **Metric**: The response time for unfiltered requests does not significantly degrade.

# Constraints & Non-Goals
-   **Constraint**: The solution must be implemented at the database level without adding a separate full-text search engine.
-   **Non-goal**: Pagination is explicitly out of scope for this iteration.
-   **Non-goal**: Support for regular expressions or complex search syntax (`AND`/`OR` within a single field) will not be implemented.

# Options Considered
## Option A — Standard SQL `LIKE`
-   **Description**: Use the standard SQL `LIKE` operator combined with the `LOWER()` function on both the column and the search term to perform a case-insensitive search.
-   **Pros**: Highly portable across different SQL databases.
-   **Cons**: Can be non-performant as it may prevent the database from using an index on the searched column, leading to full table scans.
-   **Estimated effort & cost**: Low.

## Option B — Database-specific `ILIKE`
-   **Description**: Use a database-specific operator like PostgreSQL's `ILIKE` for a direct, case-insensitive search.
-   **Pros**: More concise and often more performant than `LOWER() + LIKE`. Can utilize certain types of indexes (e.g., `pg_trgm`) for significant performance gains.
-   **Cons**: Ties the implementation to a specific database vendor (e.g., PostgreSQL), reducing portability.
-   **Estimated effort & cost**: Low.

# Recommended Option
**Option B — Database-specific `ILIKE`** is recommended.

Given that performance is a consideration and the user experience depends on responsive search, `ILIKE` offers a better foundation. While it creates a dependency on a specific database feature, the trade-off for improved performance is justified for this core feature. The project is already using features that may be database-specific, and the performance gain is worth the minor portability loss.

# Implementation Plan
-   **Phase 1**: Add database indexes to the `author` and `text` columns to support efficient `ILIKE` queries.
-   **Phase 2**: Update the `QuoteController` and `QuoteService` to accept and process the new `author` and `query` query parameters.
-   **Phase 3**: Add unit and integration tests to verify the filtering logic, including case-insensitivity, partial matching, and combined filters.

# Dependencies
-   The implementation of `ILIKE` assumes the project is using a compatible database like PostgreSQL.

# Risks & Mitigations
-   **Risk**: Broad, non-selective searches (e.g., a single character) could still cause performance issues.
-   **Mitigation**: While no strategy for limiting queries will be implemented now, we will monitor query performance after deployment. If issues arise, we can consider adding a minimum character limit for searches in a future iteration.

# Monitoring & Rollback
-   **Monitoring**: API response times for the `GET /api/v1/quotes` endpoint will be monitored to ensure no significant degradation. Database query execution time will be observed.
-   **Rollback**: The feature will be deployed via a pull request. In case of critical issues, the PR can be reverted and the previous version of the application can be redeployed.

# Open Questions
-   Should there be a minimum length for search terms to prevent overly broad queries? (To be addressed in a future iteration if performance issues are observed).

# Approvals
-   [Engineering Lead] — pending
-   [Product Manager] — pending

# Change Log
-   rfd-002 created 2025-11-20 by Gemini
