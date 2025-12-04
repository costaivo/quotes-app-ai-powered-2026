## Architecture / ARD prompt

Purpose

This prompt guides the AI to produce an ARD (Architecture / technical decision) document that records recommended technical approaches, tradeoffs, and an implementation plan. ARDs are intended for engineering stakeholders and should be more technical than RFDs while remaining concise.

Output location and filename

- Place ARD files under `docs/product/decisions/`.
- Filename pattern: `adr-XXX-short-title.md`, where `XXX` is a zero-padded integer matching the next available ADR number in that folder.

Required inputs (ask these if missing)

- **Short title** (one line): used to generate the filename slug.
- **Scope** (1–2 sentences): what the ARD covers and does not cover.
- **Context**: link to related PRD or RFD (path or short excerpt).
- **Decision(s) needed**: list of specific technical choices to be made.
- **Constraints**: performance, regulatory, timeline, budget, or legacy limitations.

ARD template (must fill all sections)

```
---
title: "<Short title>"
filename: "adr-XXX-<short-title-slug>.md"
date: YYYY-MM-DD
author: <Author name>
status: draft | accepted | superseded
adr_number: XXX
related: [docs/product/prd.md, docs/product/rfd/rfd-XXX-short-title.md]
---

# Summary
One-paragraph summary of the technical decision and its impact.

# Background & Context
Why this decision is required. Reference PRD/RFD sections where applicable.

# Scope
In-scope and out-of-scope boundaries.

# Options Considered
## Option A — short name
- Description
- Pros
- Cons
- Estimated effort & cost

## Option B — short name
- Description
- Pros
- Cons
- Estimated effort & cost

# Recommendation
Which option is recommended and why. Include tradeoffs and assumptions.

# Implementation Plan
- High-level phases, owners, and rough timelines. Mention migration and rollout strategy.

# Risks & Mitigations
- Risk: ... Mitigation: ...

# Monitoring & Rollback
How success will be measured and how to rollback if needed.

# Change Log
- adr-XXX created YYYY-MM-DD by <author>
```

Rules & best practices

- Always reference the canonical PRD at `docs/product/prd.md` when relevant.
- Choose the next `adr-XXX` number by inspecting `docs/product/decisions/` and picking the next unused integer.
- Keep ARDs concise: prefer bullets and short tables. Focus on rationale and rollback.
- Ask clarifying questions if required inputs are missing.

Interaction flow

1. Confirm required inputs with the requester. If any are missing, ask only for the missing fields.
2. Inspect `docs/product/decisions/` to determine the next ADR number and report back to the requester.
3. Draft the ARD using the template and include references to PRD/RFD.
4. Present the draft to the requester for review and edits.
5. On approval, write the file and set status to `draft` or `accepted` per the review outcome.


