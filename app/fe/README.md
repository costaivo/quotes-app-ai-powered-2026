# React + TypeScript + Vite + TanStack Router

This template provides a minimal setup to get React working in Vite with HMR, TypeScript, TanStack Router for type-safe file-based routing, and BiomeJS for linting and formatting.

## TanStack Router

This project uses [TanStack Router](https://tanstack.com/router/latest) for modern, type-safe routing with file-based route configuration.

### Key Features

- **File-based routing**: Routes are automatically generated from the `src/routes/` directory structure
- **Type-safe navigation**: Full TypeScript support with automatic type generation
- **Code generation**: The `tsr` CLI automatically generates type definitions from your routes
- **Automatic route tree**: Routes are discovered and compiled into a route tree at build time

### Project Structure

```
src/
├── routes/
│   ├── __root.tsx          # Root layout component (wraps all routes)
│   ├── index.tsx            # Home page route (/)
│   └── about.tsx            # About page route (/about)
├── components/              # Reusable components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── types/                   # TypeScript type definitions
├── main.tsx                 # Application entry point
├── index.css               # Global styles
└── App.css                 # App styles
```

### Available Scripts

All scripts now include automatic route tree generation:

```bash
# Generate route types and start dev server
pnpm run dev

# Generate route types only
pnpm run tsr

# Build with route generation
pnpm run build

# Preview production build
pnpm run preview

# Check for linting issues
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix

# Check formatting
pnpm run format

# Auto-format code
pnpm run format:write
```

### Adding New Routes

To add a new route, create a new file in `src/routes/`:

```typescript
// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      {/* Your content here */}
    </div>
  )
}
```

The route tree will be automatically generated. If you want to manually trigger generation, run:

```bash
pnpm run tsr
```

### Nested Routes

Create nested route directories with a `__layout.tsx` file:

```typescript
// src/routes/docs/__root.tsx (layout for /docs routes)
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute()({
  component: DocsLayout,
})

function DocsLayout() {
  return (
    <div>
      <nav>{/* Docs navigation */}</nav>
      <Outlet />
    </div>
  )
}
```

### Route Configuration

The `tanstack.json` file configures the route generation:

- `routesDirectory`: Where routes are located (default: `src/routes`)
- `generatedRouteTree`: Where the type definitions are generated
- `routeFileIgnorePrefix`: Files starting with `-` are ignored

### Using Links and Navigation

```typescript
import { Link, useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Type-safe link */}
      <Link to="/about">About</Link>

      {/* Programmatic navigation */}
      <button onClick={() => navigate({ to: '/' })}>
        Go Home
      </button>
    </div>
  )
}
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for fast, unified linting and formatting instead of ESLint/Prettier. Biome provides excellent performance and comprehensive rules out of the box.

### Biome Configuration

The root `biome.json` file contains the shared configuration for the entire monorepo. It includes:

- **Linting rules**: Recommended rules for JavaScript, TypeScript, and React
- **Formatting rules**: Consistent code formatting across the project
- **File patterns**: Automatic exclusion of build artifacts and dependencies

For more information about Biome configuration, see the [Biome documentation](https://biomejs.dev/reference/configuration/).

## Vite Plugins

This project includes the following Vite plugins:

- **@tanstack/router-plugin-react**: Automatically generates route types during development and build
- **@vitejs/plugin-react**: Enables Fast Refresh for instant HMR updates
- **@tailwindcss/vite**: Compiles Tailwind CSS on-demand
