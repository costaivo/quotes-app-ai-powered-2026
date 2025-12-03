
# Product Requirements Document (PRD)

This file combines the project rules and guidelines for creating and maintaining a single living Product Requirements Document for this product. It consolidates the decision flow, question checklist, structure, and output rules from the repository's prompt guidance so junior developers and contributors have a single source of truth.

## Purpose

Maintain a **single living Product Requirements Document** at `docs/product/prd.md` that describes *what* we are building and *why*, without prescribing detailed technical solutions. For requests that are purely technical or implementation-specific, the AI should recommend creating an RFD (Request for Design) instead.

---

## Decision Checklist: PRD vs RFD

- **Update the PRD if:**
  - The feature changes or expands the **product vision** or high-level goals.
  - The feature impacts **user stories** or user-facing flows.
  - The feature defines **new core functionality** relevant across the product.
  - The feature is needed to keep the **product definition complete** for junior developers.

- **Recommend an RFD (do not generate here) if:**
  - The request requires **detailed implementation design** (API contracts, DB schema, library choices).
  - The request concerns **technical architecture or infra** decisions.
  - The request is a **UI/UX design spec** with wireframes or pixel-level details.
  - The request involves **internal developer tooling or workflows** rather than product behavior.

> If in doubt, lean toward updating the PRD unless the request is clearly technical-facing.

---

## Decision Flowchart

    ┌─────────────────────────┐
    │  New Feature Request?   │
    └───────────┬─────────────┘
                │
     ┌──────────▼───────────┐
     │ Does it change core  │
     │ product goals, users │
     │ or high-level flows? │
     └───────────┬──────────┘
                 │Yes
                 ▼
         ┌───────────────┐
         │  Update PRD   │
         │ docs/product/ │
         │    prd.md     │
         └───────────────┘
                 │No
                 ▼
       ┌────────────────────┐
       │ Is it about design │
       │ details, APIs, or │
       │   implementation? │
       └───────────┬────────┘
                   │Yes
                   ▼
           ┌─────────────┐
           │ Recommend   │
           │   RFD       │
           └─────────────┘

---

## Ask Clarifying Questions

Before updating the PRD, ask clarifying questions to gather sufficient detail. Provide multiple-choice options (letters/numbers) where appropriate so the requester can answer quickly.

Suggested questions:
- **Problem / Goal:** What problem does this feature solve for the user?
- **Target User:** Who is the primary user of this feature? (a) End user (b) Admin (c) Other
- **Core Functionality:** What key actions should the user be able to perform? (list)
- **User Stories:** Can you provide 2–3 user stories for this feature?
- **Acceptance Criteria:** How will we know the feature is successfully implemented?
- **Scope / Boundaries:** What should this feature explicitly NOT do?
- **Data Requirements:** What data must the feature show or manage?
- **Design / UI:** Use existing UI guidelines? (a) Yes (b) No, new design needed
- **Edge Cases:** Any error conditions, limits, or unusual scenarios to consider?

---

## PRD Structure (Template for Each Feature)

Each feature added to this PRD should include the following sections so a junior developer can implement it without deep architecture decisions.

1. **Title** — Short descriptive name of the feature.
1. **Metadata** 
**Version**: 1.1  
**Date**: 2025-09-03  
**Author**: [Your Name]  

2. **Introduction / Overview** — Brief description of the feature and the problem it solves.
3. **Goals** — Specific, measurable objectives.
4. **User Stories** — Example format:
   - As a [type of user], I want to [perform an action] so that [benefit].
5. **Functional Requirements** — Numbered list of requirements (explicit behaviour expected).
6. **Non-Goals (Out of Scope)** — What will not be included.
7. **Design Considerations (Optional)** — High-level UI or UX guidance; reference style guides if applicable.
8. **Technical Considerations (Optional)** — Constraints or dependencies; keep deep technical designs for RFDs.
9. **Success Metrics** — How success will be measured (e.g., engagement, error rates).
10. **Open Questions** — Any unresolved decisions or clarifications needed.
11. **Acceptance Criteria** — Concrete tests or checks that demonstrate the feature works.

---

## Related RFDs

At the bottom of this document maintain a list of related RFDs. If a feature requires a detailed technical design, create an RFD and add it here as a link.

Example:

- [RFD: Multi-Database Connections](./rfd/rfd-multi-database-connections.md)
- [RFD: Authentication Strategy Update](./rfd/rfd-auth-strategy-update.md)

(If the `rfd/` directory or specific files do not exist yet, add these links when the RFDs are created.)

---

## Target Audience

This document is written for **junior developers**. Avoid jargon, be explicit, and provide clear acceptance criteria so implementation work can proceed without ambiguity.

---

## Output Rules

- **Format:** Markdown (`.md`)
- **Location:** `docs/product/prd.md` (this file)
- **Constraint:** Only one living PRD exists. Always update this file instead of creating new PRD files for the same product.

---

## Final Instructions

1. Do **not** generate RFDs within this PRD content—recommend them when needed, and add links in the Related RFDs section.
2. Always ask clarifying questions before making updates to this PRD.
3. Keep the PRD as the single source of truth in `docs/product/prd.md`.
4. Use the decision checklist and flowchart above to decide whether to update the PRD or recommend an RFD.
