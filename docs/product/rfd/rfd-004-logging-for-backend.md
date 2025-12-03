---
title: "Logging for backend"
filename: "rfd-004-logging-for-backend.md"
date: 2025-12-03
author: Ivo
status: Approved
rfd_number: 004
---

# Summary
Implement a structured, file-based logging system for the NestJS backend to improve debuggability and monitoring. This system will support log rotation, JSON formatting, and configurable log levels.

# Background & Context
Currently, the Quotes Application backend uses default console logging, which is ephemeral and hard to parse programmatically. As defined in `docs/product/prd.md` §"Feature: Simple File Logging (Part 4)", we need a persistent logging solution to capture errors and operational events. This is critical for the upcoming production deployment to ensure we can diagnose issues historically.

# Scope
**In Scope:**
- Selection and integration of a logging library for the NestJS backend.
- Configuration of file-based logging with automatic rotation.
- Implementation of structured JSON output.
- Environment variable configuration for log levels and file paths.

**Out of Scope:**
- Centralized logging aggregation (e.g., ELK stack).
- Client-side (frontend) logging.

# Decision Being Requested
1. Which logging library to use for the NestJS backend?

# Goals & Success Metrics
- **Goal 1**: Capture all application logs in a structured JSON format.
- **Goal 2**: Ensure logs are rotated automatically to prevent disk saturation.
- **Metric 1**: 100% of logs in the target file are valid JSON.
- **Metric 2**: Log files rotate correctly when they reach the configured size limit (e.g., 10MB).

# Constraints & Non-Goals
- **Constraint**: Must integrate seamlessly with the existing NestJS `LoggerService`.
- **Constraint**: Must not significantly impact request latency (asynchronous writing).
- **Non-goal**: Building a custom logging framework from scratch.

# Options Considered

## Option A — Winston (Recommended)
Use `winston` with `nest-winston` and `winston-daily-rotate-file`.

- **Description**: Winston is the most popular logging library for Node.js. It uses a "transports" model where logs can be sent to multiple destinations (Console, File, Http).
- **Pros**:
    - Mature ecosystem with a dedicated NestJS wrapper (`nest-winston`).
    - `winston-daily-rotate-file` is a battle-tested plugin specifically for the file rotation requirement.
    - highly configurable formats and levels.
- **Cons**:
    - Slightly higher overhead than Pino (though negligible for this use case).
    - Configuration can be verbose.
- **Estimated effort**: Low (1-2 days).
- **Risks**: Misconfiguration could lead to memory leaks if too many transport instances are created (unlikely with standard setup).

## Option B — Pino
Use `pino` with `nestjs-pino`.

- **Description**: Pino is a high-performance logger known for its low overhead. It defaults to JSON output.
- **Pros**:
    - Extremely fast (up to 5x faster than alternatives).
    - Native JSON output by design.
    - `nestjs-pino` provides excellent request context tracking automatically.
- **Cons**:
    - File rotation is typically handled by piping output to a separate process (like `pino-roll`) or using a transport worker, which adds operational complexity compared to Winston's in-process rotation for "simple" setups.
    - "Pretty printing" for local dev requires a separate pipe (`pino-pretty`).
- **Estimated effort**: Low (1-2 days).
- **Risks**: Setup for file rotation might require more "plumbing" than Winston.

# Recommended Option
**Option A (Winston)** is recommended.
While Pino is faster, Winston's `winston-daily-rotate-file` transport offers a self-contained, in-process solution for file rotation that perfectly matches the "Simple File Logging" requirement without needing to manage separate piping processes or external log rotation tools. Its integration with NestJS is straightforward and meets all PRD requirements out of the box.

# Implementation Plan
- **Phase 1**: Install `winston`, `nest-winston`, and `winston-daily-rotate-file`.
- **Phase 2**: Create a custom `LoggerService` configuration in `app/be/src`.
- **Phase 3**: Configure environment variables (`LOG_LEVEL`, `LOG_FILE_PATH`, etc.).
- **Phase 4**: Replace/Wrap the default NestJS logger in `main.ts`.
- **Phase 5**: Verify rotation and JSON format with a test script.

# Dependencies
- None.

# Risks & Mitigations
- **Risk**: Disk space exhaustion if rotation fails.
  - **Mitigation**: Test rotation logic explicitly; set conservative `LOG_MAX_FILES` defaults.
- **Risk**: Performance impact of synchronous file writes.
  - **Mitigation**: Winston handles file writes asynchronously; ensure proper stream handling.

# Monitoring & Rollback
- **Monitoring**: Check for presence of `logs/app.log` and its rotation archives.
- **Rollback**: Revert to default `NestFactory.create()` logger if stability issues arise.

# Open Questions
- None.

# Approvals
- Tech Lead — Pending

# Change Log
- rfd-004 created 2025-12-03 by Ivo

