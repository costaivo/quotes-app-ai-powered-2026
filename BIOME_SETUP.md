# Biome Implementation Guide

This document outlines how to integrate **Biome** into the project, replacing ESLint and Prettier with a single, fast, unified toolchain.

## Overview

**Biome** (https://biomejs.dev/) is a performant linter and formatter for JavaScript, TypeScript, JSX, TSX, JSON, HTML, CSS, and GraphQL. It provides:

- **97% compatibility with Prettier** for formatting
- **366+ rules** from ESLint, TypeScript ESLint, and other sources
- **~35x faster** than Prettier on large codebases
- **Zero configuration** needed to get started
- **Single command**: `biome check --write` handles linting and formatting together

## Installation

### Frontend (app/fe)

```bash
cd app/fe
pnpm add -D --save-exact @biomejs/biome
```

### Backend (app/be)

```bash
cd app/be
pnpm add -D --save-exact @biomejs/biome
```

## Configuration Files

Create a `biome.json` in each package root (or shared at project root). Below are recommended configurations:

### Frontend: `app/fe/biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.2/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn",
        "useFlatMap": "warn"
      },
      "style": {
        "useConst": "warn",
        "useEnumInitializers": "warn"
      },
      "suspicious": {
        "noDebugger": "error",
        "noConsoleLog": "warn",
        "noEmptyInterface": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithComments": true,
    "indentSize": 2,
    "indentStyle": "space",
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "trailingCommas": "all",
      "arrowParentheses": "always",
      "quoteStyle": "double"
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  }
}
```

### Backend: `app/be/biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.2/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "error",
        "useFlatMap": "warn"
      },
      "style": {
        "useConst": "warn",
        "useEnumInitializers": "warn"
      },
      "suspicious": {
        "noDebugger": "error",
        "noConsoleLog": "error",
        "noEmptyInterface": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "formatWithComments": true,
    "indentSize": 2,
    "indentStyle": "space",
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "trailingCommas": "all",
      "arrowParentheses": "always",
      "quoteStyle": "double"
    }
  },
  "typescript": {
    "formatter": {
      "trailingCommas": "all",
      "arrowParentheses": "always",
      "quoteStyle": "double"
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  }
}
```

## NPM Scripts

Update `package.json` in each app to include Biome commands:

### Frontend: `app/fe/package.json`

```json
{
  "scripts": {
    "lint": "biome lint",
    "lint:fix": "biome check --write ./src",
    "format": "biome format ./src",
    "check": "biome check ./src"
  }
}
```

### Backend: `app/be/package.json`

```json
{
  "scripts": {
    "lint": "biome lint",
    "lint:fix": "biome check --write ./src",
    "format": "biome format ./src",
    "check": "biome check ./src"
  }
}
```

### Root: `package.json`

Add convenience scripts:

```json
{
  "scripts": {
    "lint": "pnpm --prefix ./app/fe lint && pnpm --prefix ./app/be lint",
    "lint:fix": "pnpm --prefix ./app/fe lint:fix && pnpm --prefix ./app/be lint:fix",
    "format": "pnpm --prefix ./app/fe format && pnpm --prefix ./app/be format",
    "check": "pnpm --prefix ./app/fe check && pnpm --prefix ./app/be check"
  }
}
```

## Husky Integration (Git Hooks)

Update `.husky/pre-commit` to use Biome:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run lint:fix
```

## VSCode Integration

Install the **Biome** extension:
- Search for "Biome" in VSCode Extensions
- Extension ID: `biomejs.biome`

Add to `.vscode/settings.json`:

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[javascript][jsx]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## Migration from ESLint & Prettier

If the project currently uses ESLint and Prettier:

1. **Uninstall old tools**:
   ```bash
   pnpm remove eslint prettier eslint-config-prettier eslint-plugin-prettier
   ```

2. **Remove old configs**:
   - Delete `.eslintrc.json` / `.eslintrc.js`
   - Delete `.prettierrc` / `prettier.config.js`
   - Delete `.prettierignore`

3. **Install Biome**:
   ```bash
   pnpm add -D --save-exact @biomejs/biome
   ```

4. **Create `biome.json`** using examples above

5. **Run initial check**:
   ```bash
   biome check --write ./src
   ```

## Common Commands

```bash
# Lint files
biome lint ./src

# Format files
biome format ./src

# Run all checks (lint + format)
biome check --write ./src

# Fix linting issues automatically
biome check --write ./src

# Check without making changes
biome check ./src
```

## Documentation & Resources

- **Official Website**: https://biomejs.dev/
- **Playground**: https://biomejs.dev/playground/
- **GitHub**: https://github.com/biomejs/biome
- **Rules Documentation**: https://biomejs.dev/linter/rules/

## Benefits Summary

✅ **Unified Toolchain**: One tool replaces ESLint + Prettier  
✅ **Fast**: ~35x faster than Prettier  
✅ **Easy Setup**: Minimal configuration needed  
✅ **Rich Diagnostics**: Clear error messages with auto-fixes  
✅ **Comprehensive**: 366+ linting rules  
✅ **Well-Maintained**: Backed by major organizations (Google, Discord, Vercel, etc.)

