# 📚 Product Documentation Overview

This folder contains all product-related documentation, including the **PRD**, **RFDs**, and **Decisions/ADRs**.  
It also explains the prompts used to generate or update these documents.

---

## 🗂 Folder Structure

<details>
<summary>Click to expand folder tree</summary>

    /docs
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
