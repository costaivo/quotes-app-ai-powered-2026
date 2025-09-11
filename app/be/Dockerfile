# Stage 1: Build the application
FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application (a placeholder, as no build script is defined yet)
# RUN npm run build

# Stage 2: Production environment
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built application from the builder stage
# COPY --from=builder /usr/src/app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application (placeholder, as the entry point does not exist yet)
# CMD [ "node", "dist/main.js" ]