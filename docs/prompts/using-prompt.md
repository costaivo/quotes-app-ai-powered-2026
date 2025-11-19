# Examples 

## Generate PRD from requirements
```markdown
@part-1.md --> Requirements
Generate the PRD for given  requirements using the system prompt as @generate-prd.md

```

## Generate RFD from PRD
```markdown
Use the PRD as Input  @prd.md  and generate the RFD document for implementing the features mentioned in the PRD.
Use prompt  @generate-rfd.md to generate the RFD. 

```

## Refining of Generated RFD after reviewing it
```markdown
@rfd-001-quote-management-part1-implementation.md The current RFD does not take into account that the BE project already has a code base with TypeORM and Basic working application. Also docker files for both BE  . FE and docker-compose files are present. 
@docker-compose.yml @Dockerfile 
The RFD should focus on implenting only the Backend application. FE will be implemented in a seperated RFD once the BE phase is completed.

Update the RFD to take into account above changes
```

## Refining of RFD after second review. 

Removing Unit tests, integrations tests, CI/CD. Add postman collection and tests in postman

```markdown
@rfd-001-quote-management-part1-implementation.md the current RFD includes Unit tests and integration tests implemenation, for current phase let's skip this. Also no CI/CD at this stage. 
Focus on implementing the API endpoints and API documentation using swagger. 
Also create a postman collection for all API endpoints with tests written to validate the API endpoints, for input parameters make use of fake data to generate data. 
```

## Generating Tasks
```markdown
@rfd-001-quote-management-part1-implementation.md generate tasks using the prompt @generate-tasks.md 
```

## Processing Phase 0 Tasks - Code implementation
```markdown
@tasks-rfd-001-quote-management-part1-implementation.md Start Phase 0 tasks using prompt @process-task-list.md 
```

## Process Phase 1 Tasks - Code Implementation
```markdown
@tasks-rfd-001-quote-management-part1-implementation.md Process all steps in Phase 1 using the prompt defined in @process-task-list.md 
```