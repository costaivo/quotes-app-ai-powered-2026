import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Quote } from '../../src/entities/quote.entity';
import { getDatabaseConfig } from '../../src/config/database.config';

describe('Quotes API (e2e)', () => {
  let app: INestApplication;
  let createdQuoteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...getDatabaseConfig(),
          // Use in-memory SQLite for e2e tests
          type: 'sqlite',
          database: ':memory:',
          entities: [Quote],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Response Envelope Format', () => {
    it('should wrap successful responses in standardized envelope', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Operation completed successfully');
    });

    it('should wrap error responses in standardized envelope', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('data', null);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path', '/quotes/nonexistent-id');
    });
  });

  describe('GET /quotes', () => {
    it('should return empty array when no quotes exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.success).toBe(true);
    });

    it('should return all quotes with proper envelope', async () => {
      // Create a test quote first
      const createResponse = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Test quote for GET all',
          author: 'Test Author',
          tags: 'test;e2e'
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('quote', 'Test quote for GET all');
      expect(response.body.data[0]).toHaveProperty('author', 'Test Author');
      expect(response.body.data[0]).toHaveProperty('tags', 'test;e2e');
      expect(response.body.data[0]).toHaveProperty('like_count', 0);
      expect(response.body.data[0]).toHaveProperty('created_at');
      expect(response.body.data[0]).toHaveProperty('updated_at');
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /quotes/:id', () => {
    beforeEach(async () => {
      // Create a test quote for these tests
      const createResponse = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Test quote for GET by ID',
          author: 'Test Author',
          tags: 'test;e2e'
        })
        .expect(201);

      createdQuoteId = createResponse.body.data.id;
    });

    it('should return quote by ID with proper envelope', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quotes/${createdQuoteId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', createdQuoteId);
      expect(response.body.data).toHaveProperty('quote', 'Test quote for GET by ID');
      expect(response.body.data).toHaveProperty('author', 'Test Author');
      expect(response.body.data).toHaveProperty('tags', 'test;e2e');
      expect(response.body.data).toHaveProperty('like_count', 0);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 with proper error envelope for non-existent quote', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
      expect(response.body.statusCode).toBe(404);
    });

    it('should return 400 with proper error envelope for invalid UUID', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes/invalid-uuid')
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('POST /quotes', () => {
    it('should create quote with valid data and return proper envelope', async () => {
      const quoteData = {
        quote: 'This is a test quote for POST endpoint.',
        author: 'Test Author',
        tags: 'test;e2e;post'
      };

      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send(quoteData)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('quote', quoteData.quote);
      expect(response.body.data).toHaveProperty('author', quoteData.author);
      expect(response.body.data).toHaveProperty('tags', quoteData.tags);
      expect(response.body.data).toHaveProperty('like_count', 0);
      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.data).toHaveProperty('updated_at');
      expect(response.body.success).toBe(true);
    });

    it('should create quote without tags and return proper envelope', async () => {
      const quoteData = {
        quote: 'This is a test quote without tags.',
        author: 'Test Author'
      };

      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send(quoteData)
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('quote', quoteData.quote);
      expect(response.body.data).toHaveProperty('author', quoteData.author);
      expect(response.body.data).toHaveProperty('tags', null);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 with proper error envelope for missing quote', async () => {
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          author: 'Test Author',
          tags: 'test'
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('quote should not be empty');
      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 with proper error envelope for missing author', async () => {
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Test quote',
          tags: 'test'
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('author should not be empty');
      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 with proper error envelope for quote too long', async () => {
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'A'.repeat(1001),
          author: 'Test Author'
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Quote must be 1000 characters or less');
      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 with proper error envelope for author too long', async () => {
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Test quote',
          author: 'A'.repeat(201)
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Author must be 200 characters or less');
      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 with proper error envelope for tags too long', async () => {
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Test quote',
          author: 'Test Author',
          tags: 'A'.repeat(501)
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Tags must be 500 characters or less');
      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 with proper error envelope for invalid data types', async () => {
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 123,
          author: 'Test Author'
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('quote must be a string');
      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('PATCH /quotes/:id', () => {
    beforeEach(async () => {
      // Create a test quote for these tests
      const createResponse = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Original quote for PATCH test',
          author: 'Original Author',
          tags: 'original;test'
        })
        .expect(201);

      createdQuoteId = createResponse.body.data.id;
    });

    it('should update quote with valid partial data and return proper envelope', async () => {
      const updateData = {
        quote: 'Updated quote text',
        tags: 'updated;tags'
      };

      const response = await request(app.getHttpServer())
        .patch(`/quotes/${createdQuoteId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', createdQuoteId);
      expect(response.body.data).toHaveProperty('quote', updateData.quote);
      expect(response.body.data).toHaveProperty('author', 'Original Author'); // unchanged
      expect(response.body.data).toHaveProperty('tags', updateData.tags);
      expect(response.body.success).toBe(true);
    });

    it('should update only specified fields and return proper envelope', async () => {
      const updateData = {
        author: 'Updated Author'
      };

      const response = await request(app.getHttpServer())
        .patch(`/quotes/${createdQuoteId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', createdQuoteId);
      expect(response.body.data).toHaveProperty('quote', 'Original quote for PATCH test'); // unchanged
      expect(response.body.data).toHaveProperty('author', updateData.author);
      expect(response.body.data).toHaveProperty('tags', 'original;test'); // unchanged
      expect(response.body.success).toBe(true);
    });

    it('should return 404 with proper error envelope for non-existent quote', async () => {
      const response = await request(app.getHttpServer())
        .patch('/quotes/123e4567-e89b-12d3-a456-426614174000')
        .send({ quote: 'Updated quote' })
        .expect(404);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
      expect(response.body.statusCode).toBe(404);
    });

    it('should return 400 with proper error envelope for invalid update data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/quotes/${createdQuoteId}`)
        .send({
          quote: 'A'.repeat(1001)
        })
        .expect(400);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Quote must be 1000 characters or less');
      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('DELETE /quotes/:id', () => {
    beforeEach(async () => {
      // Create a test quote for these tests
      const createResponse = await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote to be deleted',
          author: 'Test Author',
          tags: 'delete;test'
        })
        .expect(201);

      createdQuoteId = createResponse.body.data.id;
    });

    it('should delete quote and return 204 No Content', async () => {
      await request(app.getHttpServer())
        .delete(`/quotes/${createdQuoteId}`)
        .expect(204);

      // Verify quote is deleted
      await request(app.getHttpServer())
        .get(`/quotes/${createdQuoteId}`)
        .expect(404);
    });

    it('should return 404 with proper error envelope for non-existent quote', async () => {
      const response = await request(app.getHttpServer())
        .delete('/quotes/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);

      expect(response.body.data).toBe(null);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
      expect(response.body.statusCode).toBe(404);
    });
  });

  describe('GET /quotes/tags', () => {
    beforeEach(async () => {
      // Create test quotes with different tags
      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote 1',
          author: 'Author 1',
          tags: 'inspiration;life'
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote 2',
          author: 'Author 2',
          tags: 'wisdom;philosophy'
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote 3',
          author: 'Author 3',
          tags: 'inspiration;wisdom'
        })
        .expect(201);
    });

    it('should return all unique tags with proper envelope', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes/tags')
        .expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining(['inspiration', 'life', 'wisdom', 'philosophy'])
      );
      expect(response.body.success).toBe(true);
    });

    it('should return empty array when no quotes exist', async () => {
      // Clear all quotes by deleting them
      const quotesResponse = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      for (const quote of quotesResponse.body.data) {
        await request(app.getHttpServer())
          .delete(`/quotes/${quote.id}`)
          .expect(204);
      }

      const response = await request(app.getHttpServer())
        .get('/quotes/tags')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /quotes/authors', () => {
    beforeEach(async () => {
      // Create test quotes with different authors
      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote 1',
          author: 'Albert Einstein',
          tags: 'science'
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote 2',
          author: 'Maya Angelou',
          tags: 'poetry'
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/quotes')
        .send({
          quote: 'Quote 3',
          author: 'Albert Einstein',
          tags: 'physics'
        })
        .expect(201);
    });

    it('should return all unique authors with proper envelope', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes/authors')
        .expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining(['Albert Einstein', 'Maya Angelou'])
      );
      expect(response.body.success).toBe(true);
    });

    it('should return empty array when no quotes exist', async () => {
      // Clear all quotes by deleting them
      const quotesResponse = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      for (const quote of quotesResponse.body.data) {
        await request(app.getHttpServer())
          .delete(`/quotes/${quote.id}`)
          .expect(204);
      }

      const response = await request(app.getHttpServer())
        .get('/quotes/authors')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.success).toBe(true);
    });
  });
});
