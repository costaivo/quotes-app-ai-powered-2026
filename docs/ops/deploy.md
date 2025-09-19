# Deployment Guide - API Validation Implementation

This document provides deployment guidance for the API validation implementation (RFD-003) including migration steps, rollback procedures, and monitoring recommendations.

## Overview

The API validation implementation introduces:
- DTO-based validation using `class-validator`
- Global response envelope (`{ data, success, message }`)
- Global exception handling with consistent error format
- Comprehensive testing infrastructure (116 tests)
- Complete REST API endpoints for quotes management

## Pre-Deployment Checklist

### 1. Dependencies Verification

Ensure all required dependencies are installed:

```bash
# Core dependencies
pnpm add class-validator class-transformer @nestjs/mapped-types

# Testing dependencies  
pnpm add -D @nestjs/testing supertest sqlite3

# Development dependencies
pnpm add -D @faker-js/faker commander
```

### 2. Package Configuration

Verify `package.json` includes ES module support:

```json
{
  "type": "module"
}
```

### 3. Test Suite Validation

Run the complete test suite to ensure all functionality works:

```bash
# Run all tests
pnpm test

# Run only unit tests (excluding e2e)
pnpm test -- --testPathIgnorePatterns="test/e2e"

# Run e2e tests separately (requires database setup)
pnpm test:e2e
```

Expected results:
- **116 total tests passing**
- All DTO validation tests passing
- Response interceptor tests passing
- Controller integration tests passing

## Deployment Steps

### 1. Database Considerations

**No database schema changes required** - this implementation is backward compatible.

The existing `Quote` entity remains unchanged:
- No new columns added
- No existing columns modified
- No migration scripts needed

### 2. Application Deployment

#### Option A: Blue-Green Deployment (Recommended)

1. **Deploy to staging environment first:**
   ```bash
   # Build application
   pnpm build
   
   # Deploy to staging
   # (Your deployment process here)
   ```

2. **Run smoke tests on staging:**
   ```bash
   # Test API endpoints
   curl -X GET http://staging-api/quotes
   curl -X POST http://staging-api/quotes \
     -H "Content-Type: application/json" \
     -d '{"quote":"Test quote","author":"Test Author"}'
   ```

3. **Verify response envelope format:**
   ```json
   // Expected success response
   {
     "data": [...],
     "success": true,
     "message": "Operation completed successfully"
   }
   
   // Expected error response
   {
     "data": null,
     "success": false,
     "message": "Validation failed",
     "statusCode": 400,
     "timestamp": "2025-01-27T10:00:00.000Z",
     "path": "/quotes"
   }
   ```

4. **Deploy to production:**
   ```bash
   # Deploy to production
   # (Your deployment process here)
   ```

#### Option B: Rolling Deployment

1. **Deploy to subset of instances**
2. **Monitor error rates and response times**
3. **Gradually increase traffic to new instances**
4. **Complete rollout to all instances**

### 3. Configuration Updates

No additional configuration changes required beyond the standard NestJS application setup.

## Post-Deployment Verification

### 1. Health Checks

Verify all endpoints are responding correctly:

```bash
# Test all CRUD operations
curl -X GET http://api/quotes
curl -X GET http://api/quotes/tags  
curl -X GET http://api/quotes/authors
curl -X GET http://api/quotes/1
curl -X POST http://api/quotes -H "Content-Type: application/json" -d '{"quote":"Test","author":"Author"}'
curl -X PATCH http://api/quotes/1 -H "Content-Type: application/json" -d '{"quote":"Updated"}'
curl -X DELETE http://api/quotes/1
```

### 2. Validation Testing

Test validation rules are working:

```bash
# Test validation errors
curl -X POST http://api/quotes \
  -H "Content-Type: application/json" \
  -d '{"quote":"","author":"Author"}'  # Should return 400

curl -X POST http://api/quotes \
  -H "Content-Type: application/json" \
  -d '{"quote":"'$(printf 'a%.0s' {1..1001})'","author":"Author"}'  # Should return 400
```

### 3. Response Envelope Verification

Ensure all responses follow the new envelope format:

```bash
# Check response structure
curl -X GET http://api/quotes | jq 'keys'
# Should return: ["data", "success", "message"]
```

## Monitoring & Alerting

### 1. Key Metrics to Monitor

**Response Times:**
- Average response time per endpoint
- 95th percentile response time
- Response time trends

**Error Rates:**
- 4xx error rate (validation errors)
- 5xx error rate (server errors)
- Error rate by endpoint

**Validation Errors:**
- Most common validation failures
- Field-specific validation error patterns
- Request payload size distribution

### 2. Recommended Alerts

```yaml
# Example alerting rules
alerts:
  - name: "High Validation Error Rate"
    condition: "rate(http_requests_total{status=~'4..'}[5m]) > 0.1"
    severity: "warning"
    
  - name: "API Response Time High"
    condition: "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2"
    severity: "critical"
    
  - name: "Server Error Rate High"
    condition: "rate(http_requests_total{status=~'5..'}[5m]) > 0.05"
    severity: "critical"
```

### 3. Log Analysis

Monitor logs for:
- Validation error patterns
- Unusual request payloads
- Response envelope inconsistencies
- Performance degradation

## Rollback Procedures

### 1. Immediate Rollback (Critical Issues)

If critical issues are detected immediately after deployment:

```bash
# Revert to previous version
git revert <deployment-commit-hash>

# Redeploy previous version
# (Your deployment process here)

# Verify rollback
curl -X GET http://api/quotes
```

### 2. Gradual Rollback (Performance Issues)

If performance issues are detected:

1. **Reduce traffic to new version**
2. **Route traffic back to previous version**
3. **Monitor system recovery**
4. **Investigate and fix issues**
5. **Plan re-deployment**

### 3. Database Rollback

**No database rollback needed** - no schema changes were made.

### 4. Configuration Rollback

If needed, remove global interceptors/filters:

```typescript
// In app.module.ts, comment out or remove:
{
  provide: APP_INTERCEPTOR,
  useClass: ResponseInterceptor,
},
{
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
},
```

## Troubleshooting

### Common Issues

**1. Validation Not Working**
- Check that `ValidationPipe` is applied to controller methods
- Verify DTO decorators are properly imported
- Ensure request body is JSON format

**2. Response Envelope Not Applied**
- Verify global interceptor is registered in `app.module.ts`
- Check that interceptor is not being overridden by other interceptors
- Ensure controller methods return data (not already wrapped)

**3. Tests Failing**
- Run `pnpm install` to ensure all dependencies are installed
- Check Jest configuration in `jest.config.js`
- Verify test database setup for e2e tests

**4. Performance Issues**
- Monitor response times during deployment
- Check for memory leaks in validation logic
- Verify database query performance

### Debug Commands

```bash
# Check application logs
tail -f /var/log/app.log

# Test specific endpoint
curl -v -X POST http://api/quotes \
  -H "Content-Type: application/json" \
  -d '{"quote":"Test","author":"Author"}'

# Run tests in verbose mode
pnpm test -- --verbose

# Check dependency versions
pnpm list class-validator class-transformer
```

## Success Criteria

Deployment is considered successful when:

- ✅ All 116 tests pass
- ✅ All API endpoints respond with correct status codes
- ✅ Response envelope format is consistent across all endpoints
- ✅ Validation rules are enforced (400 errors for invalid input)
- ✅ No increase in 5xx error rates
- ✅ Response times remain within acceptable limits
- ✅ No database connectivity issues

## Support Contacts

- **Backend Team**: backend-team@company.com
- **DevOps Team**: devops@company.com
- **On-Call Engineer**: +1-XXX-XXX-XXXX

## Related Documentation

- [RFD-003: API Validation Implementation](../product/rfd/rfd-003-api-validation.md)
- [API Testing Guide](../postman/quotes.postman_collection.json)
- [Sample Data Generation](../scripts/README.md)
- [Test Documentation](../product/tasks/tasks-rfd-003-api-validation.md)
