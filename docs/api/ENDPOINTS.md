# API Endpoints Reference

Base URL: `/api/v1`

## Quotes

### 1. Get All Quotes
*   **Endpoint**: `GET /quotes`
*   **Description**: Retrieves a list of all quotes.
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": "uuid...",
        "text": "Quote text",
        "author": "Author Name",
        "likes": 0,
        "tags": "tag1;tag2",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
    ```

### 2. Create Quote
*   **Endpoint**: `POST /quotes`
*   **Body**:
    ```json
    {
      "text": "Required quote text (max 1000 chars)",
      "author": "Required author name (max 200 chars)",
      "tags": "optional;semicolon;separated;tags"
    }
    ```
*   **Response (201 Created)**: Returns the created quote object.

### 3. Get Quote by ID
*   **Endpoint**: `GET /quotes/:id`
*   **Params**: `id` (UUID)
*   **Response (200 OK)**: Returns the quote object.
*   **Response (404 Not Found)**: If ID does not exist.

### 4. Update Quote
*   **Endpoint**: `PATCH /quotes/:id`
*   **Params**: `id` (UUID)
*   **Body** (all optional):
    ```json
    {
      "text": "Updated text",
      "author": "Updated author",
      "likes": 5,
      "tags": "updated;tags"
    }
    ```
*   **Response (200 OK)**: Returns the updated quote object.

### 5. Delete Quote
*   **Endpoint**: `DELETE /quotes/:id`
*   **Params**: `id` (UUID)
*   **Response (204 No Content)**: Successfully deleted.

### 6. Get All Tags
*   **Endpoint**: `GET /quotes/tags/all`
*   **Response (200 OK)**: Array of unique tag strings.

### 7. Get All Authors
*   **Endpoint**: `GET /quotes/authors/all`
*   **Response (200 OK)**: Array of unique author strings.

## Validation Rules

*   **Text**: Required, string, max 1000 characters.
*   **Author**: Required, string, max 200 characters.
*   **Tags**: Optional, semicolon-separated string.
*   **Likes**: Optional (update only), non-negative integer.

