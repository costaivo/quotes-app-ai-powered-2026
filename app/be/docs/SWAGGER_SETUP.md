# Swagger Configuration Guide

This document explains how Swagger documentation is configured and how to ensure it loads correctly.

## Current Setup

### Location
- **File**: `src/main.ts`
- **Lines**: 76-92

### Current Configuration

```typescript
// Swagger configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  const config = new DocumentBuilder()
    .setTitle('Quotes Application API')
    .setDescription(packageJson.description || 'Backend API for the Quotes Application')
    .setVersion(packageJson.version || '0.0.1')
    .addTag('Version', 'Application version information')
    .addTag('Health', 'Health check endpoints')
    .addTag('App', 'Application endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
```

## How to Ensure Swagger Loads

### 1. ✅ Verify `NODE_ENV` is set to `development`

**This is the KEY requirement!**

```bash
# Check current environment
echo $NODE_ENV

# Set it if not set
export NODE_ENV=development
```

### 2. ✅ Verify with Docker Compose

In `docker-app/docker-compose.yml`, ensure:

```yaml
services:
  backend:
    environment:
      - NODE_ENV=development  # ← MUST BE SET
      - PORT=8001
      # ... other variables
```

In `docker-app/env.example`, ensure:

```bash
NODE_ENV=development
```

### 3. ✅ Access URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:8001/api` | API root |
| `http://localhost:8001/api/docs` | Swagger UI (DEFAULT) |
| `http://localhost:8001/api/version` | Version endpoint |
| `http://localhost:8001/api/health` | Health check |

### 4. ✅ Verify Startup Logs

When the app starts, you should see:

```
Swagger documentation: http://localhost:8001/api/docs
```

If you DON'T see this message, `NODE_ENV` is not set to `development`.

## Troubleshooting

### Problem: Swagger not accessible

**Solution**: Check if `NODE_ENV=development`

```bash
# In Docker container
docker compose exec backend printenv NODE_ENV

# Should output: development
```

### Problem: Getting 404 at `/api/docs`

**Cause**: Either:
1. `NODE_ENV` is not `development`
2. Swagger setup failed during initialization

**Solution**:
```bash
# Check logs
docker compose logs backend | grep -i swagger

# Should show setup confirmation
```

### Problem: Empty Swagger page

**Cause**: OpenAPI document generation failed

**Solution**:
1. Check all endpoints have `@Api*` decorators
2. Check DTOs have `@ApiProperty()` decorators
3. Restart the app: `docker compose restart backend`

## Best Practices

### ✅ DO
- ✅ Set `NODE_ENV=development` in all local environments
- ✅ Include Swagger in the startup logs for confirmation
- ✅ Document all endpoints with `@ApiOperation()` decorators
- ✅ Document all DTOs with `@ApiProperty()` decorators
- ✅ Use `@ApiTags()` to organize endpoints

### ❌ DON'T
- ❌ Don't expose Swagger in production (`NODE_ENV=production`)
- ❌ Don't rely on Swagger being enabled without checking logs
- ❌ Don't skip API decorators on new endpoints

## Required Decorators

### On Controllers

```typescript
@ApiTags('Quotes')
@Controller('v1/quotes')
export class QuoteController {
  @Get()
  @ApiOperation({ summary: 'Get all quotes' })
  @ApiResponse({ status: 200, description: 'Return all quotes' })
  async findAll() { ... }
}
```

### On DTOs

```typescript
export class CreateQuoteDto {
  @ApiProperty({ description: 'Quote text', maxLength: 1000 })
  text: string;

  @ApiProperty({ description: 'Author name', maxLength: 200 })
  author: string;

  @ApiProperty({ description: 'Tags', required: false })
  tags?: string;
}
```

## Commands

```bash
# Check if Swagger is running
curl -s http://localhost:8001/api/docs | head -20

# View Swagger JSON spec
curl http://localhost:8001/api-json

# Restart with fresh logs
docker compose restart backend
docker compose logs backend -f | grep -i swagger
```

## Environment Configuration

### Local Development (docker-app/.env)

```bash
NODE_ENV=development
PORT=8001
```

### Production Deployment

```bash
NODE_ENV=production
PORT=8001
```
This will **disable** Swagger for security.

## Summary

**✅ To ensure Swagger loads:**

1. Set `NODE_ENV=development`
2. Keep Swagger code in `main.ts` (already done)
3. Access at `http://localhost:8001/api/docs`
4. Check startup logs for confirmation message

**✅ Default URL: `http://localhost:8001/api/docs`** (when `NODE_ENV=development`)

