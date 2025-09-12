# syntax=docker/dockerfile:1.4
# Stage 1: Build the application
FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile first for better caching
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install and enable corepack, then activate pnpm
RUN corepack enable && corepack prepare pnpm@8.7.0 --activate

# Use BuildKit cache for pnpm store to speed up repeated builds
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

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
RUN corepack enable && corepack prepare pnpm@8.7.0 --activate && \
    pnpm install --frozen-lockfile

# Copy the source code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "exec", "nest", "start", "--watch"]

# Stage 3: Production environment
FROM node:20.9.0-alpine AS production

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Enable pnpm and install only production dependencies
RUN corepack enable && corepack prepare pnpm@8.7.0 --activate && \
    pnpm install --prod --frozen-lockfile

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
