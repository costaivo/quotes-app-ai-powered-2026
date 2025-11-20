# Prompt Examples

This document provides structured examples for using various prompts in the development workflow. Each example includes clear objectives, required inputs, and expected outputs.

## Generate PRD from Requirements

**Objective:** Create a comprehensive Product Requirements Document (PRD) from functional requirements.

**Inputs:**
- Requirements document: `@part-1.md`
- System prompt: `@generate-prd.md`

**Instructions:**
```markdown
Using the requirements in @part-1.md as input, generate a complete PRD following the guidelines in @generate-prd.md.

Ensure the PRD includes:
- Clear feature descriptions
- User stories
- Acceptance criteria
- Technical considerations
- Success metrics
```

## Generate RFD from PRD

**Objective:** Create a Request for Development (RFD) document outlining the technical implementation plan.

**Inputs:**
- PRD document: `@prd.md`
- System prompt: `@generate-rfd.md`

**Instructions:**
```markdown
Use the PRD in @prd.md as the primary input to generate a comprehensive RFD document.

Follow the guidelines in @generate-rfd.md and ensure the RFD covers:
- Technical architecture decisions
- Implementation approach
- Dependencies and constraints
- Risk assessment
- Timeline estimates
```

## Refine Generated RFD After Review

**Objective:** Update the RFD to account for existing project infrastructure and scope limitations.

**Inputs:**
- Current RFD: `@rfd-001-quote-management-part1-implementation.md`
- Docker configuration: `@docker-compose.yml`
- Backend Dockerfile: `@app/be/Dockerfile`

**Context:**
- Backend project already has TypeORM and a basic working application
- Docker files exist for both backend and frontend
- Docker Compose configuration is in place

**Instructions:**
```markdown
Review @rfd-001-quote-management-part1-implementation.md and update it considering:

1. The backend already has an established codebase with TypeORM
2. Docker infrastructure is already configured (@docker-compose.yml, @Dockerfile)
3. Focus exclusively on backend implementation
4. Frontend development will be addressed in a separate RFD after backend completion

Revise the RFD to reflect these existing assets and scope limitations.
```

## Refine RFD After Second Review

**Objective:** Adjust the RFD scope by removing testing and CI/CD while adding API testing requirements.

**Context:**
- Remove unit tests, integration tests, and CI/CD from current scope
- Add Postman collection with comprehensive API tests

**Inputs:**
- Current RFD: `@rfd-001-quote-management-part1-implementation.md`

**Instructions:**
```markdown
Update @rfd-001-quote-management-part1-implementation.md with the following changes:

**Remove from scope:**
- Unit tests implementation
- Integration tests implementation
- CI/CD pipeline setup

**Add to scope:**
- API endpoint implementation
- Swagger/OpenAPI documentation
- Postman collection with automated tests for all endpoints
- Use fake data generators for test input parameters

Ensure the RFD focuses on core API development and documentation.
```

## Generate Implementation Tasks

**Objective:** Break down the RFD into actionable, prioritized implementation tasks.

**Inputs:**
- RFD document: `@rfd-001-quote-management-part1-implementation.md`
- Task generation prompt: `@generate-tasks.md`

**Instructions:**
```markdown
Using @rfd-001-quote-management-part1-implementation.md as input, generate a structured task list by following @generate-tasks.md.

Ensure tasks are:
- Organized by phase and priority
- Actionable with clear acceptance criteria
- Estimated appropriately
- Include dependencies where relevant
```

## Execute Phase 0 Tasks - Code Implementation

**Objective:** Begin implementation by executing all tasks in Phase 0.

**Inputs:**
- Task list: `@tasks-rfd-001-quote-management-part1-implementation.md`
- Task processing prompt: `@process-task-list.md`

**Instructions:**
```markdown
Execute all tasks in Phase 0 from @tasks-rfd-001-quote-management-part1-implementation.md.

Use @process-task-list.md as the processing framework to:
- Implement each task systematically
- Verify completion against acceptance criteria
- Document any deviations or discoveries
- Ensure code quality standards are maintained
```

## Execute Phase 1 Tasks - Code Implementation

**Objective:** Continue implementation by executing all tasks in Phase 1.

**Inputs:**
- Task list: `@tasks-rfd-001-quote-management-part1-implementation.md`
- Task processing prompt: `@process-task-list.md`

**Instructions:**
```markdown
Execute all tasks in Phase 1 from @tasks-rfd-001-quote-management-part1-implementation.md.

Follow the systematic approach defined in @process-task-list.md:
- Implement each task in sequence
- Validate against defined acceptance criteria
- Maintain consistent code quality
- Document implementation details and decisions
```