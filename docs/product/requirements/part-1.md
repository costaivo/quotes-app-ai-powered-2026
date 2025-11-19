# 🎯 Quotes Application (Part 1) -  Quotes Management


## 🏗️ Problem Definition

Create REST APIs to allow the generation, retrieval, and management of quotes. This application will provide a comprehensive quote management system with the following capabilities:

- **Quote Management**: Create, read, update, and delete quotes
- **Tag System**: Organize quotes using a flexible tagging system
- **Like System**: Track user engagement with quotes
- **Data Retrieval**: Efficient data access patterns for various use cases

The system is designed to be stateless and RESTful, following standard HTTP conventions and JSON data formats.


## 📋 Entity Definitions

### 💬 Quotes Entity

| Field | Description |
|-------|-------------|
| `____` | Unique identifier for the quote |
| `____` | The quote text content |
| `____` | Author of the quote |
| `____` | Number of likes received |
| `____` | Semicolon-separated string for various tags |



**Note:** Tags are stored as a semicolon-separated string for various tags. For example: "programming;software;best-practices"

**Developer Note:** You need to decide on the missing placeholders marked with `____` in the Entity Fields and API Endpoints sections. These include field names, endpoint paths, and status codes that align with REST API best practices.


## 🔗 API Endpoints

| Sr. No. | Method | API Endpoint | Description | Status Codes |
|---------|--------|--------------|-------------|--------------|
| 1 | GET | `____` | Fetch all quotes | ____ |
| 2 | POST | `____` | Add new quote | ____ |
| 3 | PATCH | `____` | Update quote | ____ |
| 4 | DELETE | `____` | Delete quote | ____ |
| 5 | GET | `____` | Fetch quote by Id | ____ |
| 6 | GET | `____` | Fetch tags from quotes | ____ |
| 7 | GET | `____` | Fetch authors from quotes | ____ |


**API Design Note:** For the API Endpoints section, design RESTful endpoint paths that follow standard conventions. For Status Codes, use appropriate HTTP status codes (e.g., 200 for success, 201 for created, 400 for bad request, 404 for not found, 500 for server error).

## ❤️ Like System Implementation

The like system in Part 1 is implemented as a simple counter system without user authentication:

- **Like Counter Management**: Use the update endpoint to modify the like count field
- **Validation**: Ensure the like count never goes below 0


