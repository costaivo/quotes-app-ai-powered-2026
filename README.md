# Quotes Application

[![Coverage](https://codecov.io/gh/your-username/quotes-app-ai-powered-2025/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/quotes-app-ai-powered-2025)
[![CI](https://github.com/your-username/quotes-app-ai-powered-2025/workflows/CI/badge.svg)](https://github.com/your-username/quotes-app-ai-powered-2025/actions)

This is a monorepo for the quotes application.

Important: This repository requires `pnpm` as the package manager. Please install and use `pnpm` for all dependency and script commands. Example setup using Corepack:

```sh
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

Use `pnpm install` to install dependencies and `pnpm run <script>` to run scripts.

## Packages

-   [app/be](./app/be): Backend application
-   [app/fe](./app/fe): Frontend application

## Design and Documentation

-   [Tech stack](./docs/tech-stack.md): High-level tech stack summary for the repo
-   [RFD-001](./docs/product/rfd/rfd-001-monorepo-base-project.md): Monorepo base project

## Running with Docker Compose

This repository provides Docker Compose configuration for local development. Use the helper scripts or `docker compose` directly.

- **Start (rebuilds images, detached)** — recommended for first run or after Dockerfile/dependency changes:

```sh
./start.sh    # runs: docker compose up -d --build and prints BE/FE/Adminer URLs
```

- **Make the helper script executable** (only required once):

```sh
chmod +x ./start.sh
```

- **Run without making executable** (alternatively):

```sh
sh ./start.sh
# or
bash ./start.sh
```

- **Start without rebuilding (fast dev start)**:

```sh
docker compose up -d
docker compose up -d be    # start only backend
docker compose up -d fe    # start only frontend
```

- **Start only the database and Adminer** (useful for DB-only tasks):

```sh
docker compose up -d db adminer
```

- **Stop / tear down**:

```sh
docker compose stop        # stops containers (preserves them)
docker compose down        # stops and removes containers, network
```

- **Rebuild a single service and bring it up**:

```sh
docker compose build be
docker compose up -d be
# or one-step:
docker compose up -d --no-deps --build be
```

- **View logs**:

```sh
docker compose logs -f be
docker compose logs -f fe
```

Notes:
- The compose file mounts local source into the containers (`./app/be:/usr/src/app`, `./app/fe:/app`), so changes to the code are picked up by the dev servers (Vite for FE, `npm run start:dev` for BE) without rebuilding the image.
- Rebuild only when you change a Dockerfile, dependency install step, or when producing production images.

## CI/CD Pipeline

This repository uses GitHub Actions for continuous integration and deployment.

### CI Requirements

Before merging any pull request, the following checks must pass:

#### Backend Tests
- **Unit Tests**: `pnpm test:unit` - Tests individual components and functions
- **Integration Tests**: `pnpm test:integration` - Tests against PostgreSQL database
- **E2E Tests**: `pnpm test:e2e` - End-to-end API tests with SQLite
- **Coverage**: Minimum 80% line coverage, 50% branch coverage
- **Build**: Application must compile successfully

#### Frontend Tests
- **Build**: Application must build without errors
- **Linting**: Code must pass linting checks
- **TypeScript**: No TypeScript compilation errors

### Branch Protection Rules

The `main` branch is protected with the following rules:

- ✅ **Pull Request Required**: All changes must go through a pull request
- ✅ **Status Checks**: All CI checks must pass before merging
- ✅ **Reviews Required**: At least one approval required
- ✅ **Up-to-date Branches**: Branch must be up to date with main
- ✅ **Linear History**: No merge commits allowed
- ✅ **Signed Commits**: All commits must be signed

### Coverage Requirements

- **Global Coverage**: 80% lines, functions, statements; 50% branches
- **Per-file Coverage**: 70% lines, functions, statements; 45% branches
- **Coverage Reports**: Available in PR comments and Codecov dashboard

### Running Tests Locally

```bash
# Backend tests
cd app/be
pnpm test:unit          # Unit tests only
pnpm test:integration   # Integration tests with PostgreSQL
pnpm test:e2e          # E2E tests with SQLite
pnpm test:coverage     # All tests with coverage report
pnpm test:all          # All tests in sequence

# Frontend tests
cd app/fe
pnpm build             # Build verification
pnpm lint              # Linting (if configured)
```

### CI Environment

The CI pipeline runs on:
- **Node.js**: 18.x
- **Package Manager**: pnpm 8.7.0
- **Database**: PostgreSQL 15 (for integration tests)
- **OS**: Ubuntu Latest

### Troubleshooting CI Failures

1. **Test Failures**: Run tests locally to reproduce and fix issues
2. **Coverage Issues**: Add tests to increase coverage or adjust thresholds
3. **Build Failures**: Check for TypeScript errors and dependency issues
4. **Timeout Issues**: Optimize slow tests or increase timeout limits

For detailed setup instructions, see [Branch Protection Setup](./docs/setup/branch-protection-setup.md).