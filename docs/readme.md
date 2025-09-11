# 📚 Product Documentation Overview

Single-source documentation conventions, generation commands, and contributor guidance for maintainers and contributors.

**Audience**: engineers, product managers, and technical writers who create or maintain PRDs, RFDs, and Decisions/ADRs.

---

## Table of contents

- [Folder structure](#-folder-structure)
- [Prompts](#-prompts)
- [Workflow summary](#-workflow-summary)
- [Examples](#-examples-generating-documents)
- [Prerequisites](#-prerequisites)
- [Contributing & validation](#-contributing--validation)
- [Templates & guidance](#-templates)

---

## 🗂 Folder Structure

<details>
<summary>Click to expand folder tree</summary>

    /docs
      ├─ tech-stack.md                 # High-level tech stack summary
      ├─ /product
      │    ├─ prd.md                     # Single living Product Requirements Document
      │    ├─ /rfd                       # Request for Discussion files
      │    │    ├─ rfd-auth-strategy-update.md
      │    │    └─ rfd-multi-db-connections.md
      │    ├─ /decisions                 # Decisions / ADRs
      │    │    ├─ decision-auth-strategy.md
      │    │    └─ decision-jwt-session-management.md
      │    └─ /templates                 # Boilerplate templates for new files
      │         ├─ rfd-template.md
      │         └─ decision-template.md
      └─ /prompts
           ├─ generate-prd.mdc           # Prompt rule for creating/updating PRD
           ├─ generate-rfd.mdc           # Prompt rule for creating RFDs
           └─ generate-decision.mdc      # Prompt rule for creating Decisions/ADRs

</details>

---

## 📝 Description of Folders and Files

<details>
<summary>PRD</summary>

- **prd.md**  
  Single source of truth for product-level requirements.  
  - 🔹 Updated via `@generate-prd-prompt`  
  - 🔹 Contains `Related RFDs` and `Related Decisions` sections  

</details>

<details>
<summary>RFDs</summary>

- **/rfd/**  
  Holds all technical discussion documents (Request for Discussion).  
  - 🔹 Each RFD is a separate Markdown file  
  - 🔹 Created via `@generate-rfd-prompt`  
  - 🔹 Can link back to PRD sections and relevant Decisions  

</details>

<details>
<summary>Decisions / ADRs</summary>

- **/decisions/**  
  Holds all finalized Decisions / Architecture Decision Records.  
  - 🔹 Each decision is a separate Markdown file  
  - 🔹 Created via `@generate-decision-prompt`  
  - 🔹 Linked from PRD and optionally from relevant RFDs  

</details>

<details>
<summary>Templates</summary>

- **/templates/**  
  Optional boilerplate files for standardizing new RFDs or Decisions.  
  - `rfd-template.md`  
  - `decision-template.md`  
  - 🔹 Templates are starting points; generated files are stored in `/rfd` or `/decisions`  

</details>

---

## 🛠 Prompts

<details>
<summary>Click to expand</summary>

- **generate-prd.mdc** → Handles PRD creation or updates  
- **generate-rfd.mdc** → Handles creation of new RFDs  
- **generate-decision.mdc** → Handles creation of new Decisions/ADRs  

</details>

---

## ⚡ Workflow Summary

<details>
<summary>Click to expand</summary>

1. Developer invokes a prompt to generate/update a document  
2. AI asks clarifying questions if required  
3. Document is generated or updated in its respective folder:  
       PRD → /docs/product/prd.md  
       RFD → /docs/product/rfd/  
       Decision → /docs/product/decisions/  
4. Optional templates provide a consistent structure for RFDs and Decisions  
5. All generated documents link appropriately:  
       PRD ↔ Related RFDs and Decisions  
       Decisions ↔ Optional references to PRD and RFDs  

</details>

## 🔗 Visual Workflow

<details>
<summary>Click to expand</summary>

    [Developer] 
        │
        ▼
    [Invoke Prompt] --> [AI asks clarifications] 
        │
        ▼
    [Generate Document] --> [Stored in /product/prd, /rfd, or /decisions]
        │
        ▼
    [Links Updated] --> PRD ↔ RFD ↔ Decisions

</details>

---

## 🚀 Examples: Generating Documents

<details>
<summary>Click to expand</summary>

**Generate PRD**  
    @generate-prd-prompt "Add quotes feature with author information"

**Generate RFD**  
    @generate-rfd-prompt "Support multi-database connections in NestJS"

**Generate Decision / ADR**  
    @generate-decision-prompt "Choose JWT for session management"

</details>

---

## Prerequisites

- You should be at the repository root when running the prompt commands above.
- The prompt commands are designed to run inside the project's supported prompt runner (e.g. Cursor / CLI extension). Ensure that the runner or extension that provides `@generate-*` commands is installed and authenticated.
- Recommended: have `git` configured and `pre-commit` hooks enabled for markdown linting if the repo uses them.

## Examples (with expected outputs)

- **Generate PRD**
  ```bash
  @generate-prd-prompt "Add quotes feature with author information"
  ```
  Expected result: creates or updates `./docs/product/prd.md`. Example excerpt:
  ```
  # Product Requirements: Quotes feature
  - Summary: Add quote listing with author metadata
  - Related RFDs: /docs/product/rfd/rfd-...md
  ```

- **Generate RFD**
  ```bash
  @generate-rfd-prompt "Support multi-database connections in NestJS"
  ```
  Expected result: creates `./docs/product/rfd/rfd-<slug>.md` with sections for motivation, design, and risks.

- **Generate Decision / ADR**
  ```bash
  @generate-decision-prompt "Choose JWT for session management"
  ```
  Expected result: creates `./docs/product/decisions/decision-<slug>.md` and includes rationale and consequences.

---

## Contributing & validation

- When adding or updating documents, follow the templates in `./docs/product/templates/`.
- Review generated files before committing and ensure `Related RFDs` and `Related Decisions` links are correct.
- Recommended checks:
  - Run markdown linter (e.g., `markdownlint`) or repo `pre-commit` hooks.
  - Verify that PRD updates reference any new RFDs/Decisions and that filenames use kebab-case.

## Templates & guidance

- Templates are located in `./docs/product/templates/`. Use them as a starting point and replace placeholders like `{{summary}}`, `{{motivation}}`, and `{{decisions}}`.
- Naming conventions:
  - PRD: `prd.md` (single living document)
  - RFDs: `rfd-<short-description>.md` (kebab-case)
  - Decisions: `decision-<short-description>.md` (kebab-case)

---

> **Metadata**: maintainer: `team/docs`; last-updated: 2025-09-10


