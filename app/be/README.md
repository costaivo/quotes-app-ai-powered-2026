<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

**Tech Stack:**
- **Framework**: [NestJS](https://nestjs.com/) with TypeScript
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) with [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- **Linting & Formatting**: [Biome](https://biomejs.dev/) for fast, unified code quality
- **Documentation**: [Compodoc](https://compodoc.app/) for API documentation

**Features:**
- REST API with proper error handling
- Database integration with TypeORM and migrations
- Health checks and application monitoring
- Version endpoint for API versioning
- Comprehensive API documentation
- Full test coverage

## Project setup

```bash
$ pnpm install
```

## Available Scripts

### Development
```bash
# Install dependencies
$ pnpm install

# Start in development mode (with watch)
$ pnpm run start:dev

# Start in production mode
$ pnpm run start:prod

# Build the application
$ pnpm run build
```

### Testing
```bash
# Run all tests
$ pnpm run test

# Run tests in watch mode
$ pnpm run test:watch

# Run e2e tests
$ pnpm run test:e2e

# Run tests with coverage
$ pnpm run test:cov

# Debug tests
$ pnpm run test:debug
```

### Code Quality
```bash
# Lint code (check for issues)
$ pnpm run lint

# Auto-fix linting issues
$ pnpm run lint:fix

# Format code (check formatting)
$ pnpm run format

# Auto-format code
$ pnpm run format:write
```

### Database Migrations
```bash
# Generate migration from entity changes
$ pnpm run migration:generate -- -n MigrationName

# Create empty migration file
$ pnpm run migration:create -- -n MigrationName

# Run pending migrations
$ pnpm run migration:run

# Revert last migration
$ pnpm run migration:revert

# Show migration status
$ pnpm run migration:show
```

### Documentation
```bash
# Generate API documentation
$ pnpm run docs:generate

# Serve documentation locally (port 8081)
$ pnpm run docs:serve
```

## API Endpoints

The application provides the following REST API endpoints:

### Health & Monitoring
- `GET /api/health` - Comprehensive health check (database, application, memory)
- `GET /api/version` - Application version information

### API Documentation
- `GET /api/docs` - Swagger/OpenAPI documentation (development only)

## Project Structure

```
src/
├── main.ts                 # Application bootstrap
├── app.module.ts           # Root application module
├── database/               # Database configuration
│   ├── database.config.ts
│   └── database.module.ts
├── health/                 # Health monitoring
│   ├── health.controller.ts
│   ├── health.service.ts
│   └── health.module.ts
├── version/                # Version endpoint
│   ├── version.controller.ts
│   ├── version.service.ts
│   └── version.module.ts
└── database/migrations/    # TypeORM migrations
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

### Documentation & Learning
- [NestJS Documentation](https://docs.nestjs.com) - Official NestJS docs
- [TypeORM Documentation](https://typeorm.io/) - Database ORM docs
- [Biome Documentation](https://biomejs.dev/) - Code quality tooling
- [Swagger/OpenAPI](https://swagger.io/docs/) - API documentation

### Development Tools
- [NestJS CLI](https://docs.nestjs.com/cli/overview) - Command-line interface
- [TypeORM CLI](https://typeorm.io/using-cli) - Database migration tools
- [Compodoc](https://compodoc.app/) - API documentation generator

### Testing & Quality
- [Jest](https://jestjs.io/) - Testing framework
- [Biome](https://biomejs.dev/) - Fast linting and formatting

### Community Support
- [NestJS Discord](https://discord.gg/G7Qnnhy) - Community support
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nestjs) - Q&A platform

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
