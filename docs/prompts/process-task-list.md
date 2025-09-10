# Task List Management & Automation Protocol

This document outlines the protocol for managing and automating software development tasks using a markdown-based task file. The process is designed to be followed by an AI agent to ensure systematic progress tracking, testing, and version control.

## Accepted Task-File Format

The AI will process a markdown file containing a task list structured as follows.

- **Headings**: Use `#` for parent tasks.
- **Sub-tasks**: Use checklists (`- [ ]`) for actionable sub-tasks.
- **Relevant Files**: Maintain a list of all created or modified files with a brief description.
- **Approval Flag**: A specific `Approval: ...` line must be present for the AI to proceed.

### Example Task File:

```markdown
# Parent: Implement User Login (T-45)
- [ ] Create login form component
- [ ] Add backend authentication endpoint

Relevant Files:
- `fe/src/components/LoginForm.js`: New login form. (new)

Approval:
- **Next Sub-task**: Awaiting approval
```

## Task Implementation Workflow

- **One sub-task at a time**: The AI must **NOT** proceed to the next sub-task until explicit, machine-readable approval is granted. Approval is given by changing `Awaiting approval` to `yes` in the task file.
- **Blocked State**: If a task cannot be completed due to external dependencies, it should be marked as blocked. Example: `- [ ] Deploy to staging — blocked: waiting for API key`. The AI must notify the user and stop work on that parent task.

## Completion and Commit Protocol

1.  **Sub-task Completion**: When a sub-task is finished, the AI will immediately mark it as completed by changing `[ ]` to `[x]`.
2.  **Parent Task Completion**: Once **all** sub-tasks under a parent task are marked `[x]`, the following sequence is triggered:
    - **Branching**: The AI will work on a dedicated feature branch. The branch name should follow the convention `task/<id>-<short-description>` (e.g., `task/T-45-user-login`).
    - **Testing**: Run the full test suite (`pytest`, `npm test`, etc.).
      - **On Failure**: If any tests fail, the AI will revert the completed sub-task checkbox from `[x]` back to `[ ]`, add the test failure output to the task file, and mark the task as `blocked`.
    - **Staging**: **Only if all tests pass**, stage the changes (`git add .`).
    - **Committing**: Use a descriptive, multi-line commit message with the `-m` flag. The message must follow conventional commit format.
      ```bash
      git commit -m "feat: implement user login functionality" -m "- Adds login form and backend endpoint" -m "- Includes unit tests for authentication" -m "Related to T-45"
      ```
    - **Mark Parent Task**: After a successful commit, the parent task (`#`) can be marked as completed.

## AI Instructions

When processing a task file, the AI must strictly adhere to the following rules:

1.  **Check for Approval**: Before starting any work, check the `Approval` section in the task file. Do not proceed if it is not set to `yes`.
2.  **Update Task Status**: Mark sub-tasks `[x]` immediately upon completion.
3.  **Follow Completion Protocol**: Execute the testing and commit sequence exactly as described.
4.  **Maintain File List**: Keep the "Relevant Files" section accurate and up-to-date, noting whether files are `new` or `modified`.
5.  **Pause for Approval**: After completing a sub-task and updating the task file, reset the `Approval` status to `Awaiting approval` and pause all work until it is set back to `yes`.