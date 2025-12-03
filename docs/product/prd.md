     1|# 📖 Quotes Application - Product Requirements Document
     2|
     3|---
     4|
     5|## 🎯 Feature: Quote Management System (Part 1)
     6|
     7|### Metadata
     8|- **Version**: 1.0
     9|- **Date**: 2025-11-19
    10|- **Status**: Approved
    11|- **Part**: 1 of N
    12|
    13|---
    14|
    15|## 📝 Introduction & Overview
    16|
    17|The Quotes Application is a comprehensive quote management system that enables users to create, manage, organize, and discover inspiring quotes. Part 1 focuses on building a robust REST API foundation for quote management, tagging, and engagement tracking through a like system.
    18|
    19|The system will serve as the backbone for quote-centric features including discovery, search, and user engagement without requiring authentication in Part 1.
    20|
    21|---
    22|
    23|## 🎯 Goals
    24|
    25|1. **Establish a stateless, RESTful API** for quote management following HTTP conventions
    26|2. **Enable quote CRUD operations** (Create, Read, Update, Delete) with proper data validation
    27|3. **Implement a flexible tagging system** to organize and categorize quotes
    28|4. **Provide efficient data retrieval patterns** for quotes, tags, and authors
    29|5. **Track user engagement** through a simple like counter system
    30|6. **Ensure data integrity** with proper validation and error handling
    31|
    32|---
    33|
    34|## 👥 User Stories
    35|
    36|- As a **quote curator**, I want to **create new quotes with author information and tags** so that I can **build a library of inspirational content**.
    37|- As a **quote browser**, I want to **retrieve all available quotes** so that I can **browse and discover inspiring content**.
    38|- As a **quote enthusiast**, I want to **like quotes** so that I can **show appreciation and engagement with my favorite quotes**.
    39|- As a **app maintainer**, I want to **update quote content and metadata** so that I can **correct errors or improve content quality**.
    40|- As a **content manager**, I want to **delete outdated or inappropriate quotes** so that I can **maintain quality standards**.
    41|- As a **explorer**, I want to **retrieve all unique tags** so that I can **filter and navigate quotes by category**.
    42|- As a **explorer**, I want to **retrieve all unique authors** so that I can **discover quotes grouped by their creators**.
    43|- As a **curator**, I want to **fetch a specific quote by ID** so that I can **view detailed information or link to it directly**.
    44|
    45|---
    46|
    47|## 📋 Functional Requirements
    48|
    49|### 1. Quote Entity Definition
    50|
    51|The Quote entity must include the following fields:
    52|
    53|| Field | Type | Description | Constraints |
    54||-------|------|-------------|------------|
    55|| `id` | String (UUID) | Unique identifier for the quote | Auto-generated, immutable |
    56|| `text` | String | The quote text content | Required, non-empty, max 1000 characters |
    57|| `author` | String | Author of the quote | Required, non-empty, max 200 characters |
    58|| `likes` | Number | Number of likes received | Default: 0, minimum: 0 |
    59|| `tags` | String | Semicolon-separated tags | Optional, format: "tag1;tag2;tag3" |
    60|| `createdAt` | ISO 8601 Timestamp | When the quote was created | Auto-generated, immutable |
    61|| `updatedAt` | ISO 8601 Timestamp | When the quote was last updated | Auto-updated on modifications |
    62|
    63|**Note on Tags:** Tags are stored as a semicolon-separated string (e.g., "programming;software;best-practices") to allow for flexible categorization without requiring a separate data structure in Part 1.
    64|
    65|### 2. API Endpoints
    66|
    67|| # | Method | Endpoint | Description | Request Body | Response | Status Codes |
    68||---|--------|----------|-------------|--------------|----------|--------------|
    69|| 1 | GET | `/api/v1/quotes` | Fetch all quotes | N/A | Array of Quote objects | 200 OK |
    70|| 2 | POST | `/api/v1/quotes` | Create a new quote | Quote object (text, author, tags optional) | Created Quote object | 201 Created, 400 Bad Request |
    71|| 3 | GET | `/api/v1/quotes/:id` | Fetch a quote by ID | N/A | Single Quote object | 200 OK, 404 Not Found |
    72|| 4 | PATCH | `/api/v1/quotes/:id` | Update a quote | Partial Quote object | Updated Quote object | 200 OK, 400 Bad Request, 404 Not Found |
    73|| 5 | DELETE | `/api/v1/quotes/:id` | Delete a quote | N/A | Empty response | 204 No Content, 404 Not Found |
    74|| 6 | GET | `/api/v1/quotes/tags/all` | Fetch all unique tags | N/A | Array of tag strings | 200 OK |
    75|| 7 | GET | `/api/v1/quotes/authors/all` | Fetch all unique authors | N/A | Array of author strings | 200 OK |
    76|
    77|### 3. Like System Implementation (Simple Counter)
    78|
    79|- **Like Counter Management**: The `/api/v1/quotes/:id` PATCH endpoint can modify the `likes` field
    80|- **Validation Rule**: The `likes` field must never be less than 0 (validated on update)
    81|- **User Attribution**: Part 1 does not track which user liked a quote; it only maintains an aggregate count
    82|
    83|**Example Update Request:**
    84|```
    85|PATCH /api/v1/quotes/{id}
    86|{
    87|  "likes": 15
    88|}
    89|```
    90|
    91|### 4. Request/Response Formats
    92|
    93|All API requests and responses use **JSON** format with standard HTTP headers:
    94|
    95|**Request Headers:**
    96|- `Content-Type: application/json`
    97|
    98|**Response Headers:**
    99|- `Content-Type: application/json`
   100|
   101|**Error Response Format:**
   102|```json
   103|{
   104|  "error": "string describing the error",
   105|  "statusCode": "HTTP status code",
   106|  "details": "optional detailed information"
   107|}
   108|```
   109|
   110|### 5. Validation Rules
   111|
   112|- **Quote Text**: Required, non-empty, maximum 1000 characters
   113|- **Author**: Required, non-empty, maximum 200 characters
   114|- **Tags**: Optional, must be semicolon-separated strings if provided
   115|- **Likes**: Must be a non-negative integer (≥ 0)
   116|- **ID**: Immutable unique identifier (UUID format)
   117|
   118|### 6. Data Retrieval Patterns
   119|
   120|- **Get All Quotes**: Returns complete list of quotes with all fields
   121|- **Get Quote by ID**: Returns single quote object
   122|- **Get All Tags**: Returns deduplicated list of tags across all quotes (parsed from semicolon-separated strings)
   123|- **Get All Authors**: Returns deduplicated list of authors across all quotes
   124|
   125|---
   126|
   127|## 🚫 Non-Goals (Out of Scope)
   128|
   129|- **User Authentication**: No login/authentication system in Part 1
   130|- **User-Specific Data**: No tracking of individual user likes or preferences
   131|- **Advanced Search**: No full-text search, filtering by date range, or complex queries in Part 1
   132|- **Quote Ratings**: No star ratings, only like counts
   133|- **Categories/Collections**: No quote collections or grouping beyond tags
   134|- **Comments**: No commenting system for quotes
   135|- **Image Support**: Quotes are text-only in Part 1
   136|- **Analytics**: No detailed usage tracking or analytics in Part 1
   137|
   138|---
   139|
   140|## 🎨 Design Considerations
   141|
   142|- **RESTful Design**: All endpoints follow RESTful principles with appropriate HTTP methods
   143|- **Stateless API**: All requests are independent with no server-side session state
   144|- **Consistent Naming**: Use kebab-case for URLs, camelCase for JSON fields
   145|- **Error Handling**: Clear, descriptive error messages to guide API consumers
   146|- **Pagination**: Not required for Part 1, but API should be designed to support it in future versions
   147|
   148|---
   149|
   150|## ⚙️ Technical Considerations
   151|
   152|- **API Versioning**: Use `/api/v1/` prefix for version management
   153|- **Data Persistence**: Requires persistent storage (database)
   154|- **Concurrency**: Should handle concurrent requests safely
   155|- **Performance**: Should efficiently handle CRUD operations and tag/author retrieval
   156|- **Data Format**: JSON for all request/response payloads
   157|- **Timestamp Format**: Use ISO 8601 format for all timestamps
   158|
   159|---
   160|
   161|## ✅ Success Metrics
   162|
   163|- **API Availability**: 99%+ uptime
   164|- **Response Time**: All endpoints respond within 500ms under normal load
   165|- **Data Accuracy**: All CRUD operations maintain data integrity
   166|- **Error Handling**: Proper HTTP status codes and error messages for all failure scenarios
   167|- **Quote Library**: Successfully store and retrieve quotes with all required fields
   168|
   169|---
   170|
   171|## ❓ Open Questions
   172|
   173|- Should API rate limiting be implemented in Part 1?
   174|- What database backend will be used?
   175|- Should there be any default quotes pre-populated?
   176|- What is the expected scale (number of quotes, requests per second)?
   177|- Should quote deletion be soft delete or hard delete?
   178|
   179|---
   180|
   181|## ✔️ Acceptance Criteria
   182|
   183|### Must Have (MVP)
   184|- [ ] All 7 API endpoints are implemented and functional
   185|- [ ] CREATE endpoint validates required fields and rejects invalid requests
   186|- [ ] READ endpoints return properly formatted JSON responses
   187|- [ ] UPDATE endpoint can modify quote fields and like count
   188|- [ ] DELETE endpoint removes quotes successfully
   189|- [ ] Tag retrieval returns deduplicated list of all tags
   190|- [ ] Author retrieval returns deduplicated list of all authors
   191|- [ ] All endpoints return appropriate HTTP status codes
   192|- [ ] Like count validation prevents negative values
   193|- [ ] API follows RESTful conventions
   194|
   195|### Should Have (Quality)
   196|- [ ] Comprehensive API documentation (OpenAPI/Swagger spec)
   197|- [ ] Input validation with clear error messages
   198|- [ ] Request/response logging for debugging
   199|- [ ] Database indexes for efficient queries
   200|
   201|### Nice to Have
   202|- [ ] API usage examples in README
   203|- [ ] Unit tests for business logic
   204|- [ ] Integration tests for all endpoints
   205|
   206|---
   207|---
   208|
   209|## 🎯 Feature: API Search and Filtering (Part 2)
   210|
   211|### Metadata
   212|- **Version**: 1.1
   213|- **Date**: 2025-11-20
   214|- **Status**: Approved
   215|- **Part**: 2 of N
   216|
   217|---
   218|
   219|## 📝 Introduction & Overview
   220|
   221|This feature enhances the existing Quotes API by adding search and filtering capabilities to the `GET /api/v1/quotes` endpoint. It allows users to find specific quotes based on their content and author, making the API more powerful for client applications that need to display specific or filtered sets of quotes.
   222|
   223|---
   224|
   225|## 🎯 Goals
   226|
   227|1.  **Enhance Quote Retrieval**: Allow filtering quotes by author and content.
   228|2.  **Provide Flexible Search**: Implement case-insensitive, partial matching for search terms.
   229|3.  **Support Combined Filters**: Enable filtering by both author and content simultaneously.
   230|4.  **Maintain Backward Compatibility**: Ensure the existing `GET /api/v1/quotes` functionality remains unchanged when no filter parameters are provided.
   231|
   232|---
   233|
   234|## 👥 User Stories
   235|
   236|- As a user, I want to search for quotes by author to see all quotes from a specific person.
   237|- As a user, I want to search for quotes containing a specific word so I can find relevant content.
   238|- As a developer, I want to filter quotes by both author and content to build a powerful search interface.
   239|
   240|---
   241|
   242|## 📋 Functional Requirements
   243|
   244|### 1. Enhanced `GET /api/v1/quotes` Endpoint
   245|
   246|The `GET /api/v1/quotes` endpoint will be updated to accept optional query parameters for filtering.
   247|
   248|| Parameter | Type   | Description                                            |
   249||-----------|--------|--------------------------------------------------------|
   250|| `author`  | String | Filter quotes by author name (case-insensitive, partial match). |
   251|| `query`   | String | Filter quotes by content (case-insensitive, partial match).   |
   252|
   253|### 2. Search Logic
   254|
   255|-   **Case-Insensitive**: Searches for `author` and `query` must be case-insensitive. For example, a search for `einstein` should match "Einstein".
   256|-   **Partial Match**: Searches must match partial strings. A `query` of "inspire" should match quotes containing "inspiration" or "inspiring".
   257|-   **Combined Filtering**: When both `author` and `query` parameters are provided, the filter should apply `AND` logic, returning only quotes that match both criteria.
   258|-   **No Results**: If no quotes match the filter criteria, the API must return a `200 OK` status with an empty JSON array `[]`.
   259|
   260|### 3. API Endpoint Definition
   261|
   262|| # | Method | Endpoint                      | Description                                   | Response                  | Status Codes |
   263||---|--------|-------------------------------|-----------------------------------------------|---------------------------|--------------|
   264|| 1 | GET    | `/api/v1/quotes`              | Fetch all quotes.                             | Array of Quote objects    | 200 OK       |
   265|| 1 | GET    | `/api/v1/quotes?author={name}` | Fetch quotes filtered by author.              | Array of Quote objects    | 200 OK       |
   266|| 1 | GET    | `/api/v1/quotes?query={text}`  | Fetch quotes filtered by content.             | Array of Quote objects    | 200 OK       |
   267|| 1 | GET    | `/api/v1/quotes?author={name}&query={text}` | Fetch quotes filtered by author and content. | Array of Quote objects | 200 OK       |
   268|
   269|
   270|---
   271|
   272|## 🚫 Non-Goals (Out of Scope)
   273|
   274|-   **Pagination**: The API will return all matching results; pagination is not required for this iteration.
   275|-   **Complex Search Syntax**: The feature will not support regular expressions, `OR` logic within a field, or other complex query languages.
   276|-   **Full-Text Search Engine**: Integration with a dedicated search engine like Elasticsearch is not in scope. The search will be implemented at the database level.
   277|-   **Sorting**: Results will be returned in the default order (e.g., by creation date); explicit sorting parameters will not be added.
   278|
   279|---
   280|
   281|## 🎨 Design Considerations
   282|
   283|-   **Simplicity**: The query parameters should be simple and intuitive for developers to use.
   284|-   **Performance**: While full-text search is not a goal, the implementation should be reasonably performant to not degrade the user experience on the client-side.
   285|
   286|---
   287|
   288|## ⚙️ Technical Considerations
   289|
   290|-   **Database Indexing**: To ensure efficient querying, the `author` and `text` columns in the quotes table may require database indexes.
   291|-   **Query Optimization**: The implementation should be mindful of generating efficient SQL queries to avoid performance bottlenecks (e.g., avoiding patterns that prevent index usage).
   292|
   293|---
   294|
   295|## ✅ Success Metrics
   296|
   297|-   **Functionality**: Users can successfully filter quotes by author, content, and both combined.
   298|-   **Performance**: The response time for unfiltered requests to `GET /api/v1/quotes` does not significantly degrade.
   299|-   **API Contract Adherence**: The API correctly handles filter parameters and returns expected results, including an empty array for no matches.
   300|
   301|---
   302|
   303|## ❓ Open Questions
   304|
   305|-   Should there be a minimum length for search terms to prevent overly broad or inefficient queries (e.g., searching for a single letter)?
   306|-   How will the system handle special characters or symbols in search queries?
   307|
   308|---
   309|
   310|## ✔️ Acceptance Criteria
   311|
   312|-   [ ] When `GET /api/v1/quotes` is called with no parameters, it returns all quotes.
   313|-   [ ] `GET /api/v1/quotes?author=ein` returns all quotes where the author's name contains "ein" (case-insensitive).
   314|-   [ ] `GET /api/v1/quotes?query=world` returns all quotes where the text contains "world" (case-insensitive).
   315|-   [ ] `GET /api/v1/quotes?author=sagan&query=stars` returns quotes by authors containing "sagan" AND with content containing "stars".
   316|-   [ ] If a search for a specific author and query yields no results, the API returns `200 OK` with an empty array `[]`.
   317|-   [ ] Existing API endpoints (`POST`, `PATCH`, `DELETE`, etc.) remain unaffected.
   318|
   319|---
   320|
   321|## 🎯 Feature: Pagination Implementation (Part 3)
   322|
   323|### Metadata
   324|- **Version**: 1.1
   325|- **Date**: 2025-12-01
   326|- **Status**: Approved
   327|- **Part**: 3 of N
   328|
   329|---
   330|
   331|## 📝 Introduction & Overview
   332|
   333|The Quotes Application needs pagination functionality to efficiently browse large collections of quotes by dividing them into manageable pages. This improves performance and user experience when dealing with large datasets. This feature enhances the `GET /api/v1/quotes` endpoint to support pagination parameters.
   334|
   335|---
   336|
   337|## 🎯 Goals
   338|
   339|1. **Enhanced Retrieval**: Support fetching quotes in pages to handle large datasets efficiently.
   340|2. **Standardized Metadata**: Provide clear pagination information (total pages, current page, etc.) in the API response.
   341|3. **Consistency**: Maintain existing search and filtering capabilities while adding pagination.
   342|4. **Performance**: Optimize database queries using limits and offsets.
   343|5. **Backward Compatibility**: Ensure existing functionality remains unchanged when pagination parameters are not provided (defaults used).
   344|
   345|---
   346|
   347|## 👥 User Stories
   348|
   349|- As a **user**, I want to **browse quotes page by page** so that I am not overwhelmed by a massive list.
   350|- As a **frontend developer**, I want to **receive total page counts and record counts** so that I can **build a proper pagination UI (e.g., "Page 1 of 10").
   351|- As a **system administrator**, I want to **limit the maximum number of quotes** returned per request to protect the server from overload.
   352|
   353|---
   354|
   355|## 📋 Functional Requirements
   356|
   357|### 1. Pagination Metadata
   358|
   359|The API response will include a metadata object with the following fields:
   360|
   361|| Field | Type | Description |
   362||-------|------|-------------|
   363|| `currentPage` | Integer | Current page number being returned (1-indexed). |
   364|| `totalPages` | Integer | Total number of available pages. |
   365|| `totalRecords` | Integer | Total number of records in the dataset (matching filters). |
   366|| `pageSize` | Integer | Number of records per page (max 100). |
   367|| `hasNextPage` | Boolean | Whether there is a next page available. |
   368|| `hasPreviousPage` | Boolean | Whether there is a previous page available. |
   369|
   370|*(Note: Field names use camelCase to match project conventions).*
   371|
   372|### 2. API Endpoint Updates
   373|
   374|#### `GET /api/v1/quotes`
   375|
   376|**Query Parameters:**
   377|
   378|| Parameter | Type | Default | Constraints | Description |
   379||-----------|------|---------|-------------|-------------|
   380|| `page` | Integer | 1 | Min: 1 | The page number to retrieve. |
   381|| `limit` | Integer | 20 | Max: 100 | The number of quotes per page. |
   382|| `author` | String | - | - | (Existing) Filter by author. |
   383|| `query` | String | - | - | (Existing) Filter by content. |
   384|
   385|**Response Format:**
   386|
   387|The response structure changes from a simple array to an object containing `data` and `pagination` fields:
   388|
   389|```json
   390|{
   391|  "data": [
   392|    {
   393|      "id": "uuid",
   394|      "text": "Quote text...",
   395|      "author": "Author Name",
   396|      "likes": 0,
   397|      "tags": "tag1;tag2",
   398|      "createdAt": "2025-11-25T10:00:00Z",
   399|      "updatedAt": "2025-11-25T10:00:00Z"
   400|    }
   401|  ],
   402|  "pagination": {
   403|    "currentPage": 1,
   404|    "totalPages": 5,
   405|    "totalRecords": 92,
   406|    "pageSize": 20,
   407|    "hasNextPage": true,
   408|    "hasPreviousPage": false
   409|  }
   410|}
   411|```
   412|
   413|### 3. Backward Compatibility & Integration
   414|
   415|- If `page` or `limit` are not provided, the defaults (`page=1`, `limit=20`) are used.
   416|- The search parameters (`author`, `query`) from Part 2 must work in conjunction with pagination.
   417|- The `totalRecords` and `totalPages` must reflect the *filtered* dataset.
   418|
   419|---
   420|
   421|## 🚫 Non-Goals (Out of Scope)
   422|
   423|- **Cursor-based Pagination**: This iteration uses offset-based pagination (`page`/`limit`).
   424|- **Link Headers**: Pagination links are returned in the response body, not HTTP Link headers.
   425|
   426|---
   427|
   428|## 🎨 Design Considerations
   429|
   430|- **Defaults**: Smart defaults ensure the API works immediately without complex parameter construction.
   431|- **Protection**: A hard limit of 100 records per page prevents denial-of-service via massive data requests.
   432|- **Conventions**: Use camelCase for JSON fields (e.g., `currentPage`) to maintain consistency with the existing API.
   433|
   434|---
   435|
   436|## ⚙️ Technical Considerations
   437|
   438|- **Query Performance**: Use `LIMIT` and `OFFSET` in SQL queries.
   439|- **Count Performance**: A secondary query (or window function) is required to get `totalRecords`. Ensure this is optimized.
   440|- **Zero State**: If the requested page exceeds `totalPages`, return an empty `data` array with valid metadata.
   441|
   442|---
   443|
   444|## ✅ Success Metrics
   445|
   446|- **Response Time**: Paged requests (default limit) respond within 200ms.
   447|- **Usability**: Clients can successfully navigate the entire dataset using the provided metadata.
   448|
   449|---
   450|
   451|## ❓ Open Questions
   452|
   453|- N/A
   454|
   455|---
   456|
   457|## ✔️ Acceptance Criteria
   458|
   459|- [ ] `GET /api/v1/quotes` supports `page` and `limit` query parameters.
   460|- [ ] Default values (page=1, limit=20) are applied if parameters are missing.
   461|- [ ] `limit` parameter is capped at 100.
   462|- [ ] Response follows the new `{ data: [...], pagination: {...} }` structure.
   463|- [ ] Pagination metadata (`totalRecords`, `totalPages`, etc.) is accurate.
   464|- [ ] Pagination works correctly with `author` and `query` filters.
   465|- [ ] Requesting a page out of range returns empty data and correct metadata.
   466|- [ ] Invalid parameters (e.g., `page=-1`) return `400 Bad Request`.
   467|
   468|## 🎯 Feature: Simple File Logging (Part 4)
   469|
   470|### Metadata
   471|- **Version**: 1.1
   472|- **Date**: 2025-12-03
   473|- **Status**: Approved
   474|- **Part**: 4 of N
   475|
   476|---
   477|
   478|## 📝 Introduction & Overview
   479|
   480|The Quotes Application currently lacks a logging system, making it difficult to debug issues and monitor application behavior. This feature implements a simple file-based logging system with automatic log rotation to capture application events and errors in a structured format.
   481|
   482|---
   483|
   484|## 🎯 Goals
   485|
   486|1. **Enable Multi-level Logging**: Support DEBUG, INFO, WARN, and ERROR levels.
   487|2. **Structured Output**: produce logs in JSON format with timestamps for easy parsing.
   488|3. **File Management**: Implement file-based logging with automatic rotation to manage disk usage.
   489|4. **Configuration**: Allow log behavior to be configured via environment variables.
   490|
   491|---
   492|
   493|## 👥 User Stories
   494|
   495|- As a **developer**, I want to **see detailed debug logs** so that I can **troubleshoot issues during development**.
   496|- As a **system administrator**, I want **structured JSON logs** so that I can **easily parse and ingest logs into monitoring tools**.
   497|- As a **DevOps engineer**, I want **automatic log rotation** so that **disk space is not consumed indefinitely**.
   498|- As an **application maintainer**, I want to **configure log levels via environment variables** so that I can **change verbosity without code changes**.
   499|
   500|---
   501|
   502|## 📋 Functional Requirements
   503|
   504|### 1. Log Levels
   505|Support standard log levels, ordered by verbosity:
   506|1. `DEBUG`: Detailed information for debugging.
   507|2. `INFO`: General operational events (startup, shutdown, requests).
   508|3. `WARN`: Warning conditions that don't stop the app.
   509|4. `ERROR`: Error conditions that affect functionality.
   510|
   511|### 2. Log Format
   512|Logs must be structured JSON with the following standard fields:
   513|- `timestamp`: ISO 8601 format (UTC).
   514|- `level`: The log level (string).
   515|- `message`: The log message string.
   516|- `context`: (Optional) Additional data object.
   517|
   518|**Example:**
   519|```json
   520|{
   521|  "timestamp": "2025-12-03T10:15:30.123Z",
   522|  "level": "INFO",
   523|  "message": "Application started",
   524|  "context": { "port": 3000, "env": "production" }
   525|}
   526|```
   527|
   528|### 3. File Structure & Rotation
   529|- Logs are written to a configurable file path (default: `logs/app.log`).
   530|- **Rotation Policy**:
   531|  - Rotate when file size exceeds limit (default: 10MB).
   532|  - Keep a configurable number of backups (default: 5).
   533|  - Compressed backups are optional but recommended.
   534|
   535|### 4. Configuration
   536|Behavior is controlled via environment variables:
   537|- `LOG_LEVEL`: (default: `INFO`)
   538|- `LOG_FILE_PATH`: (default: `./logs/app.log`)
   539|- `LOG_MAX_SIZE`: (default: `10m`)
   540|- `LOG_MAX_FILES`: (default: `5`)
   541|
   542|---
   543|
   544|## 🚫 Non-Goals (Out of Scope)
   545|
   546|- **Centralized Logging**: Direct integration with external logging services (ELK, Splunk, etc.) is out of scope.
   547|- **Database Logging**: Logs will not be stored in the database.
   548|- **Complex Alerting**: No built-in alerting on log patterns.
   549|- **UI Viewer**: No web interface for viewing logs in the app.
   550|
   551|---
   552|
   553|## 🎨 Design Considerations
   554|
   555|- **Performance**: Logging should be asynchronous or buffered to minimize impact on request latency.
   556|- **Standard Libraries**: Use established logging libraries for the target language (e.g., Winston/Pino for Node.js, Logback for Java) rather than implementing from scratch.
   557|- **Environment**: Ensure the logs directory exists or is created on startup.
   558|
   559|---
   560|
   561|## ⚙️ Technical Considerations
   562|
   563|- **Timestamps**: Must be UTC to avoid timezone confusion.
   564|- **Security**: Avoid logging sensitive information (passwords, API keys, PII).
   565|- **Concurrency**: The logging solution must handle concurrent writes safely.
   566|
   567|---
   568|
   569|## ✅ Success Metrics
   570|
   571|- **Debuggability**: Developers can trace a request flow using the logs.
   572|- **Reliability**: Logs are consistently written without data loss during rotation.
   573|- **Parsability**: 100% of logs are valid JSON.
   574|
   575|---
   576|
   577|## ❓ Open Questions
   578|
   579|- Should logs also be printed to STDOUT/STDERR for container environments? (Recommendation: Yes, dual output if possible).
   580|
   581|---
   582|
   583|## ✔️ Acceptance Criteria
   584|
   585|- [ ] Application writes logs to the file specified in `LOG_FILE_PATH`.
   586|- [ ] Log output is valid JSON with `timestamp`, `level`, and `message`.
   587|- [ ] Setting `LOG_LEVEL` filters out lower-priority logs.
   588|- [ ] Log rotation occurs when the file size limit is reached.
   589|- [ ] Old log files are retained up to the configured limit.
   590|- [ ] No sensitive data is logged by default.
   591|
   592|---
   593|
   594|## 🎯 Feature: Data Integrity & Auditing (Part 5)
   595|
   596|### Metadata
   597|- **Version**: 1.1
   598|- **Date**: 2025-12-03
   599|- **Status**: Draft
   600|- **Part**: 5 of N
   601|
   602|---
   603|
   604|## 📝 Introduction & Overview
   605|
   606|Data integrity and auditability are critical for production systems. This feature adds auditing columns to the Quote entity to track when quotes are created and modified, and by whom. This provides a clear audit trail and standardizes the entity definition for future growth.
   607|
   608|---
   609|
   610|## 🎯 Goals
   611|
   612|1. **Establish Audit Trail**: Track `created_at`, `updated_at`, `created_by`, and `updated_by` for all quotes.
   613|2. **Standardize Entity Definition**: Adopt a consistent schema for the Quote entity (field naming and structure).
   614|3. **Transparent Integration**: Ensure audit fields are automatically managed and included in API responses without breaking existing endpoints.
   615|
   616|---
   617|
   618|## 👥 User Stories
   619|
   620|- As a **system administrator**, I want to **see who created or updated a quote** so that I can **audit changes and maintain accountability**.
   621|- As a **developer**, I want **consistent timestamps** (`created_at`, `updated_at`) so that I can **reliably sort and display quote history**.
   622|- As an **API consumer**, I want to **receive audit metadata in the response** so that I can **display creation and update times to users**.
   623|
   624|---
   625|
   626|## 📋 Functional Requirements
   627|
   628|### 1. Quote Entity Update
   629|
   630|The Quote entity definition is updated to the following schema. Note the field renaming to match the new consistent definition.
   631|
   632|| Field | Type | Description |
   633||-------|------|-------------|
   634|| `id` | UUID | Unique identifier. |
   635|| `quote` | String | The quote text content (formerly `text`). |
   636|| `author` | String | Author of the quote. |
   637|| `like_count` | Integer | Number of likes (formerly `likes`). |
   638|| `tags` | String | Semicolon-separated tags. |
   639|| `created_at` | Timestamp | When the record was created. |
   640|| `updated_at` | Timestamp | When the record was last modified. |
   641|| `created_by` | String/UUID | User ID of creator. |
   642|| `updated_by` | String/UUID | User ID of last modifier. |
   643|
   644|### 2. Automatic Auditing
   645|- `created_at` and `created_by` are set once upon creation.
   646|- `updated_at` and `updated_by` are updated on every modification.
   647|- Timestamps must be in UTC.
   648|
   649|### 3. API Transparency
   650|- New fields (`created_at`, `updated_at`, `created_by`, `updated_by`) are included in all Quote API responses.
   651|- Renamed fields (`quote`, `like_count`) replace the old field names (`text`, `likes`) in the JSON response.
   652|
   653|---
   654|
   655|## 🚫 Non-Goals (Out of Scope)
   656|
   657|- **Authentication Logic**: Determining *who* the user is (authentication) is not implemented. `created_by` and `updated_by` will be placeholders or derived from a mock user context until auth is available.
   658|- **History Table**: We are not maintaining a separate history table of all past versions, only the current state with audit timestamps.
   659|
   660|---
   661|
   662|## 🎨 Design Considerations
   663|
   664|- **Naming Convention**: The move to snake_case for `created_at`, `like_count`, etc., aligns with the database schema but may require mapping if the JSON API prefers camelCase (unless the requirement implies changing the JSON API to match). *Assumption: The "Consistent Definition" applies to the API interface as well.*
   665|
   666|---
   667|
   668|## ⚙️ Technical Considerations
   669|
   670|- **Database Migration**: Existing data (if any) needs to be migrated to the new schema (renaming columns, populating audit fields with defaults).
   671|- **Middleware**: Audit logic can be implemented via database triggers or application-level hooks/middleware.
   672|
   673|---
   674|
   675|## ✅ Success Metrics
   676|
   677|- **Data Integrity**: Every new/updated record has valid audit timestamps and user IDs.
   678|- **Compatibility**: API clients can consume the new format (communicated as a version update if strictly breaking).
   679|
   680|---
   681|
   682|## ❓ Open Questions
   683|
   684|- Should `created_by`/`updated_by` be nullable for existing records? (Yes, or system default).
   685|
   686|---
   687|
   688|## ✔️ Acceptance Criteria
   689|
   690|- [ ] Quote entity includes `created_at`, `updated_at`, `created_by`, `updated_by`.
   691|- [ ] Fields `text` and `likes` are renamed to `quote` and `like_count`.
   692|- [ ] API responses include all new and renamed fields.
   693|- [ ] Creation timestamp is immutable; update timestamp changes on edit.
   694|- [ ] User tracking fields are present (even if mock/system user for now).
   695|
   696|---
   697|
   698|## 📋 RFD Register
   699|
   700|| RFD # | Title | Filename | Status | Date | Short summary |
   701||---:|---|---|---|---|---|
   702|| 001 | Quote Management System - Part 1 Implementation Roadmap | rfd-001-quote-management-part1-implementation.md | completed | 2025-11-19 | Master implementation roadmap for delivering all MVP features. |
   703|| 002 | Search and Filtering of Quotes | rfd-002-search-and-filtering-of-quotes.md | completed | 2025-11-20 | Defines the technical approach for adding search and filtering to the quotes API. |
   704|| 003 | Pagination Implementation | rfd-003-pagination.md | completed | 2025-12-01 | Implement offset-based pagination for the quotes API. |
   705|| 004 | Logging for backend | rfd-004-logging-for-backend.md | completed | 2025-12-03 | Select and design file-based logging using Winston. |
   706|| 005 | Auditing and Data Integrity | rfd-005-auditing-and-data-integrity.md | draft | 2025-12-03 | Implement automatic audit timestamps and user tracking placeholders. |
   707|
   708|---
   709|
   710|## 📚 Related Documentation
   711|
   712|- [Requirements Part 1](./requirements/part-1.md) — Detailed technical requirements
   713|- [PRD Generation Guidelines](../prompts/generate-prd.md) — Guidelines for maintaining this PRD
   714|
   715|---
   716|
   717|**Document Status**: Draft → Ready for Development  
   718|**Last Updated**: 2025-12-03
   719|