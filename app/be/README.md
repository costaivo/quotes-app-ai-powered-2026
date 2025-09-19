# Backend

This is the backend of the quotes application.

## Tech Stack

-   **Framework**: NestJS
-   **Language**: TypeScript
-   **Runtime**: Node.js v20.9.0

## Quick Start

### Database Setup (for Development)

This application uses a PostgreSQL database. Before running the application in development, make sure you have PostgreSQL installed and running.

1.  **Create the database:**
    Connect to PostgreSQL and run the following command to create the database:
    ```sql
    CREATE DATABASE quotes_app;
    ```

2.  **Environment Variables (Optional):**
    The application connects to the database using the following default credentials:
    -   Host: `localhost`
    -   Port: `5432`
    -   Username: `postgres`
    -   Password: `postgres`
    -   Database: `quotes_app`

    If your local PostgreSQL setup uses different credentials, you can set environment variables in your shell to override the defaults. For example:
    ```sh
    export POSTGRES_HOST=localhost
    export POSTGRES_PORT=5432
    export POSTGRES_USER=myuser
    export POSTGRES_PASSWORD=mypassword
    export POSTGRES_DB=quotes_app
    ```

### Installation

```bash
pnpm install
```

### Running the app

```bash
# development
pnpm run start:dev

# watch mode
pnpm run start:watch

# production mode
pnpm run start:prod
```

### Test

```bash
pnpm run test
```

## API Documentation

### Tags and Authors Normalization

The API provides normalized responses for tags and authors to ensure consistency and prevent duplicates.

#### Tag Normalization

Tags are normalized when retrieved via the `/quotes/tags` endpoint:

- **Case normalization**: All tags are converted to lowercase
- **Deduplication**: Duplicate tags are removed (case-insensitive)
- **Sorting**: Tags are sorted alphabetically
- **Whitespace handling**: Leading and trailing whitespace is trimmed
- **Empty tag filtering**: Empty or whitespace-only tags are removed

**Example:**
```json
// Input quotes with tags:
// Quote 1: "INSPIRATION;Work;life"
// Quote 2: "work;WISDOM;inspiration"

// GET /quotes/tags response:
{
  "data": ["inspiration", "life", "wisdom", "work"],
  "success": true,
  "message": "Operation completed successfully"
}
```

#### Author Normalization

Authors are normalized when retrieved via the `/quotes/authors` endpoint:

- **Case-insensitive deduplication**: Authors with different casing are treated as the same person
- **Original case preservation**: The first occurrence's case is preserved
- **Sorting**: Authors are sorted alphabetically
- **Whitespace handling**: Leading and trailing whitespace is trimmed
- **Empty name filtering**: Empty or whitespace-only names are removed

**Example:**
```json
// Input quotes with authors:
// Quote 1: "Albert Einstein"
// Quote 2: "albert einstein"
// Quote 3: "ALBERT EINSTEIN"

// GET /quotes/authors response:
{
  "data": ["Albert Einstein"],
  "success": true,
  "message": "Operation completed successfully"
}
```

### Tag Validation Rules

When creating or updating quotes, tags must follow these validation rules:

- **No semicolons**: Semicolons (;) are not allowed in tag values
- **Space separation**: Use spaces to separate multiple tags
- **Character limits**: Maximum 500 characters total for all tags
- **Input sanitization**: Control characters and excessive whitespace are automatically cleaned

**Valid tag examples:**
```json
{
  "tags": "inspiration work passion"  // ✅ Valid
}
```

**Invalid tag examples:**
```json
{
  "tags": "inspiration;work;passion"  // ❌ Semicolons not allowed
}
```

### API Endpoints

- `GET /quotes/tags` - Get all unique tags (normalized)
- `GET /quotes/authors` - Get all unique authors (normalized)
- `POST /quotes` - Create a new quote (with validation)
- `PATCH /quotes/:id` - Update an existing quote (with validation)

## Rules

Please refer to the [backend rules](../../.cursor/be/be-rules.mdc) for coding standards and guidelines.
