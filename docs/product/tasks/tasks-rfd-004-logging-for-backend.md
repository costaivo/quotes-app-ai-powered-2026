# Parent: Implement Backend Logging (RFD-004)

## Relevant Files


- `app/be/src/common/logger/logger.module.ts` - New module to encapsulate logging logic.
- `app/be/src/common/logger/winston.config.ts` - Configuration for Winston transports and formats.
- `app/be/src/main.ts` - Updated to use the new Winston logger instead of the default NestJS logger.
- `app/be/package.json` - To track new dependencies.
- `app/be/.env.example` - To document new logging environment variables.
- `docs/product/tasks/tasks-rfd-004-logging-for-backend.md` - This task file.

### Notes

- The `nest-winston` library provides a `WinstonModule` that can be used to replace the default logger globally.
- `winston-daily-rotate-file` handles the complex logic of file rotation (size limits, date patterns) automatically.
- Ensure the `logs/` directory is included in `.gitignore` to avoid committing log files.

## Tasks

- [x] 1.0 Install Dependencies
  - [x] 1.1 Install `winston`, `nest-winston`, and `winston-daily-rotate-file` in the backend project (`app/be`).
  - [x] 1.2 Verify `package.json` is updated with the new dependencies.

- [x] 2.0 Configure Logger Service

  - [x] 2.1 Create a new directory `app/be/src/common/logger`.
  - [x] 2.2 Create `winston.config.ts` (or `logger.config.ts`) to export the Winston configuration object.
    - [x] Configure `Console` transport for development (pretty print).
    - [x] Configure `DailyRotateFile` transport for production/file logging (JSON format).
    - [x] Use environment variables for `level`, `dirname`, `maxSize`, and `maxFiles`.
  - [x] 2.3 Create `logger.module.ts` to export the `WinstonModule` configured with the above settings.

- [x] 3.0 Replace Default NestJS Logger
  - [x] 3.1 Modify `app/be/src/main.ts` to import `WinstonModule`.
  - [x] 3.2 Update `NestFactory.create` to use the `WinstonModule` as the custom logger.
    - Example: `NestFactory.create(AppModule, { logger: WinstonModule.createLogger(...) })`.
  - [x] 3.3 Ensure the application bootstrapping logs now appear in the configured format (JSON in file, text in console).

- [x] 4.0 Update Configuration & Environment
  - [x] 4.1 Update `env.example` (and project `.env`) with new variables:
    - `LOG_LEVEL` (default: `info`)
    - `LOG_FILE_PATH` (default: `logs/app.log`)
    - `LOG_MAX_SIZE` (default: `10m`)
    - `LOG_MAX_FILES` (default: `5d`)
  - [x] 4.2 Update `.gitignore` to exclude the `logs/` directory.

- [x] 5.0 Verification & Testing
  - [x] 5.1 Manually verify that `logs/app.log` is created upon startup.
  - [x] 5.2 Verify that logs are in valid JSON format with `timestamp`, `level`, and `message`.
  - [x] 5.3 (Optional) Create a temporary test script that generates enough logs to trigger a rotation (or temporarily lower the `LOG_MAX_SIZE` to test).
  - [x] 5.4 Ensure no sensitive data (passwords) is being logged by default.

- [x] 6.0 Update Documentation
  - [x] 6.1 Update `app/be/README.md` to include a section on Logging.
  - [x] 6.2 Describe how to configure logging (env vars) and where to find log files.


