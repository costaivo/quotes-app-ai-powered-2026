# syntax=docker/dockerfile:1.4
# Stage 1: Build the React application
FROM node:20.9.0-alpine AS builder

WORKDIR /app

# Copy package.json and pnpm lockfile first for better caching
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install and enable corepack, then activate pnpm with specific version
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Use BuildKit cache for pnpm store to speed up repeated builds
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Serve the application using a web server
FROM nginx:stable-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]