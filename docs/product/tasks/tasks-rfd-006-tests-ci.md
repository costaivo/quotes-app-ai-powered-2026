# Tasks for RFD-006: Integration tests and CI pipeline

**RFD Reference**: [rfd-006-tests-ci.md](../rfd/rfd-006-tests-ci.md)  
**Generated**: 2025-01-27  
**Status**: Ready for implementation

## Relevant Files

- `.github/workflows/ci.yml` - Current placeholder CI workflow that needs to be expanded with actual test steps
- `app/be/package.json` - Backend package.json with existing test scripts and dependencies
- `app/be/jest.config.js` - Jest configuration for unit tests
- `app/be/test/e2e/quotes.e2e-spec.ts` - Existing e2e test file using SQLite in-memory database
- `docker-compose.yml` - Docker Compose setup with PostgreSQL service for local development
- `app/be/src/config/database.config.ts` - Database configuration that may need CI-specific overrides
- `app/be/Dockerfile` - Backend Dockerfile for containerized testing
- `app/fe/package.json` - Frontend package.json (for future frontend testing integration)
- `app/be/test/e2e/quotes-postgres.e2e-spec.ts` - New integration test file for PostgreSQL testing
- `app/be/src/config/database.ci.config.ts` - CI-specific database configuration
- `app/be/scripts/setup-test-db.sh` - Script to set up test database schema and seed data

### Notes

- The project already has comprehensive unit tests (116 tests) and e2e tests using SQLite in-memory database
- Current CI workflow is a placeholder that needs to be implemented
- Docker Compose setup already includes PostgreSQL service
- Backend uses NestJS with TypeORM and has existing test infrastructure
- Integration tests will use PostgreSQL service container in GitHub Actions
- Use `pnpm test` to run unit tests, `pnpm test:e2e` for e2e tests, and `pnpm test:integration` for PostgreSQL integration tests

## Tasks

- [ ] 1.0 Set up GitHub Actions CI pipeline with PostgreSQL service
  - [ ] 1.1 Update `.github/workflows/ci.yml` to replace placeholder content with actual CI steps
  - [ ] 1.2 Add PostgreSQL service container configuration to CI workflow
  - [ ] 1.3 Configure Node.js setup with proper version (18) and pnpm package manager
  - [ ] 1.4 Add dependency caching for faster CI runs using pnpm cache
  - [ ] 1.5 Set up environment variables for CI database connection
  - [ ] 1.6 Configure CI to run on push to main/master and pull requests

- [ ] 2.0 Configure integration test infrastructure with Dockerized PostgreSQL
  - [ ] 2.1 Create `app/be/src/config/database.ci.config.ts` for CI-specific database configuration
  - [ ] 2.2 Create `app/be/test/e2e/quotes-postgres.e2e-spec.ts` for PostgreSQL integration tests
  - [ ] 2.3 Add test database setup and teardown utilities for integration tests
  - [ ] 2.4 Create `app/be/scripts/setup-test-db.sh` script for database schema initialization
  - [ ] 2.5 Add integration test script to `app/be/package.json` (`test:integration`)
  - [ ] 2.6 Configure Jest to handle both SQLite (existing) and PostgreSQL test environments

- [ ] 3.0 Implement CI workflow steps for backend testing and validation
  - [ ] 3.1 Add linting step using existing ESLint configuration
  - [ ] 3.2 Add unit test execution step with coverage reporting
  - [ ] 3.3 Add integration test execution step against PostgreSQL service
  - [ ] 3.4 Add build verification step to ensure application compiles successfully
  - [ ] 3.5 Configure test result reporting and failure notifications
  - [ ] 3.6 Add timeout configuration to prevent hanging CI jobs

- [ ] 4.0 Add test coverage reporting and gating rules
  - [ ] 4.1 Configure Jest coverage thresholds in `app/be/jest.config.js`
  - [ ] 4.2 Add coverage reporting to CI workflow using GitHub Actions
  - [ ] 4.3 Set minimum coverage requirements (e.g., 80% overall, 70% per file)
  - [ ] 4.4 Configure coverage badge generation for README
  - [ ] 4.5 Add coverage report upload to CI artifacts for review
  - [ ] 4.6 Document coverage requirements in project documentation

- [ ] 5.0 Configure branch protection rules and PR requirements
  - [ ] 5.1 Set up branch protection rules for main/master branch
  - [ ] 5.2 Require CI checks to pass before merging PRs
  - [ ] 5.3 Require up-to-date branches before merging
  - [ ] 5.4 Configure required status checks for CI workflow
  - [ ] 5.5 Add PR template with testing checklist
  - [ ] 5.6 Document CI requirements and expectations in README
