# Maintainer Guide: Building and Publishing the Docker Image

This guide explains how to build and publish the backend Docker image for the Quotes App.

## Prerequisites

- Docker installed and running.
- Access to the Docker Hub account `costaivo`.
- `docker login` performed successfully.

## Image Details

- **Repository:** `costaivo/quotes-app-be`
- **Dockerfile:** `app/be/Dockerfile.improved` (This file includes support for migrations and seeding)

## Steps to Publish

### 1. Navigate to the Backend Directory

```bash
cd app/be
```

### 2. Determine the Version

Check `package.json` for the current version.

```bash
cat package.json | grep version
```
*Example output: `"version": "0.0.4"`*

### 3. Build the Image

Use the `Dockerfile.improved` file to build the image. Tag it with both the specific version and `latest`.

```bash
# Replace 0.0.4 with the actual version from package.json
docker build -f Dockerfile.improved -t costaivo/quotes-app-be:0.0.4 -t costaivo/quotes-app-be:latest .
```

### 4. Push to Docker Hub

Push both tags to the registry.

```bash
docker push costaivo/quotes-app-be:0.0.4
docker push costaivo/quotes-app-be:latest
```

### 5. Verify

Check [Docker Hub](https://hub.docker.com/r/costaivo/quotes-app-be) to ensure the tags are available.

