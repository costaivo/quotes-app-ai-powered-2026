# Quotes App Backend — Implementation Guide (Part 1)

**Version**: 1.0  
**Date**: 2025-11-19  
**Target Timeline**: 2.5 weeks  
**Focus**: API Endpoints + Swagger + Postman Collection

---

## 🎯 Mission

Deliver a **functional REST API** with 7 endpoints, Swagger documentation, and a comprehensive Postman collection for testing.

**NOT included in Part 1:**
- ❌ Unit tests
- ❌ Integration tests  
- ❌ CI/CD pipeline
- ❌ Frontend implementation

These will be added in **Part 2**.

---

## 📋 Implementation Phases

### Phase 0: Codebase Assessment (0.5 week)

**Days 1–3**

#### Tasks:
1. **Verify TypeORM Setup**
   - Review existing TypeORM configuration
   - Check data source setup in backend code
   - Verify PostgreSQL connection working
   - Test migrations framework

2. **Verify Docker Compose**
   - Start backend: `docker-compose up`
   - Verify PostgreSQL service running on port 5432
   - Verify backend service running on port 3000
   - Check logs for any startup issues

3. **Assess Project Structure**
   - Review existing entity models
   - Check repository patterns
   - Review NestJS folder structure
   - Identify coding standards used

4. **Team Alignment**
   - Distribute updated RFD to backend team
   - Clarify scope (API only, no tests yet)
   - Assign ownership:
     - Quote entity & migrations: Developer 1
     - API endpoints & validation: Developer 1 or 2
     - Swagger documentation: Developer 2
     - Postman collection: Developer 2

#### Success Criteria:
- ✅ TypeORM setup verified and working
- ✅ `docker-compose up` works cleanly
- ✅ Project structure understood
- ✅ Team aligned on scope and ownership

---

### Phase 1: Database Schema & Quote Entity (1 week)

**Days 4–10**

#### Milestone 1.1: Audit TypeORM Setup (Days 4–5)

**Tasks:**
```bash
# 1. Verify TypeORM config
app/be/src/database.ts          # Check connection setup
app/be/src/typeorm.config.ts    # Check migrations config

# 2. Test connection
npm run typeorm -- query "SELECT 1"

# 3. Review existing entities
ls app/be/src/entities/

# 4. Test migrations
npm run typeorm -- migration:show  # List migrations
npm run typeorm -- migration:run   # Run migrations
```

**Deliverable**: TypeORM confirmed working, migration system verified

#### Milestone 1.2: Create Quote Entity & Migration (Days 5–8)

**Tasks:**

1. **Create Quote Entity** (`app/be/src/entities/quote.entity.ts`):

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    length: 1000,
  })
  text: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  author: string;

  @Column({
    type: 'integer',
    default: 0,
    check: '"likes" >= 0',  // Non-negative constraint
  })
  likes: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  tags: string; // Semicolon-delimited: "tag1;tag2;tag3"

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

2. **Generate Migration**:
```bash
npm run typeorm -- migration:generate -n CreateQuoteTable
```

3. **Review & Test Migration**:
```bash
# Test migration locally
npm run typeorm -- migration:run

# Verify table created
npm run typeorm -- query "SELECT * FROM quotes LIMIT 1"
```

**Deliverable**: Quote table exists with all constraints, migrations work

#### Milestone 1.3: Repository & Service (Days 8–10)

**Tasks:**

1. **Create Repository** (`app/be/src/quotes/quotes.repository.ts`):

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';

@Injectable()
export class QuotesRepository extends Repository<Quote> {
  constructor(private dataSource: DataSource) {
    super(Quote, dataSource.createEntityManager());
  }

  async findAll(): Promise<Quote[]> {
    return this.find();
  }

  async findById(id: string): Promise<Quote | null> {
    return this.findOne({ where: { id } });
  }

  async create(data: Partial<Quote>): Promise<Quote> {
    const quote = this.create(data);
    return this.save(quote);
  }

  async update(id: string, data: Partial<Quote>): Promise<Quote> {
    await this.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.delete(id);
  }

  async findAllTags(): Promise<string[]> {
    const quotes = await this.find({ select: ['tags'] });
    const tagSet = new Set<string>();
    quotes.forEach(quote => {
      if (quote.tags) {
        quote.tags.split(';').forEach(tag => {
          if (tag.trim()) tagSet.add(tag.trim());
        });
      }
    });
    return Array.from(tagSet).sort();
  }

  async findAllAuthors(): Promise<string[]> {
    const quotes = await this.find({ select: ['author'] });
    const authorSet = new Set(quotes.map(q => q.author));
    return Array.from(authorSet).sort();
  }
}
```

2. **Create Service** (`app/be/src/quotes/quotes.service.ts`):

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QuotesRepository } from './quotes.repository';
import { CreateQuoteDto, UpdateQuoteDto } from './dto';
import { Quote } from '../entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(private quotesRepository: QuotesRepository) {}

  async getAllQuotes(): Promise<Quote[]> {
    return this.quotesRepository.findAll();
  }

  async getQuoteById(id: string): Promise<Quote> {
    const quote = await this.quotesRepository.findById(id);
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return quote;
  }

  async createQuote(dto: CreateQuoteDto): Promise<Quote> {
    // Validation handled by DTO decorators
    return this.quotesRepository.create(dto);
  }

  async updateQuote(id: string, dto: UpdateQuoteDto): Promise<Quote> {
    const quote = await this.getQuoteById(id); // Throws 404 if not found
    return this.quotesRepository.update(id, dto);
  }

  async deleteQuote(id: string): Promise<void> {
    const quote = await this.getQuoteById(id); // Throws 404 if not found
    await this.quotesRepository.delete(id);
  }

  async getAllTags(): Promise<string[]> {
    return this.quotesRepository.findAllTags();
  }

  async getAllAuthors(): Promise<string[]> {
    return this.quotesRepository.findAllAuthors();
  }
}
```

3. **Create DTOs** (`app/be/src/quotes/dto/`):

```typescript
// create-quote.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  text: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  author: string;

  @IsString()
  @MaxLength(500)
  tags?: string;
}

// update-quote.dto.ts
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateQuoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  text?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tags?: string;

  @IsOptional()
  likes?: number;
}
```

**Deliverable**: Repository, Service, and DTOs implemented and working

---

### Phase 2: API Endpoints & Documentation (1.5 weeks)

**Days 11–19**

#### Milestone 2.1: REST Endpoints (Days 11–13)

**Tasks:**

1. **Create Controller** (`app/be/src/quotes/quotes.controller.ts`):

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto } from './dto';
import { Quote } from '../entities/quote.entity';

@Controller('api/v1/quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get()
  async getAllQuotes(): Promise<Quote[]> {
    return this.quotesService.getAllQuotes();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuote(@Body() dto: CreateQuoteDto): Promise<Quote> {
    return this.quotesService.createQuote(dto);
  }

  @Get(':id')
  async getQuoteById(@Param('id') id: string): Promise<Quote> {
    return this.quotesService.getQuoteById(id);
  }

  @Patch(':id')
  async updateQuote(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteDto,
  ): Promise<Quote> {
    return this.quotesService.updateQuote(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuote(@Param('id') id: string): Promise<void> {
    return this.quotesService.deleteQuote(id);
  }

  @Get('tags/all')
  async getAllTags(): Promise<string[]> {
    return this.quotesService.getAllTags();
  }

  @Get('authors/all')
  async getAllAuthors(): Promise<string[]> {
    return this.quotesService.getAllAuthors();
  }
}
```

2. **Add to Module** (`app/be/src/quotes/quotes.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../entities/quote.entity';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { QuotesRepository } from './quotes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [QuotesService, QuotesRepository],
  controllers: [QuotesController],
})
export class QuotesModule {}
```

3. **Test Endpoints**:
```bash
# Start backend
docker-compose up

# Test GET all quotes
curl http://localhost:3000/api/v1/quotes

# Test CREATE quote
curl -X POST http://localhost:3000/api/v1/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test quote",
    "author": "Test Author",
    "tags": "test;demo"
  }'
```

**Deliverable**: All 7 endpoints working and responding correctly

#### Milestone 2.2: Validation & Error Handling (Days 13–15)

**Tasks:**

1. **Create Global Exception Filter** (`app/be/src/filters/http-exception.filter.ts`):

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = '';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'object') {
        message = (errorResponse as any).message || message;
        details = (errorResponse as any).details || '';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      error: message,
      statusCode: status,
      details: details || message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

2. **Apply Filter in Main** (`app/be/src/main.ts`):

```typescript
import { NestFactory, Repl } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Use global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on port ${process.env.PORT || 3000}`);
}

bootstrap();
```

3. **Test Error Scenarios**:
```bash
# Missing required field
curl -X POST http://localhost:3000/api/v1/quotes \
  -H "Content-Type: application/json" \
  -d '{"text": "Missing author"}'

# Should return 400 with error format

# Non-existent quote
curl http://localhost:3000/api/v1/quotes/invalid-id

# Should return 404 with error format
```

**Deliverable**: Error handling working, validation responses correct

#### Milestone 2.3: Swagger/OpenAPI Documentation (Days 15–17)

**Tasks:**

1. **Install Swagger** (if not already installed):
```bash
npm install @nestjs/swagger swagger-ui-express
```

2. **Configure Swagger** (`app/be/src/main.ts`):

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ... other setup ...

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Quotes App API')
    .setDescription('REST API for managing quotes with tags and authors')
    .setVersion('1.0.0')
    .addTag('quotes', 'Quote management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
```

3. **Add Swagger Decorators** (Update `quotes.controller.ts`):

```typescript
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('api/v1/quotes')
export class QuotesController {
  @Get()
  @ApiOperation({ summary: 'Get all quotes' })
  @ApiResponse({
    status: 200,
    description: 'Returns array of all quotes',
    type: [Quote],
  })
  async getAllQuotes(): Promise<Quote[]> {
    return this.quotesService.getAllQuotes();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new quote' })
  @ApiBody({ type: CreateQuoteDto })
  @ApiResponse({
    status: 201,
    description: 'Quote created successfully',
    type: Quote,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async createQuote(@Body() dto: CreateQuoteDto): Promise<Quote> {
    return this.quotesService.createQuote(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quote by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Returns the quote',
    type: Quote,
  })
  @ApiResponse({
    status: 404,
    description: 'Quote not found',
  })
  async getQuoteById(@Param('id') id: string): Promise<Quote> {
    return this.quotesService.getQuoteById(id);
  }

  // ... similar for PATCH, DELETE, GET tags, GET authors ...
}
```

4. **Test Swagger UI**:
```bash
# Start backend
docker-compose up

# Open browser
http://localhost:3000/api-docs

# Should see interactive Swagger UI with all 7 endpoints
```

**Deliverable**: Swagger UI live at `/api-docs` with all endpoints documented

#### Milestone 2.4: Postman Collection (Days 17–19)

**Tasks:**

1. **Use Provided Collection**:
   - Copy `docs/postman-collection/quotes-api-collection.json`
   - Import into Postman desktop app
   - Verify all 7 endpoints appear
   - Configure base URL (default: `http://localhost:3000/api/v1`)

2. **Run Full Collection**:
   ```
   Postman → Right-click collection → Run collection
   ```
   - All tests should pass
   - Fake data auto-generates
   - Each test validates response

3. **Manual Verification**:
   - Run each endpoint individually
   - Verify responses match Swagger documentation
   - Test error scenarios (invalid ID, missing fields, etc.)
   - Verify database persistence (delete doesn't crash, updates persist)

4. **Export Collection** (if modifications made):
   ```
   Postman → Collection menu → Export → Save as JSON
   ```

**Deliverable**: Postman collection tested and working, all endpoints validated

---

### Phase 3: Verification & Handoff (2 days, overlap with Phase 2)

**Days 18–19**

#### Milestone 3.1: Final Verification

**Tasks:**

1. **Manual Smoke Tests**:
   - Start backend: `docker-compose up`
   - Run Postman collection: All tests pass ✅
   - Verify Swagger UI: All endpoints documented ✅
   - Test edge cases:
     - Empty quote list
     - Very long text (at limit)
     - Special characters in tags
     - Update with only some fields
     - Delete and then try to get (404)

2. **Database Verification**:
   ```bash
   # Access PostgreSQL
   docker exec -it quotes-app-ai-powered-2026_db_1 psql -U postgres -d quotes_app

   # Check schema
   \dt quotes

   # Sample query
   SELECT * FROM quotes LIMIT 5;
   ```

3. **Error Scenarios**:
   - Missing required fields → 400 ✅
   - Non-existent ID → 404 ✅
   - Text too long → 400 ✅
   - Invalid UUID → 400 or 404 ✅

**Deliverable**: All endpoints verified working, error handling correct

#### Milestone 3.2: Documentation & Handoff

**Tasks:**

1. **Export OpenAPI Spec**:
   - Swagger UI → "Download" or copy JSON
   - Save to `docs/openapi.json`

2. **Create README**:
   - How to start backend
   - How to access Swagger UI
   - How to import Postman collection
   - API usage examples
   - Error codes reference

3. **Prepare Postman Collection for Handoff**:
   - Export as `.json`
   - Place in `docs/postman-collection/`
   - Include import instructions in README

4. **Document Known Issues** (if any):
   - Any limitations or edge cases
   - Planned improvements for Part 2
   - Notes for frontend team

**Deliverable**: Documentation complete, ready for frontend team

---

## 📦 Deliverables Checklist

### Code Deliverables
- [ ] Quote entity with all required fields
- [ ] Database migrations (tested locally)
- [ ] Repository with custom methods
- [ ] Service with validation
- [ ] DTOs with validation rules
- [ ] Controller with all 7 endpoints
- [ ] Global exception filter
- [ ] Error response formatter
- [ ] Swagger decorators on all endpoints

### Documentation Deliverables
- [ ] Swagger UI at `/api-docs`
- [ ] OpenAPI spec exported as `.json`
- [ ] README with setup instructions
- [ ] Postman collection `.json` file
- [ ] Postman collection README

### Testing Deliverables
- [ ] Postman collection with all 7 endpoints
- [ ] Pre-request scripts for fake data generation
- [ ] Tests for each endpoint
- [ ] Error scenario tests
- [ ] Database persistence verification

---

## 🚀 Getting Started

### Day 1 Action Items
1. Clone repository
2. Start Docker: `docker-compose up`
3. Review this guide
4. Read RFD: `docs/product/rfd/rfd-001-quote-management-part1-implementation.md`
5. Create Quote entity
6. Test TypeORM migration

### Daily Progress Tracking
- **Week 1**: Database setup (Phase 1) ✅
- **Week 2**: API endpoints + validation (Phase 2 milestones 2.1–2.2) ✅
- **Week 2**: Swagger + Postman (Phase 2 milestones 2.3–2.4) ✅
- **End of Week 2**: Verification + handoff (Phase 3) ✅

---

## 📚 Resources

- **TypeORM Docs**: https://typeorm.io/
- **NestJS Docs**: https://docs.nestjs.com/
- **Swagger UI**: http://localhost:3000/api-docs (when running)
- **Postman Docs**: https://learning.postman.com/
- **Docker Compose**: `docker-compose.yml` in project root
- **PRD**: `docs/product/prd.md`
- **RFD**: `docs/product/rfd/rfd-001-quote-management-part1-implementation.md`

---

## ⚠️ Important Notes

### Part 1 Scope
This phase focuses on **API delivery only**. No unit tests, integration tests, or CI/CD setup.

### Part 2 Scope
Next phase will add:
- Unit and integration tests
- CI/CD pipeline
- Performance optimization
- Database indexing

### Frontend Integration
Frontend team can start immediately after Phase 1 completes with:
- Working API server
- Swagger documentation
- Postman collection for testing
- README with examples

---

## 📞 Support

Questions or blockers?
1. Check RFD: `docs/product/rfd/rfd-001-quote-management-part1-implementation.md`
2. Review Docker logs: `docker-compose logs be`
3. Check database: `docker exec ... psql`
4. Test in Postman before asking

---

**Ready to implement!** 🎉  
Follow this guide week-by-week for successful Part 1 delivery.

