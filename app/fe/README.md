# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some BiomeJS rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for fast, unified linting and formatting instead of ESLint/Prettier. Biome provides excellent performance and comprehensive rules out of the box.

### Available Scripts

```bash
# Check for linting issues
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix

# Check formatting
pnpm run format

# Auto-format code
pnpm run format:write
```

### Biome Configuration

The root `biome.json` file contains the shared configuration for the entire monorepo. It includes:

- **Linting rules**: Recommended rules for JavaScript, TypeScript, and React
- **Formatting rules**: Consistent code formatting across the project
- **File patterns**: Automatic exclusion of build artifacts and dependencies

For more information about Biome configuration, see the [Biome documentation](https://biomejs.dev/reference/configuration/).
