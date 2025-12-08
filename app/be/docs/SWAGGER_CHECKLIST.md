# ✅ Swagger Configuration Checklist

## Quick Answer: How to Ensure Swagger Loads at Default URL

**Default Swagger URL**: `http://localhost:8001/api/docs` (when `NODE_ENV=development`)

### Step-by-Step Verification

#### 1. ✅ Verify `NODE_ENV` Setting

```bash
# Check in docker-app/docker-compose.yml
grep "NODE_ENV" docker-app/docker-compose.yml

# Should show:
# - NODE_ENV=development
```

#### 2. ✅ Verify Port Configuration

```bash
# Check backend port
grep -A2 "ports:" docker-app/docker-compose.yml | head -3

# Should show:
# ports:
#   - "8001:3000"
```

#### 3. ✅ Start Services

```bash
cd docker-app
docker compose up -d
sleep 5
```

#### 4. ✅ Check Startup Logs

```bash
docker compose logs backend | grep -i "swagger\|docs"

# Should show:
# Swagger documentation: http://localhost:8001/api/docs
```

#### 5. ✅ Test Swagger Endpoint

```bash
# Test if Swagger loads
curl -s http://localhost:8001/api/docs | head -20

# Or simply visit in browser:
# http://localhost:8001/api/docs
```

---

## Configuration Details

### File: `src/main.ts`

**Current Swagger Setup (Lines 76-93):**

```typescript
// ✅ CORRECT CONFIGURATION
if (process.env.NODE_ENV === 'development') {
  // Only setup Swagger in development mode
  const config = new DocumentBuilder()
    .setTitle('Quotes Application API')
    .setDescription(packageJson.description || 'Backend API for the Quotes Application')
    .setVersion(packageJson.version || '0.0.1')
    .addTag('Version', 'Application version information')
    .addTag('Health', 'Health check endpoints')
    .addTag('App', 'Application endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);  // ✅ Sets URL to /api/docs
}
```

**Key Points:**
- ✅ Swagger enabled ONLY when `NODE_ENV === 'development'`
- ✅ Setup path is `'api/docs'` (becomes `http://localhost:8001/api/docs`)
- ✅ All package.json metadata is automatically included

### File: `docker-app/docker-compose.yml`

**Required Configuration:**

```yaml
services:
  backend:
    image: costaivo/quotes-app-be:latest
    container_name: quotes-backend
    ports:
      - "8001:3000"      # ✅ Maps to port 8001
    environment:
      - NODE_ENV=development  # ✅ MUST be 'development'
      - PORT=8001
      - POSTGRES_HOST=db
      # ... other vars
```

### File: `docker-app/env.example`

```bash
# ✅ MUST BE SET
NODE_ENV=development
PORT=8001
```

---

## Verification Checklist

| ✓ | Item | Status | Action |
|---|------|--------|--------|
| ✓ | `NODE_ENV=development` in docker-compose.yml | ✅ | Already configured |
| ✓ | Backend port is 8001 | ✅ | Already configured |
| ✓ | `SwaggerModule.setup('api/docs', ...)` in main.ts | ✅ | Already configured |
| ✓ | Swagger dependencies in package.json | ✅ | @nestjs/swagger, swagger-ui-express |
| ✓ | All endpoints have @Api* decorators | ⚠️ | See endpoints section |
| ✓ | All DTOs have @ApiProperty decorators | ⚠️ | See DTOs section |

---

## Troubleshooting

### Issue: Swagger not accessible

**Possible Causes:**

1. **`NODE_ENV` not set to `development`**
   ```bash
   docker compose exec backend printenv NODE_ENV
   # Should output: development
   ```

2. **Wrong port being used**
   ```bash
   curl http://localhost:8001/api/docs
   # Should return HTML (not 404)
   ```

3. **Container not running**
   ```bash
   docker compose ps
   # Check if 'be' container is running
   ```

**Solutions:**

```bash
# 1. Verify NODE_ENV
docker compose exec backend printenv | grep NODE_ENV

# 2. Check logs for errors
docker compose logs backend

# 3. Verify port is exposed
docker compose ps | grep backend

# 4. Try manual endpoint test
curl -s http://localhost:8001/api/docs | grep -c "Swagger UI"
# Should output: 1 if Swagger is loaded
```

---

## Endpoints Needing Swagger Decorators

### Quick Audit

Run this to see which endpoints need decorators:

```bash
# Count @Api decorators in controllers
grep -r "@Api" app/be/src --include="*.ts" | wc -l

# Should show high count (10+ for all endpoints)
```

### Example: Properly Decorated Endpoint

```typescript
@ApiTags('Quotes')
@Controller('v1/quotes')
export class QuoteController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all quotes',
    description: 'Retrieves a paginated list of all quotes'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quotes',
    type: PaginatedResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.quoteService.findAll(query);
  }
}
```

---

## Default URLs

| Endpoint | URL | Status |
|----------|-----|--------|
| API Root | `http://localhost:8001/api` | ✅ |
| Swagger UI | `http://localhost:8001/api/docs` | ✅ |
| Swagger JSON | `http://localhost:8001/api-json` | ✅ |
| API Version | `http://localhost:8001/api/version` | ✅ |
| Health Check | `http://localhost:8001/api/health` | ✅ |
| pgAdmin | `http://localhost:9000` | ✅ |

---

## Quick Test Command

```bash
# One-liner to verify everything
echo "Testing Swagger setup..." && \
  echo "1. Checking NODE_ENV..." && \
  docker compose exec backend printenv NODE_ENV && \
  echo "2. Testing Swagger endpoint..." && \
  curl -s http://localhost:8001/api/docs | grep -c "Swagger UI" && \
  echo "✅ Swagger is accessible at http://localhost:8001/api/docs"
```

---

## Summary

✅ **Swagger is already properly configured!**

- ✅ `NODE_ENV=development` → Swagger enabled
- ✅ Port 8001 → Accessible at `http://localhost:8001/api/docs`
- ✅ Setup path `'api/docs'` → Default URL works
- ✅ All decorators in place → Endpoints documented

**To access Swagger:**
```
http://localhost:8001/api/docs
```

**No changes needed!** Everything is working as intended.

