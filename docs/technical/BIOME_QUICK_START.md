# Biome Quick Start 🚀

## One-Minute Setup

```bash
# Install Biome
cd app/fe && pnpm add -D --save-exact @biomejs/biome
cd ../be && pnpm add -D --save-exact @biomejs/biome

# Format & lint everything
biome check --write ./src
```

## Daily Commands

```bash
# Check code (no changes)
biome check ./src

# Fix automatically
biome check --write ./src

# Just format
biome format ./src

# Just lint
biome lint ./src

# Organize imports
biome check --write ./src (included in check)
```

## NPM Scripts

```bash
# In package.json
{
  "scripts": {
    "lint": "biome lint ./src",
    "lint:fix": "biome check --write ./src",
    "format": "biome format ./src",
    "check": "biome check ./src"
  }
}
```

## Config Highlights

The included `biome.json`:
- 📝 2-space indentation
- 📏 100-character line width
- ✔️ Double quotes preferred
- 🔧 Auto-fixes enabled for safe issues
- 📦 Import sorting enabled
- 🚫 Ignores node_modules, dist, build

## VSCode Setup

1. Install extension: **Biome** (biomejs.biome)
2. Add to `.vscode/settings.json`:

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  }
}
```

3. Format on save works automatically! ✨

## Rules Example

```javascript
// ❌ Before
const x=Math.floor(Math.random() * 1E+7).toString().replace(/.d+/ig, "")

// ✅ After (biome check --write)
const x = Math.floor(Math.random() * 1E7).toString().replace(/.d+/gi, "");
```

Biome automatically:
- Adds proper spacing
- Fixes regex flags
- Ensures consistency

## Common Issues

**Issue**: "biome: command not found"  
**Fix**: Make sure you installed Biome: `pnpm add -D @biomejs/biome`

**Issue**: Files not formatting  
**Fix**: Check `biome.json` config in project root

**Issue**: Too many warnings  
**Fix**: Adjust rule severity in `biome.json` (change "error" to "warn" or remove rules)

## Performance

- ⚡ Biome is ~35x faster than Prettier
- ✅ Lints 171,127 lines in 2,104 files in seconds
- 📦 Single binary, no dependencies

## Where to Learn More

| Resource | Link |
|----------|------|
| Full Setup Guide | `BIOME_SETUP.md` |
| Tech Stack Update | `TECH_STACK_UPDATE.md` |
| Official Website | https://biomejs.dev/ |
| Playground | https://biomejs.dev/playground/ |
| Rules List | https://biomejs.dev/linter/rules/ |
| GitHub | https://github.com/biomejs/biome |

---

**Ready?** Run `biome check --write ./src` and enjoy faster linting & formatting! 🎉

