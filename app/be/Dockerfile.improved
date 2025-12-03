# syntax=docker/dockerfile:1.4
# Stage 1: Build the application
FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile first for better caching
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install and enable corepack, then activate pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Use BuildKit cache for pnpm store to speed up repeated builds
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Development environment
FROM node:20.9.0-alpine AS development

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Enable pnpm and install all dependencies (including dev dependencies)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate && \
    pnpm install

# Copy the source code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "exec", "nest", "start", "--watch"]

# Stage 3: Production environment WITH migration/seed support
FROM node:20.9.0-alpine AS production

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Enable pnpm and install all dependencies (including dev dependencies for migrations)
# This is needed to support migration:run and seed commands
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate && \
    pnpm install

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy source code for seed and migration scripts
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/ormconfig.ts ./ormconfig.ts
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose the application port
EXPOSE 3000

# Default command: start the application
# Override with docker run -it myimage pnpm run migration:run to run migrations
# or docker run -it myimage pnpm run seed to seed data
CMD ["pnpm", "start"]

