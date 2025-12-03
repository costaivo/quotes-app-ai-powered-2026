
# Quotes Backend

A robust REST API for managing quotes, built with NestJS, TypeORM, and PostgreSQL.

## Features

*   **Quote Management**: Create, read, update, and delete quotes.
*   **Validation**: Strict input validation using DTOs.
*   **Metadata**: Support for tags, authors, and likes.
*   **Documentation**: Interactive Swagger API documentation.
*   **Reliability**: Global error handling and logging.

## Prerequisites

*   Node.js 20.9.0 or higher
*   pnpm
*   Docker & Docker Compose

## Quick Start

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Start database:**
    ```bash
    docker-compose up -d db
    ```

3.  **Run backend:**
    ```bash
    pnpm dev:be
    ```

4.  **Access Swagger UI:**
    Open [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## API Endpoints

### Quotes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/quotes` | Get all quotes |
| `POST` | `/api/v1/quotes` | Create a new quote |
| `GET` | `/api/v1/quotes/:id` | Get a specific quote by ID |
| `PATCH` | `/api/v1/quotes/:id` | Update a quote |
| `DELETE` | `/api/v1/quotes/:id` | Delete a quote |
| `GET` | `/api/v1/quotes/tags/all` | Get all unique tags |
| `GET` | `/api/v1/quotes/authors/all` | Get all unique authors |

### Error Codes

*   **400 Bad Request**: Validation failure or invalid input.
*   **404 Not Found**: Resource does not exist.
*   **500 Internal Server Error**: Unexpected server error.

## Database Schema

**Table: `quote`**

*   `id` (UUID, PK)
*   `text` (text)
*   `author` (varchar 200)
*   `likes` (int, default 0)
*   `tags` (varchar 500, nullable)
*   `createdAt` (timestamp)
*   `updatedAt` (timestamp)

## Logging

The application uses **Winston** for structured JSON logging. Logs are automatically rotated and stored in the `logs/` directory by default.

### Configuration
The following environment variables control logging behavior:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `LOG_LEVEL` | `info` | Log verbosity (debug, info, warn, error) |
| `LOG_FILE_PATH` | `logs/app.log` | Path pattern for log files |
| `LOG_MAX_SIZE` | `10m` | Max size of a single log file before rotation |
| `LOG_MAX_FILES` | `5d` | Number of files or days to keep |

### Log Format
Logs are output in JSON format for easy parsing:
```json
{
  "timestamp": "2025-12-03T10:15:30.123Z",
  "level": "info",
  "message": "Application started",
  "context": "NestFactory"
}
```

## Testing

Run unit tests:
```bash
pnpm test:be
```

## Postman Collection

A complete Postman collection is available at `docs/postman-collection/quotes-api-collection.json`.
Import this into Postman to test all endpoints with automated verification scripts.
