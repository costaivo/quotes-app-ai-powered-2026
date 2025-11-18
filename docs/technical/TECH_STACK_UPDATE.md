# Tech Stack Update: Biome Implementation ✨

## Summary

The tech stack has been updated to use **Biome** as the unified linting and formatting tool, replacing separate ESLint and Prettier configurations.

## What Changed

### Updated Files
- ✅ **`.cursor/be/be-rules.mdc`** - Backend rules updated to reference Biome
- ✅ **`.cursor/fe/fe-rules.mdc`** - Frontend rules updated to reference Biome
- ✅ **`biome.json`** - Root-level Biome configuration (ready to use)
- ✅ **`BIOME_SETUP.md`** - Comprehensive setup and migration guide

## Key Updates

### Backend Rules (be-rules.mdc)
**Old approach:**
```
- Use **Prettier** for formatting
- Use **ESLint** with NestJS recommended rules
```

**New approach:**
```
- Use **Biome** for linting and formatting (replaces ESLint & Prettier)
  - 366+ rules covering best practices from ESLint, TypeScript ESLint, and other sources
  - Fast, single-tool approach: `biome check --write ./src`
  - Configuration via `biome.json` in project root
```

### Frontend Rules (fe-rules.mdc)
**Old approach:**
```
- ESLint with TypeScript plugin.
- Prettier for code formatting.
- Enforce Tailwind class order using `eslint-plugin-tailwindcss`.
- Use git hooks to format and lint code on commit.
```

**New approach:**
```
- **Biome** for linting and formatting (replaces ESLint & Prettier)
  - Fast, all-in-one toolchain: format, lint, and check all at once
  - 366+ rules with excellent error messages and auto-fixes
  - Run with: `biome check --write ./src`
  - Configuration via `biome.json` in project root
- Tailwind class order managed via Biome's built-in CSS support
- Use git hooks to lint and format code on commit (via Biome)
```

## Benefits of This Change

| Feature | Before | After |
|---------|--------|-------|
| **Tools Required** | ESLint + Prettier | Biome (1 tool) |
| **Performance** | Slower on large codebases | ~35x faster |
| **Setup Complexity** | Multiple config files | Single `biome.json` |
| **Linting Rules** | Limited | 366+ comprehensive rules |
| **Code Formatting** | Separate tool | Built-in |
| **Configuration** | Extensive | Zero to minimal |
| **Error Messages** | Sometimes unclear | Clear, actionable messages |
| **Auto-fixes** | Limited | Extensive with safe suggestions |

## Next Steps

### 1. Install Biome

**Frontend:**
```bash
cd app/fe
pnpm add -D --save-exact @biomejs/biome
```

**Backend:**
```bash
cd app/be
pnpm add -D --save-exact @biomejs/biome
```

### 2. Update package.json Scripts

Add to each `app/fe/package.json` and `app/be/package.json`:

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

### 3. Create Biome Config

The root `biome.json` is already created and ready to use. You can customize it by:
- Adjusting rule severity (warn vs error)
- Modifying formatter settings (line width, indentation, etc.)
- Enabling/disabling specific rules

### 4. Optional: VSCode Integration

Install the **Biome** VSCode extension:
- Search for "Biome" in Extensions marketplace
- ID: `biomejs.biome`

Add to `.vscode/settings.json`:
```json
{
  "[javascript][jsx]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[typescript][tsx]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  }
}
```

### 5. Run Initial Check

```bash
# From project root
biome check --write ./
```

## Configuration Reference

The root `biome.json` includes:

- ✅ **Recommended linting rules** - Best practices for JS/TS
- ✅ **Formatter settings** - 2-space indentation, 100-char line width
- ✅ **Import organization** - Automatic import sorting
- ✅ **Ignore patterns** - node_modules, dist, build, etc.
- ✅ **JavaScript/TypeScript rules** - Double quotes, trailing commas, arrow parentheses

## Resources

- 📖 **Setup Guide**: `BIOME_SETUP.md` (detailed instructions)
- 🌐 **Official Docs**: https://biomejs.dev/
- 🎮 **Interactive Playground**: https://biomejs.dev/playground/
- 📋 **Rules Reference**: https://biomejs.dev/linter/rules/

## Migration Checklist

- [ ] Install Biome in both apps
- [ ] Update package.json scripts
- [ ] Create/customize biome.json in each app directory (optional)
- [ ] Run `biome check --write ./` to fix existing issues
- [ ] Update CI/CD pipelines to use `biome check`
- [ ] Install Biome VSCode extension (optional)
- [ ] Update git hooks to run Biome
- [ ] Remove old ESLint and Prettier dependencies
- [ ] Delete old config files (`.eslintrc`, `.prettierrc`, etc.)

## Questions?

Refer to `BIOME_SETUP.md` for detailed commands and troubleshooting, or visit https://biomejs.dev/ for official documentation.

---

**Status**: ✅ Tech stack rules updated  
**Next Action**: Install Biome and configure per `BIOME_SETUP.md`

