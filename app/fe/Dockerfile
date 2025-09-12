# Stage 1: Build the React application
FROM node:20.9.0-alpine AS builder

WORKDIR /app

# Copy package.json and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Enable pnpm and install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Serve the application using a web server
FROM nginx:stable-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]