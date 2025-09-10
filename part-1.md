# Quotes Application (Part 1) - Quotes Management

## Problem Definition

Create REST APIs to allow the generation, retrieval, and management of quotes. This application will provide a comprehensive quote management system with the following capabilities:

- **Quote Management**: Create, read, update, and delete quotes
- **Tag System**: Organize quotes using a flexible tagging system
- **Like System**: Track user engagement with quotes
- **Data Retrieval**: Efficient data access patterns for various use cases

The system is designed to be stateless and RESTful, following standard HTTP conventions and JSON data formats.

## Core Requirements

### Entity Structure
The system should manage quotes with the following structure:
- **id**: Unique identifier (UUID, auto-generated)
- **quote**: Quote text content (required, max 1000 characters)
- **author**: Author of the quote (required, max 100 characters)
- **like_count**: Number of likes received (default: 0, non-negative)
- **tags**: Semicolon-separated string for various tags (optional, max 500 characters)

### API Endpoints
Implement the following 7 REST API endpoints:

1. **GET `/quotes`** - Fetch all quotes
2. **POST `/quotes`** - Add new quote
3. **PATCH `/quotes/{id}`** - Update quote (partial updates)
4. **DELETE `/quotes/{id}`** - Delete quote
5. **GET `/quotes/{id}`** - Fetch quote by ID
6. **GET `/quotes/tags`** - Fetch all unique tags from quotes
7. **GET `/quotes/authors`** - Fetch all unique authors from quotes

### Key Features

#### Quote Management
- Full CRUD operations for quotes
- Proper validation and error handling
- UUID-based identification

#### Tag System
- Store tags as semicolon-separated strings
- Extract and return unique tags from all quotes
- Process tags: extract, split, normalize, deduplicate, sort

#### Author System
- Extract and return unique authors from all quotes
- Process authors: extract, normalize, deduplicate, sort alphabetically

#### Like System
- Simple counter-based like system (no user authentication)
- Track like count per quote
- Ensure like count never goes below 0

#### Response Format
- Consistent JSON response structure with `data`, `success`, `message` fields
- Proper HTTP status codes (200, 201, 400, 404, 500)
- Standard error handling with descriptive messages

### Technical Requirements
- RESTful API design
- JSON data format
- Proper HTTP methods and status codes
- Input validation and error handling
- Database persistence
- Stateless architecture
