# Quotes Application

This is a monorepo for the quotes application.

Important: This repository requires `pnpm` as the package manager. Please install and use `pnpm` for all dependency and script commands. Example setup using Corepack:

```sh
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

Use `pnpm install` to install dependencies and `pnpm run <script>` to run scripts.

## Packages

-   [app/be](./app/be): Backend application
-   [app/fe](./app/fe): Frontend application

## Design and Documentation

-   [Tech stack](./docs/tech-stack.md): High-level tech stack summary for the repo
-   [RFD-001](./docs/product/rfd/rfd-001-monorepo-base-project.md): Monorepo base project

## Running with Docker Compose

This repository provides Docker Compose configuration for local development. Use the helper scripts or `docker compose` directly.

- **Start (rebuilds images, detached)** — recommended for first run or after Dockerfile/dependency changes:

```sh
./start.sh    # runs: docker compose up -d --build and prints BE/FE/Adminer URLs
```

- **Make the helper script executable** (only required once):

```sh
chmod +x ./start.sh
```

- **Run without making executable** (alternatively):

```sh
sh ./start.sh
# or
bash ./start.sh
```

- **Start without rebuilding (fast dev start)**:

```sh
docker compose up -d
docker compose up -d be    # start only backend
docker compose up -d fe    # start only frontend
```

- **Start only the database and Adminer** (useful for DB-only tasks):

```sh
docker compose up -d db adminer
```

- **Stop / tear down**:

```sh
docker compose stop        # stops containers (preserves them)
docker compose down        # stops and removes containers, network
```

- **Rebuild a single service and bring it up**:

```sh
docker compose build be
docker compose up -d be
# or one-step:
docker compose up -d --no-deps --build be
```

- **View logs**:

```sh
docker compose logs -f be
docker compose logs -f fe
```

Notes:
- The compose file mounts local source into the containers (`./app/be:/usr/src/app`, `./app/fe:/app`), so changes to the code are picked up by the dev servers (Vite for FE, `npm run start:dev` for BE) without rebuilding the image.
- Rebuild only when you change a Dockerfile, dependency install step, or when producing production images.