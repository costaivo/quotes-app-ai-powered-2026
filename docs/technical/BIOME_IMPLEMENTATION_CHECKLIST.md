# Biome Implementation Checklist ✅

Track your progress as you implement Biome in the project.

---

## Phase 1: Preparation ✨

- [ ] Read `TECH_STACK_UPDATE.md` to understand the changes
- [ ] Review `BIOME_VS_OLD_STACK.md` to see benefits
- [ ] Review `BIOME_QUICK_START.md` for quick reference
- [ ] Review updated rule files:
  - [ ] `.cursor/be/be-rules.mdc`
  - [ ] `.cursor/fe/fe-rules.mdc`

**Timeline**: 10 minutes  
**Status**: ⏳ Not started

---

## Phase 2: Installation 📦

### Backend (app/be)
- [ ] Navigate to backend directory: `cd app/be`
- [ ] Install Biome: `pnpm add -D --save-exact @biomejs/biome`
- [ ] Verify installation: `biome --version`

### Frontend (app/fe)
- [ ] Navigate to frontend directory: `cd app/fe`
- [ ] Install Biome: `pnpm add -D --save-exact @biomejs/biome`
- [ ] Verify installation: `biome --version`

### Root Configuration
- [ ] Verify `biome.json` exists in project root
- [ ] Review `biome.json` configuration
- [ ] Adjust settings if needed (optional)

**Timeline**: 5 minutes  
**Status**: ⏳ Not started

---

## Phase 3: Testing 🧪

### Initial Check (without making changes)
- [ ] Run: `biome check ./app/be/src` (or wherever backend code is)
- [ ] Review any linting issues
- [ ] Run: `biome check ./app/fe/src` (or wherever frontend code is)
- [ ] Review any linting issues

### Dry Run
- [ ] Run: `biome check ./app/be` (without --write)
- [ ] Run: `biome check ./app/fe` (without --write)
- [ ] Ensure no errors reported by Biome itself

**Timeline**: 5 minutes  
**Status**: ⏳ Not started

---

## Phase 4: Fix Issues 🔧

### Automatic Fixes
- [ ] Run: `biome check --write ./app/be/src`
- [ ] Review changes made by Biome
- [ ] Commit/review as needed
- [ ] Run: `biome check --write ./app/fe/src`
- [ ] Review changes made by Biome
- [ ] Commit/review as needed

### Manual Review
- [ ] Check Git diff for any unexpected changes
- [ ] Verify code formatting is acceptable
- [ ] Run application tests (if any exist)
- [ ] Verify backend still starts correctly
- [ ] Verify frontend still starts correctly

**Timeline**: 10-30 minutes (depending on codebase size)  
**Status**: ⏳ Not started

---

## Phase 5: Update package.json Scripts 📝

### Backend: app/be/package.json
Add or update scripts:
```json
{
  "scripts": {
    "lint": "biome lint ./src",
    "lint:fix": "biome check --write ./src",
    "format": "biome format ./src",
    "check": "biome check ./src"
  }
}
```
- [ ] Scripts added

### Frontend: app/fe/package.json
Add or update scripts:
```json
{
  "scripts": {
    "lint": "biome lint ./src",
    "lint:fix": "biome check --write ./src",
    "format": "biome format ./src",
    "check": "biome check ./src"
  }
}
```
- [ ] Scripts added

### Root: package.json (optional convenience scripts)
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
- [ ] Scripts added (optional)

**Timeline**: 5 minutes  
**Status**: ⏳ Not started

---

## Phase 6: Cleanup (if migrating from ESLint + Prettier) 🗑️

### If OLD Tools Are Installed

- [ ] List current devDependencies: `pnpm list`
- [ ] Remove ESLint: `pnpm remove eslint`
- [ ] Remove Prettier: `pnpm remove prettier`
- [ ] Remove ESLint plugins: `pnpm remove @typescript-eslint/eslint-plugin @typescript-eslint/parser`
- [ ] Remove other ESLint packages
- [ ] Remove ESLint configs: `pnpm remove eslint-config-prettier eslint-plugin-prettier`

### Delete Old Config Files

- [ ] Delete `.eslintrc.json` (if exists)
- [ ] Delete `.eslintrc.js` (if exists)
- [ ] Delete `.prettierrc` (if exists)
- [ ] Delete `.prettierrc.json` (if exists)
- [ ] Delete `.prettierignore` (if exists)
- [ ] Delete `.eslintignore` (if exists)

### Verify Cleanup

- [ ] Run: `pnpm list` (verify old packages gone)
- [ ] Check project root for old config files
- [ ] Check app/be for old config files
- [ ] Check app/fe for old config files

**Timeline**: 10 minutes  
**Status**: ⏳ Not started (Optional - only if upgrading from old stack)

---

## Phase 7: IDE Integration 🖥️

### VSCode Setup (Recommended)

- [ ] Open VSCode Extensions marketplace
- [ ] Search for "Biome"
- [ ] Install "Biome" extension (ID: biomejs.biome)
- [ ] Verify extension installed and enabled

### Configure VSCode

Create or update `.vscode/settings.json`:
```json
{
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "quickfix.biome": "explicit"
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "quickfix.biome": "explicit"
    }
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  }
}
```

- [ ] `.vscode/settings.json` created/updated
- [ ] Close and reopen VSCode
- [ ] Test format on save (edit a file, save it)
- [ ] Verify formatting works

**Timeline**: 5 minutes  
**Status**: ⏳ Not started (Optional)

---

## Phase 8: Git Hooks Integration 🪝

### Update Pre-commit Hook

If using Husky, update `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run lint:fix
```

- [ ] `.husky/pre-commit` updated
- [ ] Test by making a commit: `git commit -m "test"`
- [ ] Verify Biome runs automatically
- [ ] Verify code is formatted before commit

**Timeline**: 5 minutes  
**Status**: ⏳ Not started (Optional but recommended)

---

## Phase 9: CI/CD Integration 🚀

### Update CI Pipeline

If using GitHub Actions or other CI:

- [ ] Update linting step to use: `biome check ./src`
- [ ] Remove old ESLint/Prettier steps
- [ ] Test CI pipeline
- [ ] Verify pipeline passes

### Example GitHub Actions step:
```yaml
- name: Lint with Biome
  run: biome check ./
```

- [ ] CI/CD configured (if applicable)

**Timeline**: 10 minutes (if CI/CD exists)  
**Status**: ⏳ Not started (Optional)

---

## Phase 10: Documentation & Knowledge Transfer 📚

- [ ] Share `BIOME_QUICK_START.md` with team
- [ ] Share `BIOME_SETUP.md` with team
- [ ] Ensure team knows to run `biome check --write` before committing
- [ ] Add Biome commands to team wiki/documentation
- [ ] Document any custom Biome rules in `biome.json`

**Timeline**: 10 minutes  
**Status**: ⏳ Not started (Optional)

---

## Phase 11: Testing & Verification ✨

### Functionality Tests
- [ ] Run backend application: `pnpm --prefix ./app/be run start`
- [ ] Run frontend application: `pnpm --prefix ./app/fe run dev`
- [ ] Manually test key features
- [ ] Check browser console for errors
- [ ] Check application logs for errors

### Biome Tests
- [ ] Run: `pnpm run lint`
- [ ] Run: `pnpm run lint:fix`
- [ ] Run: `pnpm run format`
- [ ] Run: `pnpm run check`
- [ ] Verify all commands work correctly

### Edge Cases
- [ ] Test with a newly written file
- [ ] Test with modified existing file
- [ ] Test with file containing linting issues
- [ ] Verify Biome auto-fixes work correctly

**Timeline**: 15-30 minutes  
**Status**: ⏳ Not started

---

## Phase 12: Documentation Update 📖

- [ ] Update project README if needed
- [ ] Update contributing guidelines
- [ ] Update development setup docs
- [ ] Reference Biome in tech stack documentation
- [ ] Update any tool recommendation docs

**Timeline**: 10 minutes  
**Status**: ⏳ Not started (Optional)

---

## Post-Implementation 🎉

### Success Criteria ✅
- [ ] Biome is installed in both frontend and backend
- [ ] `biome check --write` runs without errors
- [ ] All tests pass
- [ ] Application runs correctly
- [ ] Team knows how to use Biome
- [ ] IDE integration works (if setup)
- [ ] Git hooks integration works (if setup)

### Verification
- [ ] Run: `biome --version` (both apps)
- [ ] Run: `pnpm run lint` (root)
- [ ] Run: `pnpm run check` (root)
- [ ] Verify no lingering ESLint/Prettier configs
- [ ] Verify no lingering ESLint/Prettier packages

### Metrics
- [ ] Installation time: _________ minutes
- [ ] Fixing issues time: _________ minutes
- [ ] Total implementation time: _________ minutes
- [ ] Issues fixed by Biome: _________ issues

---

## Troubleshooting 🔧

If you encounter issues, check:

1. **"biome: command not found"**
   - [ ] Verify installation: `cd app/fe && pnpm list @biomejs/biome`
   - [ ] Reinstall if needed: `pnpm add -D @biomejs/biome`

2. **"Cannot find biome.json"**
   - [ ] Verify `biome.json` exists in project root
   - [ ] Check file path: `ls -la biome.json`

3. **"Format on save not working"**
   - [ ] Verify VSCode extension installed
   - [ ] Verify `.vscode/settings.json` configured
   - [ ] Restart VSCode
   - [ ] Check VSCode command palette for errors

4. **"Pre-commit hook not running"**
   - [ ] Verify Husky installed: `pnpm list husky`
   - [ ] Verify hook configured: `cat .husky/pre-commit`
   - [ ] Run: `chmod +x .husky/pre-commit`

5. **"CI/CD pipeline failing"**
   - [ ] Verify Biome installed in CI environment
   - [ ] Check CI logs for full error message
   - [ ] Run `biome check ./` locally to reproduce

---

## Resources 📚

| Resource | Link |
|----------|------|
| Quick Start | `BIOME_QUICK_START.md` |
| Full Setup | `BIOME_SETUP.md` |
| Tech Stack Update | `TECH_STACK_UPDATE.md` |
| Comparison | `BIOME_VS_OLD_STACK.md` |
| Official Docs | https://biomejs.dev/ |
| Rules | https://biomejs.dev/linter/rules/ |
| Playground | https://biomejs.dev/playground/ |
| GitHub | https://github.com/biomejs/biome |

---

## Sign-Off

- **Checklist Completed**: ☐
- **Completed By**: _________________
- **Date Completed**: _________________
- **Notes**: ___________________________________________________________________

---

**Total Estimated Time**: 60-90 minutes (for full implementation)

🎉 **Congratulations!** You've successfully implemented Biome in your project!

