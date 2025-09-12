# Tasks for RFD-002: Database Schema and Persistence

Based on RFD-002-database-schema.md, this task list implements TypeORM setup, Quote entity, migrations, and database configuration for the Quotes Application.

## Relevant Files

- `app/be/package.json` - Add TypeORM dependencies and migration scripts
- `app/be/src/entities/quote.entity.ts` - Quote entity with UUID, quote, author, like_count, tags fields
- `app/be/src/data-source.ts` - TypeORM DataSource configuration for migrations
- `app/be/src/migrations/CreateQuotesTable1680000000000.ts` - Initial migration to create quotes table
- `app/be/src/app.module.ts` - Configure TypeORM module integration
- `app/be/src/repositories/quote.repository.ts` - Repository service for Quote operations
- `app/be/src/services/quote.service.ts` - Business logic service for quotes
- `app/be/.env` - Environment variables for database connection
- `app/be/src/entities/quote.entity.spec.ts` - Unit tests for Quote entity
- `app/be/src/repositories/quote.repository.spec.ts` - Unit tests for Quote repository
- `app/be/src/services/quote.service.spec.ts` - Unit tests for Quote service

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Install and Configure TypeORM Dependencies
  - [x] 1.1 Install TypeORM, PostgreSQL driver, and NestJS TypeORM integration packages
  - [x] 1.2 Add TypeORM migration scripts to package.json (generate, run, revert)
  - [x] 1.3 Install additional dev dependencies (ts-node for migration CLI)
- [x] 2.0 Create Quote Entity and Database Schema
  - [x] 2.1 Create Quote entity with UUID primary key, quote (text), author (varchar 200), like_count (integer default 0), tags (varchar 500)
  - [x] 2.2 Add database constraints (like_count >= 0) and timestamps (created_at, updated_at)
  - [x] 2.3 Create unit tests for Quote entity validation and constraints
- [x] 3.0 Set Up TypeORM Configuration and Data Source
  - [x] 3.1 Create data-source.ts for TypeORM CLI migrations with environment variable configuration
  - [x] 3.2 Configure TypeORM module in app.module.ts with forRoot() using environment variables
  - [x] 3.3 Set up proper TypeORM configuration for both development and production environments
- [x] 4.0 Implement Database Migrations
  - [x] 4.1 Create initial migration file CreateQuotesTable1680000000000.ts with quotes table schema
  - [x] 4.2 Add CHECK constraint for like_count non-negative values
  - [x] 4.3 Test migration up and down operations
  - [x] 4.4 Create unit tests for migration functionality
- [x] 5.0 Create Repository and Service Layer
  - [x] 5.1 Create QuoteRepository service extending TypeORM Repository<Quote>
  - [x] 5.2 Create QuoteService with basic CRUD operations using the repository
  - [x] 5.3 Add proper error handling and validation in service layer
  - [x] 5.4 Create unit tests for repository and service layers
- [x] 6.0 Configure Environment Variables and Docker Integration
  - [x] 6.1 Create .env file with database connection variables (DATABASE_URL, POSTGRES_*)
  - [x] 6.2 Update docker-compose.yml to ensure proper database connection for backend service
  - [x] 6.3 Test database connection and migration execution in Docker environment
  - [x] 6.4 Verify Adminer can connect to database and view quotes table

## Approval

- **Next Sub-task**: Awaiting approval