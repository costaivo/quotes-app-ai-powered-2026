# 🚀 Phase 1 Quick Start Guide

**Phase:** 1 - Database Schema & Quote Entity  
**Duration:** ~1 week (5 working days)  
**Status:** Ready to Start  
**Related Task List:** `docs/product/tasks/tasks-rfd-001-quote-management-part1-implementation.md`

---

## Overview

Phase 1 focuses on creating the Quote entity, database schema, and core business logic layer (repository and service). This phase establishes the data model that all 7 API endpoints will depend on.

---

## Phase 1 Breakdown

### 1.1: Audit & Verify Existing TypeORM Setup (1-2 days)
**Status:** ✅ Already Complete in Phase 0

**Key Points:**
- TypeORM configured at `app/be/ormconfig.ts`
- Entity path: `src/**/*.entity{.ts,.js}`
- Migration path: `src/database/migrations/*{.ts,.js}`
- Everything verified and ready ✓

**Tasks:**
- [x] Review `ormconfig.ts` ✓
- [x] Review `database.config.ts` ✓
- [x] Verify environment variables ✓
- [x] Confirm migrations system works ✓

---

### 1.2: Create Quote Entity & Generate Migration (2-3 days)
**Status:** 🟡 Ready to Start

**Main Task:** Create `app/be/src/quotes/entities/quote.entity.ts`

```typescript
// Expected entity structure
@Entity('quotes')
export class QuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', length: 1000 })
  text: string;

  @Column({ type: 'varchar', length: 200 })
  author: string;

  @Column({ type: 'integer', default: 0 })
  @Check('"likes" >= 0')
  likes: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tags: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Steps:**
1. Create entity file with all fields per PRD
2. Add database constraints (non-null, CHECK for likes ≥ 0)
3. Run `pnpm migration:generate` to auto-create migration
4. Review generated migration file
5. Test migration locally: `pnpm migration:run`
6. Verify Quote table in PostgreSQL

**Success Criteria:**
- ✅ Entity file created with all fields
- ✅ Migration generated successfully
- ✅ Migration runs without errors
- ✅ Quote table exists in database with constraints

---

### 1.3: Create Repository & Service Layer (3-4 days)
**Status:** 🟡 Ready to Start

#### Step 1: Create Custom Repository
**File:** `app/be/src/quotes/repositories/quote.repository.ts`

Required Methods:
- `findAll()` - fetch all quotes
- `findById(id: string)` - fetch single quote
- `create(dto: CreateQuoteDto)` - insert new quote
- `update(id: string, dto: UpdateQuoteDto)` - update quote
- `delete(id: string)` - remove quote
- `findAllTags()` - parse and deduplicate tags
- `findAllAuthors()` - deduplicate authors

#### Step 2: Create DTOs
**Files:**
- `app/be/src/quotes/dto/create-quote.dto.ts`
- `app/be/src/quotes/dto/update-quote.dto.ts`
- `app/be/src/quotes/dto/quote-response.dto.ts`

**Example - CreateQuoteDto:**
```typescript
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  text: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  author: string;

  @IsOptional()
  @IsString()
  tags?: string;
}
```

#### Step 3: Create Service Layer
**File:** `app/be/src/quotes/services/quote.service.ts`

Tasks:
- Wrap repository methods with business logic
- Add validation for all inputs
- Handle errors appropriately
- Implement tag/author parsing logic

#### Step 4: Create NestJS Module
**File:** `app/be/src/quotes/quotes.module.ts`

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([QuoteEntity])],
  providers: [QuoteService, QuoteRepository],
  controllers: [QuoteController],
})
export class QuotesModule {}
```

#### Step 5: Add Module to App
**Update:** `app/be/src/app.module.ts`

```typescript
imports: [DatabaseModule, VersionModule, HealthModule, QuotesModule]
```

**Success Criteria:**
- ✅ Repository with all 7 required methods
- ✅ DTOs with validation decorators
- ✅ Service with business logic
- ✅ Module properly bundled
- ✅ Unit tests for all methods

---

## Quick Command Reference

```bash
# Start development with hot-reload
pnpm dev:be

# Run migrations
pnpm migration:show    # See pending migrations
pnpm migration:run     # Apply migrations
pnpm migration:revert  # Rollback last migration

# Linting and formatting
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues
pnpm format            # Format code

# Testing
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:cov          # With coverage

# Build
pnpm build
```

---

## File Structure After Phase 1

```
app/be/src/
├── app.module.ts (UPDATED - add QuotesModule)
├── main.ts (unchanged)
├── database/
│   ├── database.config.ts (unchanged)
│   ├── database.module.ts (unchanged)
│   └── migrations/
│       └── [timestamp]-CreateQuoteTable.ts (NEW)
├── quotes/ (NEW FOLDER)
│   ├── entities/
│   │   └── quote.entity.ts (NEW)
│   ├── repositories/
│   │   └── quote.repository.ts (NEW)
│   ├── services/
│   │   ├── quote.service.ts (NEW)
│   │   └── quote.service.spec.ts (NEW - tests)
│   ├── controllers/
│   │   └── quote.controller.ts (Will be added in Phase 2)
│   ├── dto/
│   │   ├── create-quote.dto.ts (NEW)
│   │   ├── update-quote.dto.ts (NEW)
│   │   └── quote-response.dto.ts (NEW)
│   └── quotes.module.ts (NEW)
├── common/
│   ├── filters/ (Will be added in Phase 2.2)
│   └── interceptors/ (Will be added in Phase 2.1)
├── health/ (unchanged)
└── version/ (unchanged)
```

---

## Git Workflow

**Branch Name:** `task/rfd-001-phase-1-database-schema`

```bash
# Create and checkout feature branch
git checkout -b task/rfd-001-phase-1-database-schema

# After completing sub-task:
git add .
git commit -m "feat: [sub-task description]"

# After completing parent task (1.3):
git commit -m "feat: implement quote entity, repository, service layer

- Create Quote entity with all required fields
- Generate and verify TypeORM migration
- Implement QuoteRepository with 7 custom methods
- Create QuoteService with validation logic
- Add DTOs for Create, Update, Response
- Bundle in QuotesModule

Related to rfd-001 Phase 1"
```

---

## Testing Strategy for Phase 1

### Unit Tests
- Test repository CRUD methods
- Test repository custom methods (findAllTags, findAllAuthors)
- Test service validation logic
- Test error handling

### Integration Tests
- Test database migration runs successfully
- Test end-to-end flow: create → read → update → delete

### Manual Verification
- Verify Quote table in PostgreSQL
- Test each repository method with real data
- Verify database constraints work

---

## Common Issues & Solutions

### Issue: Migration fails to run
**Solution:**
1. Verify database is running: `docker ps | grep postgres`
2. Check database credentials in `.env`
3. Ensure migration file syntax is correct
4. Run `pnpm migration:revert` if needed

### Issue: Entity path not found
**Solution:**
1. Verify file is named `*.entity.ts`
2. Check path matches pattern in `ormconfig.ts`
3. Restart development server

### Issue: Service injection not working
**Solution:**
1. Verify service is provided in module
2. Check TypeOrmModule.forFeature includes entity
3. Verify module is imported in AppModule

### Issue: DTO validation not working
**Solution:**
1. Install `class-validator`: `pnpm add class-validator`
2. Verify decorators are imported correctly
3. Check ValidationPipe is enabled (in main.ts)

---

## Success Checklist

After completing Phase 1, verify:

- [ ] Quote entity created with all 7 fields
- [ ] Database migration generates and runs successfully
- [ ] Quote table exists in PostgreSQL with constraints
- [ ] QuoteRepository has all 7 required methods
- [ ] QuoteService handles validation and business logic
- [ ] DTOs validate input correctly
- [ ] QuotesModule properly bundled and exported
- [ ] AppModule imports QuotesModule
- [ ] All linting passes: `pnpm lint`
- [ ] Unit tests pass: `pnpm test`
- [ ] No TypeScript errors: `pnpm build`

---

## Phase 1 Completion Criteria

✅ **Deliverables:**
- Quote entity with all required fields and constraints
- Database migration for Quote table
- QuoteRepository with 7 custom methods
- QuoteService with validation logic
- DTOs for Create, Update, Response
- QuotesModule bundling all components
- Comprehensive unit tests

✅ **Verification:**
- Migration runs successfully
- Quote table exists with proper constraints
- All tests pass
- Zero linting errors
- Code builds without errors

✅ **Documentation:**
- Entity schema documented
- Repository methods documented
- Service validation rules documented
- API readiness documented for Phase 2

---

## Timeline Estimate

| Task | Duration | Start | End |
|------|----------|-------|-----|
| 1.1 - Audit TypeORM | ✅ Complete | - | - |
| 1.2 - Quote Entity | 2-3 days | Day 1 | Day 3 |
| 1.3 - Repository/Service | 3-4 days | Day 2 | Day 5 |
| **Total Phase 1** | **~5 days** | **Day 1** | **Day 5** |

---

## Resources

- **TypeORM Documentation:** https://typeorm.io/
- **NestJS Documentation:** https://docs.nestjs.com/
- **Class Validator:** https://github.com/typestack/class-validator
- **PostgreSQL Constraints:** https://www.postgresql.org/docs/current/sql-syntax.html
- **Task List:** `docs/product/tasks/tasks-rfd-001-quote-management-part1-implementation.md`
- **Assessment:** `docs/PHASE-0-ASSESSMENT.md`

---

**Ready to Start Phase 1?** 🚀

Follow the detailed task list in `docs/product/tasks/tasks-rfd-001-quote-management-part1-implementation.md` and use this guide as reference.

**Questions?** Refer to the comprehensive assessment in `docs/PHASE-0-ASSESSMENT.md` or the inline code examples above.

