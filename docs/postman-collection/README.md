# Quotes App API — Postman Collection

**Version**: 1.0  
**Last Updated**: 2025-11-19  
**Status**: Ready for Import

---

## Overview

This Postman collection provides **comprehensive API testing** for the Quotes App REST API. It includes:

- ✅ All 7 API endpoints (CRUD + tags/authors)
- ✅ Pre-built tests for each endpoint
- ✅ Automatic fake data generation
- ✅ Error scenario validation
- ✅ Collection-level variables for easy configuration

**Total Test Coverage**: 20+ automated tests across all endpoints

---

## Quick Start

### 1. Import Collection into Postman

**Option A: Desktop App**
1. Open Postman desktop application
2. Click **Import** button (top-left)
3. Select **File** tab
4. Choose `quotes-api-collection.json`
5. Click **Import**

**Option B: Web Version**
1. Go to [Postman Web](https://web.postman.co)
2. Click **Import** button
3. Upload `quotes-api-collection.json`
4. Collection appears in left sidebar

### 2. Configure Base URL

**Default Base URL**: `http://localhost:3000/api/v1`

If your backend runs on a different URL:
1. In Postman, locate **Quotes App API** collection in left sidebar
2. Click the three-dot menu → **Edit**
3. Go to **Variables** tab
4. Update `baseUrl` variable value
5. Click **Save**

### 3. Start Backend Server

```bash
cd /home/ivo/work/quotes-app-ai-powered-2026
docker-compose up
```

Wait for backend to start (should see "Server running on port 3000")

### 4. Run Collection Tests

**Option A: Run All Endpoints**
1. Right-click **Quotes App API** collection
2. Select **Run collection**
3. Click **Run Quotes App API** button
4. All tests execute in sequence

**Option B: Run Individual Request**
1. Click desired request in collection
2. Click **Send** button
3. View response and test results below

---

## Collection Structure

### 📋 CRUD Operations
Core quote management endpoints:

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `/quotes` | GET | Fetch all quotes |
| 2 | `/quotes` | POST | Create new quote (auto fake data) |
| 3 | `/quotes/{id}` | GET | Fetch specific quote |
| 4 | `/quotes/{id}` | PATCH | Update quote |
| 5 | `/quotes/{id}` | DELETE | Delete quote |

**Execution Order**: Run in sequence (1→2→3→4→5)
- Request #2 creates a quote and saves its ID
- Requests #3–5 use the saved ID from previous request

### 🏷️ Tag Operations
Retrieve unique tags:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/quotes/tags/all` | GET | Get all unique tags (deduped) |

**Tests Validate**:
- Response is array
- All tags are unique (no duplicates)
- All values are strings

### 👤 Author Operations
Retrieve unique authors:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/quotes/authors/all` | GET | Get all unique authors (deduped) |

**Tests Validate**:
- Response is array
- All authors are unique (no duplicates)
- All values are strings

### ⚠️ Error Scenarios
Test error handling:

| Scenario | Expected | Test |
|----------|----------|------|
| Get non-existent quote | 404 | Verify error response format |
| Create quote (missing author) | 400 | Validate required field check |
| Create quote (text too long) | 400 | Validate length constraint |
| Delete non-existent quote | 404 | Verify error response format |

---

## Features

### 🤖 Automatic Fake Data Generation

**Pre-request Script** in "Create Quote" generates random data on each run:

```javascript
// Generates random from predefined lists:
- Quote text (5 famous quotes)
- Author (5 famous authors)
- Tags (5 tag combinations)
```

**Result**: Different data on each test run—no manual data entry needed!

### ✅ Automated Tests

**Each endpoint includes tests for:**
- ✓ Correct HTTP status code (200, 201, 204, 400, 404, etc.)
- ✓ Response schema correctness
- ✓ Required fields present
- ✓ Data types match expectations
- ✓ Error messages properly formatted
- ✓ Database state after operation

**Example Test** (Get All Quotes):
```javascript
// Verify 200 OK
pm.test('Status code is 200', ...)

// Verify response is array
pm.test('Response is array', ...)

// Verify each quote has required fields
pm.test('Each quote has required fields', ...)
```

### 🔄 Linked Variables

Collection uses Postman variables for data flow:

| Variable | Source | Used By |
|----------|--------|---------|
| `baseUrl` | Collection default | All requests |
| `quoteId` | Create Quote response | Get, Update, Delete |
| `randomQuote` | Pre-request faker | Create Quote body |
| `randomAuthor` | Pre-request faker | Create Quote body |
| `randomTags` | Pre-request faker | Create Quote body |
| `updatedQuote` | Pre-request faker | Update Quote body |

---

## Typical Test Workflow

### ✨ Happy Path (Full CRUD)

Run collection in order:

```
1. GET /quotes
   ├─ Fetch all existing quotes
   
2. POST /quotes (auto-generates data)
   ├─ Create new quote
   ├─ Save quote ID to {{quoteId}}
   
3. GET /quotes/{{quoteId}}
   ├─ Verify created quote exists
   ├─ Verify all fields match
   
4. PATCH /quotes/{{quoteId}} (auto-generates new text)
   ├─ Update quote text
   ├─ Verify updatedAt changed
   
5. DELETE /quotes/{{quoteId}}
   ├─ Delete the quote
   ├─ Verify 204 No Content response
```

### 🔴 Error Testing

Run error scenario requests:

```
- Get Quote with Invalid ID
  → Expect 404 + error response format
  
- Create Quote Missing Field
  → Expect 400 + validation error
  
- Create Quote Text Too Long
  → Expect 400 + length validation error
  
- Delete Quote with Invalid ID
  → Expect 404 + error response format
```

---

## Response Examples

### ✅ Successful Quote Creation

**Request**:
```json
{
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "tags": "motivation;inspiration"
}
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "likes": 0,
  "tags": "motivation;inspiration",
  "createdAt": "2025-11-19T10:30:00Z",
  "updatedAt": "2025-11-19T10:30:00Z"
}
```

### ❌ Error: Missing Required Field

**Request**:
```json
{
  "text": "Quote without author"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Validation failed",
  "statusCode": 400,
  "details": "Field 'author' is required"
}
```

### ❌ Error: Quote Not Found

**Request**:
```
GET /quotes/00000000-0000-0000-0000-000000000000
```

**Response (404 Not Found)**:
```json
{
  "error": "Quote not found",
  "statusCode": 404,
  "details": "No quote with ID: 00000000-0000-0000-0000-000000000000"
}
```

---

## Environment Configuration

### Using Postman Environments (Optional)

To switch between different backends (dev, staging, prod):

1. **Create Environment** (Postman UI):
   - Click **Environments** (left sidebar)
   - Click **Create New** → **Environment**
   - Name: `Development` (or `Staging`, `Production`)

2. **Add Variable**:
   - Variable: `baseUrl`
   - Value: `http://localhost:3000/api/v1` (dev) or other URL
   - Save

3. **Activate Environment**:
   - Click environment name in top-right dropdown
   - Select your environment

Now all requests use that environment's base URL!

---

## Testing Best Practices

### ✅ Do's

- ✓ Run collection in order (CRUD sequence matters)
- ✓ Check **Test Results** tab after running
- ✓ Generate fresh fake data each run
- ✓ Verify error scenarios independently
- ✓ Use environments to switch backends

### ❌ Don'ts

- ✗ Skip "Create Quote" before running "Get by ID"
- ✗ Run requests out of sequence
- ✗ Manually edit pre-request scripts without understanding
- ✗ Change base URL directly in requests (use variables)

---

## Troubleshooting

### ❌ Backend Not Responding

**Problem**: `Connection refused`

**Solution**:
```bash
# Start backend
docker-compose up

# Verify running
docker ps | grep quotes-app-ai-powered
```

### ❌ Tests Failing with 400 Bad Request

**Problem**: Validation errors on all POST requests

**Solution**:
1. Check POST request body format
2. Verify `randomQuote`, `randomAuthor`, `randomTags` are populated
3. Look at response error message for specifics
4. Compare against API spec in PRD

### ❌ Invalid UUID Error

**Problem**: `Invalid UUID format`

**Solution**:
1. Ensure you ran "Create Quote" first
2. Check `{{quoteId}}` variable is set (hover over in request)
3. Reset collection variables and re-run from start

### ❌ Response Doesn't Match Test

**Problem**: Test fails even though response looks correct

**Solution**:
1. Click **Console** (bottom of Postman)
2. Look at test failure details
3. Compare actual response vs expected
4. Update test assertions if needed

---

## Advanced Usage

### 🔧 Customize Fake Data

Edit "Create Quote" pre-request script to add custom quotes:

```javascript
const quotes = [
  'Your custom quote here',
  'Another custom quote',
  // Add more...
];

const authors = [
  'Custom Author',
  // Add more...
];
```

### 🧪 Add New Tests

Edit any request's **Tests** tab:

```javascript
pm.test('Custom validation', function() {
    const jsonData = pm.response.json();
    // Add your test logic
});
```

### 📊 Export Test Results

After running collection:
1. Click **Run Results** tab
2. Top-right: **Export Results**
3. Choose format (JSON, HTML)
4. Save file

---

## Endpoints Reference

### Quote Operations

| Method | Endpoint | Purpose | Expected Status |
|--------|----------|---------|-----------------|
| GET | `/quotes` | List all | 200 |
| POST | `/quotes` | Create | 201 |
| GET | `/quotes/:id` | Get one | 200 |
| PATCH | `/quotes/:id` | Update | 200 |
| DELETE | `/quotes/:id` | Delete | 204 |

### Metadata Operations

| Method | Endpoint | Purpose | Expected Status |
|--------|----------|---------|-----------------|
| GET | `/quotes/tags/all` | All tags | 200 |
| GET | `/quotes/authors/all` | All authors | 200 |

---

## FAQ

**Q: Do I need to create fake data manually?**  
A: No! Pre-request scripts auto-generate random data for each test run.

**Q: Can I test against production?**  
A: Yes, use Postman Environments to switch base URLs between dev/staging/prod.

**Q: What if I need different test data?**  
A: Edit the pre-request script's `quotes`, `authors`, `tags` arrays with your own values.

**Q: How do I automate these tests in CI/CD?**  
A: That's Part 2! Use Newman (Postman CLI) or similar for automated runs.

**Q: Can I modify collection structure?**  
A: Yes! Add folders, requests, tests as needed. Just re-export to update `.json` file.

---

## Next Steps

✅ Import collection into Postman  
✅ Start backend with `docker-compose up`  
✅ Run collection (full suite or individual requests)  
✅ Review test results  
✅ Use Swagger UI for API documentation: `http://localhost:3000/api-docs`  

---

## Support & Feedback

- **API Issues?** Check backend logs in `docker-compose up` output
- **Test Failures?** Review error messages in Postman Console
- **Collection Updates?** Export new version after backend changes
- **Questions?** Reference backend RFD: `docs/product/rfd/rfd-001-quote-management-part1-implementation.md`

---

**Collection Ready!** 🚀  
Import and start testing your Quotes App API today!

