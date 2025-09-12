# Stage 1: Build the application
FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Enable pnpm via corepack and install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application (placeholder - uncomment if build script exists)
# RUN pnpm run build

# Stage 2: Production environment
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

# Copy package.json and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Enable pnpm and install only production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod --frozen-lockfile

# Copy the built application from the builder stage
# COPY --from=builder /usr/src/app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application (placeholder, as the entry point does not exist yet)
# CMD [ "node", "dist/main.js" ]