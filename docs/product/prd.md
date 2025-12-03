# 📖 Quotes Application - Product Requirements Document

---

## 🎯 Feature: Quote Management System (Part 1)

### Metadata
- **Version**: 1.0
- **Date**: 2025-11-19
- **Status**: Approved
- **Part**: 1 of N

---

## 📝 Introduction & Overview

The Quotes Application is a comprehensive quote management system that enables users to create, manage, organize, and discover inspiring quotes. Part 1 focuses on building a robust REST API foundation for quote management, tagging, and engagement tracking through a like system.

The system will serve as the backbone for quote-centric features including discovery, search, and user engagement without requiring authentication in Part 1.

---

## 🎯 Goals

1. **Establish a stateless, RESTful API** for quote management following HTTP conventions
2. **Enable quote CRUD operations** (Create, Read, Update, Delete) with proper data validation
3. **Implement a flexible tagging system** to organize and categorize quotes
4. **Provide efficient data retrieval patterns** for quotes, tags, and authors
5. **Track user engagement** through a simple like counter system
6. **Ensure data integrity** with proper validation and error handling

---

## 👥 User Stories

- As a **quote curator**, I want to **create new quotes with author information and tags** so that I can **build a library of inspirational content**.
- As a **quote browser**, I want to **retrieve all available quotes** so that I can **browse and discover inspiring content**.
- As a **quote enthusiast**, I want to **like quotes** so that I can **show appreciation and engagement with my favorite quotes**.
- As a **app maintainer**, I want to **update quote content and metadata** so that I can **correct errors or improve content quality**.
- As a **content manager**, I want to **delete outdated or inappropriate quotes** so that I can **maintain quality standards**.
- As a **explorer**, I want to **retrieve all unique tags** so that I can **filter and navigate quotes by category**.
- As a **explorer**, I want to **retrieve all unique authors** so that I can **discover quotes grouped by their creators**.
- As a **curator**, I want to **fetch a specific quote by ID** so that I can **view detailed information or link to it directly**.

---

## 📋 Functional Requirements

### 1. Quote Entity Definition

The Quote entity must include the following fields:

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| `id` | String (UUID) | Unique identifier for the quote | Auto-generated, immutable |
| `text` | String | The quote text content | Required, non-empty, max 1000 characters |
| `author` | String | Author of the quote | Required, non-empty, max 200 characters |
| `likes` | Number | Number of likes received | Default: 0, minimum: 0 |
| `tags` | String | Semicolon-separated tags | Optional, format: "tag1;tag2;tag3" |
| `createdAt` | ISO 8601 Timestamp | When the quote was created | Auto-generated, immutable |
| `updatedAt` | ISO 8601 Timestamp | When the quote was last updated | Auto-updated on modifications |

**Note on Tags:** Tags are stored as a semicolon-separated string (e.g., "programming;software;best-practices") to allow for flexible categorization without requiring a separate data structure in Part 1.

### 2. API Endpoints

| # | Method | Endpoint | Description | Request Body | Response | Status Codes |
|---|--------|----------|-------------|--------------|----------|--------------|
| 1 | GET | `/api/v1/quotes` | Fetch all quotes | N/A | Array of Quote objects | 200 OK |
| 2 | POST | `/api/v1/quotes` | Create a new quote | Quote object (text, author, tags optional) | Created Quote object | 201 Created, 400 Bad Request |
| 3 | GET | `/api/v1/quotes/:id` | Fetch a quote by ID | N/A | Single Quote object | 200 OK, 404 Not Found |
| 4 | PATCH | `/api/v1/quotes/:id` | Update a quote | Partial Quote object | Updated Quote object | 200 OK, 400 Bad Request, 404 Not Found |
| 5 | DELETE | `/api/v1/quotes/:id` | Delete a quote | N/A | Empty response | 204 No Content, 404 Not Found |
| 6 | GET | `/api/v1/quotes/tags/all` | Fetch all unique tags | N/A | Array of tag strings | 200 OK |
| 7 | GET | `/api/v1/quotes/authors/all` | Fetch all unique authors | N/A | Array of author strings | 200 OK |

### 3. Like System Implementation (Simple Counter)

- **Like Counter Management**: The `/api/v1/quotes/:id` PATCH endpoint can modify the `likes` field
- **Validation Rule**: The `likes` field must never be less than 0 (validated on update)
- **User Attribution**: Part 1 does not track which user liked a quote; it only maintains an aggregate count

**Example Update Request:**
```
PATCH /api/v1/quotes/{id}
{
  "likes": 15
}
```

### 4. Request/Response Formats

All API requests and responses use **JSON** format with standard HTTP headers:

**Request Headers:**
- `Content-Type: application/json`

**Response Headers:**
- `Content-Type: application/json`

**Error Response Format:**
```json
{
  "error": "string describing the error",
  "statusCode": "HTTP status code",
  "details": "optional detailed information"
}
```

### 5. Validation Rules

- **Quote Text**: Required, non-empty, maximum 1000 characters
- **Author**: Required, non-empty, maximum 200 characters
- **Tags**: Optional, must be semicolon-separated strings if provided
- **Likes**: Must be a non-negative integer (≥ 0)
- **ID**: Immutable unique identifier (UUID format)

### 6. Data Retrieval Patterns

- **Get All Quotes**: Returns complete list of quotes with all fields
- **Get Quote by ID**: Returns single quote object
- **Get All Tags**: Returns deduplicated list of tags across all quotes (parsed from semicolon-separated strings)
- **Get All Authors**: Returns deduplicated list of authors across all quotes

---

## 🚫 Non-Goals (Out of Scope)

- **User Authentication**: No login/authentication system in Part 1
- **User-Specific Data**: No tracking of individual user likes or preferences
- **Advanced Search**: No full-text search, filtering by date range, or complex queries in Part 1
- **Quote Ratings**: No star ratings, only like counts
- **Categories/Collections**: No quote collections or grouping beyond tags
- **Comments**: No commenting system for quotes
- **Image Support**: Quotes are text-only in Part 1
- **Analytics**: No detailed usage tracking or analytics in Part 1

---

## 🎨 Design Considerations

- **RESTful Design**: All endpoints follow RESTful principles with appropriate HTTP methods
- **Stateless API**: All requests are independent with no server-side session state
- **Consistent Naming**: Use kebab-case for URLs, camelCase for JSON fields
- **Error Handling**: Clear, descriptive error messages to guide API consumers
- **Pagination**: Not required for Part 1, but API should be designed to support it in future versions

---

## ⚙️ Technical Considerations

- **API Versioning**: Use `/api/v1/` prefix for version management
- **Data Persistence**: Requires persistent storage (database)
- **Concurrency**: Should handle concurrent requests safely
- **Performance**: Should efficiently handle CRUD operations and tag/author retrieval
- **Data Format**: JSON for all request/response payloads
- **Timestamp Format**: Use ISO 8601 format for all timestamps

---

## ✅ Success Metrics

- **API Availability**: 99%+ uptime
- **Response Time**: All endpoints respond within 500ms under normal load
- **Data Accuracy**: All CRUD operations maintain data integrity
- **Error Handling**: Proper HTTP status codes and error messages for all failure scenarios
- **Quote Library**: Successfully store and retrieve quotes with all required fields

---

## ❓ Open Questions

- Should API rate limiting be implemented in Part 1?
- What database backend will be used?
- Should there be any default quotes pre-populated?
- What is the expected scale (number of quotes, requests per second)?
- Should quote deletion be soft delete or hard delete?

---

## ✔️ Acceptance Criteria

### Must Have (MVP)
- [ ] All 7 API endpoints are implemented and functional
- [ ] CREATE endpoint validates required fields and rejects invalid requests
- [ ] READ endpoints return properly formatted JSON responses
- [ ] UPDATE endpoint can modify quote fields and like count
- [ ] DELETE endpoint removes quotes successfully
- [ ] Tag retrieval returns deduplicated list of all tags
- [ ] Author retrieval returns deduplicated list of all authors
- [ ] All endpoints return appropriate HTTP status codes
- [ ] Like count validation prevents negative values
- [ ] API follows RESTful conventions

### Should Have (Quality)
- [ ] Comprehensive API documentation (OpenAPI/Swagger spec)
- [ ] Input validation with clear error messages
- [ ] Request/response logging for debugging
- [ ] Database indexes for efficient queries

### Nice to Have
- [ ] API usage examples in README
- [ ] Unit tests for business logic
- [ ] Integration tests for all endpoints

---
---

## 🎯 Feature: API Search and Filtering (Part 2)

### Metadata
- **Version**: 1.1
- **Date**: 2025-11-20
- **Status**: Approved
- **Part**: 2 of N

---

## 📝 Introduction & Overview

This feature enhances the existing Quotes API by adding search and filtering capabilities to the `GET /api/v1/quotes` endpoint. It allows users to find specific quotes based on their content and author, making the API more powerful for client applications that need to display specific or filtered sets of quotes.

---

## 🎯 Goals

1.  **Enhance Quote Retrieval**: Allow filtering quotes by author and content.
2.  **Provide Flexible Search**: Implement case-insensitive, partial matching for search terms.
3.  **Support Combined Filters**: Enable filtering by both author and content simultaneously.
4.  **Maintain Backward Compatibility**: Ensure the existing `GET /api/v1/quotes` functionality remains unchanged when no filter parameters are provided.

---

## 👥 User Stories

- As a user, I want to search for quotes by author to see all quotes from a specific person.
- As a user, I want to search for quotes containing a specific word so I can find relevant content.
- As a developer, I want to filter quotes by both author and content to build a powerful search interface.

---

## 📋 Functional Requirements

### 1. Enhanced `GET /api/v1/quotes` Endpoint

The `GET /api/v1/quotes` endpoint will be updated to accept optional query parameters for filtering.

| Parameter | Type   | Description                                            |
|-----------|--------|--------------------------------------------------------|
| `author`  | String | Filter quotes by author name (case-insensitive, partial match). |
| `query`   | String | Filter quotes by content (case-insensitive, partial match).   |

### 2. Search Logic

-   **Case-Insensitive**: Searches for `author` and `query` must be case-insensitive. For example, a search for `einstein` should match "Einstein".
-   **Partial Match**: Searches must match partial strings. A `query` of "inspire" should match quotes containing "inspiration" or "inspiring".
-   **Combined Filtering**: When both `author` and `query` parameters are provided, the filter should apply `AND` logic, returning only quotes that match both criteria.
-   **No Results**: If no quotes match the filter criteria, the API must return a `200 OK` status with an empty JSON array `[]`.

### 3. API Endpoint Definition

| # | Method | Endpoint                      | Description                                   | Response                  | Status Codes |
|---|--------|-------------------------------|-----------------------------------------------|---------------------------|--------------|
| 1 | GET    | `/api/v1/quotes`              | Fetch all quotes.                             | Array of Quote objects    | 200 OK       |
| 1 | GET    | `/api/v1/quotes?author={name}` | Fetch quotes filtered by author.              | Array of Quote objects    | 200 OK       |
| 1 | GET    | `/api/v1/quotes?query={text}`  | Fetch quotes filtered by content.             | Array of Quote objects    | 200 OK       |
| 1 | GET    | `/api/v1/quotes?author={name}&query={text}` | Fetch quotes filtered by author and content. | Array of Quote objects | 200 OK       |


---

## 🚫 Non-Goals (Out of Scope)

-   **Pagination**: The API will return all matching results; pagination is not required for this iteration.
-   **Complex Search Syntax**: The feature will not support regular expressions, `OR` logic within a field, or other complex query languages.
-   **Full-Text Search Engine**: Integration with a dedicated search engine like Elasticsearch is not in scope. The search will be implemented at the database level.
-   **Sorting**: Results will be returned in the default order (e.g., by creation date); explicit sorting parameters will not be added.

---

## 🎨 Design Considerations

-   **Simplicity**: The query parameters should be simple and intuitive for developers to use.
-   **Performance**: While full-text search is not a goal, the implementation should be reasonably performant to not degrade the user experience on the client-side.

---

## ⚙️ Technical Considerations

-   **Database Indexing**: To ensure efficient querying, the `author` and `text` columns in the quotes table may require database indexes.
-   **Query Optimization**: The implementation should be mindful of generating efficient SQL queries to avoid performance bottlenecks (e.g., avoiding patterns that prevent index usage).

---

## ✅ Success Metrics

-   **Functionality**: Users can successfully filter quotes by author, content, and both combined.
-   **Performance**: The response time for unfiltered requests to `GET /api/v1/quotes` does not significantly degrade.
-   **API Contract Adherence**: The API correctly handles filter parameters and returns expected results, including an empty array for no matches.

---

## ❓ Open Questions

-   Should there be a minimum length for search terms to prevent overly broad or inefficient queries (e.g., searching for a single letter)?
-   How will the system handle special characters or symbols in search queries?

---

## ✔️ Acceptance Criteria

-   [ ] When `GET /api/v1/quotes` is called with no parameters, it returns all quotes.
-   [ ] `GET /api/v1/quotes?author=ein` returns all quotes where the author's name contains "ein" (case-insensitive).
-   [ ] `GET /api/v1/quotes?query=world` returns all quotes where the text contains "world" (case-insensitive).
-   [ ] `GET /api/v1/quotes?author=sagan&query=stars` returns quotes by authors containing "sagan" AND with content containing "stars".
-   [ ] If a search for a specific author and query yields no results, the API returns `200 OK` with an empty array `[]`.
-   [ ] Existing API endpoints (`POST`, `PATCH`, `DELETE`, etc.) remain unaffected.

---

## 🎯 Feature: Pagination Implementation (Part 3)

### Metadata
- **Version**: 1.1
- **Date**: 2025-12-01
- **Status**: Approved
- **Part**: 3 of N

---

## 📝 Introduction & Overview

The Quotes Application needs pagination functionality to efficiently browse large collections of quotes by dividing them into manageable pages. This improves performance and user experience when dealing with large datasets. This feature enhances the `GET /api/v1/quotes` endpoint to support pagination parameters.

---

## 🎯 Goals

1. **Enhanced Retrieval**: Support fetching quotes in pages to handle large datasets efficiently.
2. **Standardized Metadata**: Provide clear pagination information (total pages, current page, etc.) in the API response.
3. **Consistency**: Maintain existing search and filtering capabilities while adding pagination.
4. **Performance**: Optimize database queries using limits and offsets.
5. **Backward Compatibility**: Ensure existing functionality remains unchanged when pagination parameters are not provided (defaults used).

---

## 👥 User Stories

- As a **user**, I want to **browse quotes page by page** so that I am not overwhelmed by a massive list.
- As a **frontend developer**, I want to **receive total page counts and record counts** so that I can build a proper pagination UI (e.g., "Page 1 of 10").
- As a **system administrator**, I want to **limit the maximum number of quotes** returned per request to protect the server from overload.

---

## 📋 Functional Requirements

### 1. Pagination Metadata

The API response will include a metadata object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | Integer | Current page number being returned (1-indexed). |
| `totalPages` | Integer | Total number of available pages. |
| `totalRecords` | Integer | Total number of records in the dataset (matching filters). |
| `pageSize` | Integer | Number of records per page (max 100). |
| `hasNextPage` | Boolean | Whether there is a next page available. |
| `hasPreviousPage` | Boolean | Whether there is a previous page available. |

*(Note: Field names use camelCase to match project conventions).*

### 2. API Endpoint Updates

#### `GET /api/v1/quotes`

**Query Parameters:**

| Parameter | Type | Default | Constraints | Description |
|-----------|------|---------|-------------|-------------|
| `page` | Integer | 1 | Min: 1 | The page number to retrieve. |
| `limit` | Integer | 20 | Max: 100 | The number of quotes per page. |
| `author` | String | - | - | (Existing) Filter by author. |
| `query` | String | - | - | (Existing) Filter by content. |

**Response Format:**

The response structure changes from a simple array to an object containing `data` and `pagination` fields:

```json
{
  "data": [
    {
      "id": "uuid",
      "text": "Quote text...",
      "author": "Author Name",
      "likes": 0,
      "tags": "tag1;tag2",
      "createdAt": "2025-11-25T10:00:00Z",
      "updatedAt": "2025-11-25T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 92,
    "pageSize": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 3. Backward Compatibility & Integration

- If `page` or `limit` are not provided, the defaults (`page=1`, `limit=20`) are used.
- The search parameters (`author`, `query`) from Part 2 must work in conjunction with pagination.
- The `totalRecords` and `totalPages` must reflect the *filtered* dataset.

---

## 🚫 Non-Goals (Out of Scope)

- **Cursor-based Pagination**: This iteration uses offset-based pagination (`page`/`limit`).
- **Link Headers**: Pagination links are returned in the response body, not HTTP Link headers.

---

## 🎨 Design Considerations

- **Defaults**: Smart defaults ensure the API works immediately without complex parameter construction.
- **Protection**: A hard limit of 100 records per page prevents denial-of-service via massive data requests.
- **Conventions**: Use camelCase for JSON fields (e.g., `currentPage`) to maintain consistency with the existing API.

---

## ⚙️ Technical Considerations

- **Query Performance**: Use `LIMIT` and `OFFSET` in SQL queries.
- **Count Performance**: A secondary query (or window function) is required to get `totalRecords`. Ensure this is optimized.
- **Zero State**: If the requested page exceeds `totalPages`, return an empty `data` array with valid metadata.

---

## ✅ Success Metrics

- **Response Time**: Paged requests (default limit) respond within 200ms.
- **Usability**: Clients can successfully navigate the entire dataset using the provided metadata.

---

## ❓ Open Questions

- N/A

---

## ✔️ Acceptance Criteria

- [ ] `GET /api/v1/quotes` supports `page` and `limit` query parameters.
- [ ] Default values (page=1, limit=20) are applied if parameters are missing.
- [ ] `limit` parameter is capped at 100.
- [ ] Response follows the new `{ data: [...], pagination: {...} }` structure.
- [ ] Pagination metadata (`totalRecords`, `totalPages`, etc.) is accurate.
- [ ] Pagination works correctly with `author` and `query` filters.
- [ ] Requesting a page out of range returns empty data and correct metadata.
- [ ] Invalid parameters (e.g., `page=-1`) return `400 Bad Request`.

## 🎯 Feature: Simple File Logging (Part 4)

### Metadata
- **Version**: 1.1
- **Date**: 2025-12-03
- **Status**: Approved
- **Part**: 4 of N

---

## 📝 Introduction & Overview

The Quotes Application currently lacks a logging system, making it difficult to debug issues and monitor application behavior. This feature implements a simple file-based logging system with automatic log rotation to capture application events and errors in a structured format.

---

## 🎯 Goals

1. **Enable Multi-level Logging**: Support DEBUG, INFO, WARN, and ERROR levels.
2. **Structured Output**: produce logs in JSON format with timestamps for easy parsing.
3. **File Management**: Implement file-based logging with automatic rotation to manage disk usage.
4. **Configuration**: Allow log behavior to be configured via environment variables.

---

## 👥 User Stories

- As a **developer**, I want to **see detailed debug logs** so that I can **troubleshoot issues during development**.
- As a **system administrator**, I want **structured JSON logs** so that I can **easily parse and ingest logs into monitoring tools**.
- As a **DevOps engineer**, I want **automatic log rotation** so that **disk space is not consumed indefinitely**.
- As an **application maintainer**, I want to **configure log levels via environment variables** so that I can **change verbosity without code changes**.

---

## 📋 Functional Requirements

### 1. Log Levels
Support standard log levels, ordered by verbosity:
1. `DEBUG`: Detailed information for debugging.
2. `INFO`: General operational events (startup, shutdown, requests).
3. `WARN`: Warning conditions that don't stop the app.
4. `ERROR`: Error conditions that affect functionality.

### 2. Log Format
Logs must be structured JSON with the following standard fields:
- `timestamp`: ISO 8601 format (UTC).
- `level`: The log level (string).
- `message`: The log message string.
- `context`: (Optional) Additional data object.

**Example:**
```json
{
  "timestamp": "2025-12-03T10:15:30.123Z",
  "level": "INFO",
  "message": "Application started",
  "context": { "port": 3000, "env": "production" }
}
```

### 3. File Structure & Rotation
- Logs are written to a configurable file path (default: `logs/app.log`).
- **Rotation Policy**:
  - Rotate when file size exceeds limit (default: 10MB).
  - Keep a configurable number of backups (default: 5).
  - Compressed backups are optional but recommended.

### 4. Configuration
Behavior is controlled via environment variables:
- `LOG_LEVEL`: (default: `INFO`)
- `LOG_FILE_PATH`: (default: `./logs/app.log`)
- `LOG_MAX_SIZE`: (default: `10m`)
- `LOG_MAX_FILES`: (default: `5`)

---

## 🚫 Non-Goals (Out of Scope)

- **Centralized Logging**: Direct integration with external logging services (ELK, Splunk, etc.) is out of scope.
- **Database Logging**: Logs will not be stored in the database.
- **Complex Alerting**: No built-in alerting on log patterns.
- **UI Viewer**: No web interface for viewing logs in the app.

---

## 🎨 Design Considerations

- **Performance**: Logging should be asynchronous or buffered to minimize impact on request latency.
- **Standard Libraries**: Use established logging libraries for the target language (e.g., Winston/Pino for Node.js, Logback for Java) rather than implementing from scratch.
- **Environment**: Ensure the logs directory exists or is created on startup.

---

## ⚙️ Technical Considerations

- **Timestamps**: Must be UTC to avoid timezone confusion.
- **Security**: Avoid logging sensitive information (passwords, API keys, PII).
- **Concurrency**: The logging solution must handle concurrent writes safely.

---

## ✅ Success Metrics

- **Debuggability**: Developers can trace a request flow using the logs.
- **Reliability**: Logs are consistently written without data loss during rotation.
- **Parsability**: 100% of logs are valid JSON.

---

## ❓ Open Questions

- Should logs also be printed to STDOUT/STDERR for container environments? (Recommendation: Yes, dual output if possible).

---

## ✔️ Acceptance Criteria

- [ ] Application writes logs to the file specified in `LOG_FILE_PATH`.
- [ ] Log output is valid JSON with `timestamp`, `level`, and `message`.
- [ ] Setting `LOG_LEVEL` filters out lower-priority logs.
- [ ] Log rotation occurs when the file size limit is reached.
- [ ] Old log files are retained up to the configured limit.
- [ ] No sensitive data is logged by default.

---

## 📋 RFD Register

| RFD # | Title | Filename | Status | Date | Short summary |
|---:|---|---|---|---|---|
| 001 | Quote Management System - Part 1 Implementation Roadmap | rfd-001-quote-management-part1-implementation.md | draft | 2025-11-19 | Master implementation roadmap for delivering all MVP features. |
| 002 | Search and Filtering of Quotes | rfd-002-search-and-filtering-of-quotes.md | draft | 2025-11-20 | Defines the technical approach for adding search and filtering to the quotes API. |
| 003 | Pagination Implementation | rfd-003-pagination.md | draft | 2025-12-01 | Implement offset-based pagination for the quotes API. |
| 004 | Logging for backend | rfd-004-logging-for-backend.md | draft | 2025-12-03 | Select and design file-based logging using Winston. |

---

## 📚 Related Documentation

- [Requirements Part 1](./requirements/part-1.md) — Detailed technical requirements
- [PRD Generation Guidelines](../prompts/generate-prd.md) — Guidelines for maintaining this PRD

---

**Document Status**: Draft → Ready for Development  
**Last Updated**: 2025-12-03