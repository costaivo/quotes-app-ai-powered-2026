# Branch Protection Rules Setup

This document provides instructions for setting up branch protection rules for the **main** branch in GitHub.

## Required Branch Protection Rules

### 1. Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar

### 2. Add Branch Protection Rule
1. Click **Add rule** button
2. In the **Branch name pattern** field, enter: `main` (or `master` if using master branch)

### 3. Configure Protection Settings

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: 1 (minimum)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners** (if CODEOWNERS file exists)

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - ✅ **Status checks that are required**:
    - `test-backend` (CI backend tests)
    - `build-frontend` (CI frontend build)

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits** (recommended for security)

- ✅ **Require linear history** (prevents merge commits)

- ✅ **Include administrators** (applies rules to admins too)

- ✅ **Allow force pushes** → **Everyone** (disabled for security)

- ✅ **Allow deletions** (disabled for main branch protection)

### 4. Save the Rule
Click **Create** to save the branch protection rule.

## Verification

After setting up the rules, verify they work by:

1. Creating a test branch
2. Making a small change
3. Opening a PR to main
4. Confirming that:
   - PR cannot be merged without CI passing
   - PR cannot be merged without approval
   - PR cannot be merged with failing status checks

## Additional Recommendations

### Code Owners File
Create a `.github/CODEOWNERS` file to automatically request reviews from specific team members:

```
# Global code owners
* @username1 @username2

# Backend specific
/app/be/ @backend-team

# Frontend specific  
/app/fe/ @frontend-team

# Documentation
/docs/ @docs-team
```

### Required Status Checks
The following status checks should be required:
- `test-backend` - Backend unit and integration tests
- `build-frontend` - Frontend build verification
- `coverage/backend` - Coverage reporting (if using Codecov)

## Troubleshooting

### Common Issues:
1. **"Required status checks are pending"** - Ensure CI workflow is running and all jobs are passing
2. **"Review required"** - Make sure at least one person has approved the PR
3. **"Branch is out of date"** - Update the branch with latest changes from main

### Admin Override:
If you need to bypass protection rules in an emergency:
1. Go to repository settings
2. Temporarily disable the rule
3. Perform the necessary action
4. Re-enable the rule immediately

## Security Considerations

- Never disable "Include administrators" unless absolutely necessary
- Always require signed commits for production repositories
- Consider requiring multiple approvals for critical changes
- Regularly review and update protection rules as the project evolves
