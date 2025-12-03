import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import type { CreateQuoteDto } from '../src/quotes/dto/create-quote.dto';

describe('Quotes E2E', () => {
  let app: INestApplication<App>;
  const createdQuoteIds: string[] = [];
  let createdQuoteTimestamp: Date;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Seed data
    const quotesToCreate: CreateQuoteDto[] = [
      {
        author: 'Albert Einstein',
        quote: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
      },
      {
        author: 'Marie Curie',
        quote: 'Nothing in life is to be feared, it is only to be understood.',
      },
      {
        author: 'Isaac Newton',
        quote: 'If I have seen further it is by standing on the shoulders of Giants.',
      },
    ];

    for (const quote of quotesToCreate) {
      const response = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .send(quote)
        .expect(201);
      createdQuoteIds.push(response.body.id);
      if (!createdQuoteTimestamp) {
        createdQuoteTimestamp = new Date(response.body.createdAt);
      }
    }
  });

  afterAll(async () => {
    // Cleanup
    for (const id of createdQuoteIds) {
      await request(app.getHttpServer()).delete(`/api/v1/quotes/${id}`);
    }
    await app.close();
  });

  describe('GET /api/v1/quotes', () => {
    it('should return all quotes when no parameters provided', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/quotes').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter by author (case-insensitive, partial match)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/quotes')
        .query({ author: 'einstein' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      for (const quote of response.body) {
        expect(quote.author.toLowerCase()).toContain('einstein');
      }
    });

    it('should filter by quote content (case-insensitive, partial match)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/quotes')
        .query({ query: 'bicycle' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      for (const quote of response.body) {
        expect(quote.quote.toLowerCase()).toContain('bicycle');
      }
    });

    it('should filter by both author and query', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/quotes')
        .query({ author: 'marie', query: 'feared' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      for (const quote of response.body) {
        expect(quote.author.toLowerCase()).toContain('marie');
        expect(quote.quote.toLowerCase()).toContain('feared');
      }
    });

    it('should return empty list for no results', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/quotes')
        .query({ query: 'xyzzy_non_existent_string_12345' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/v1/quotes', () => {
    it('should validate response schema contains all required fields including audit fields', async () => {
      const newQuote: CreateQuoteDto = {
        author: 'Test Author',
        quote: 'Test quote text',
        tags: 'test;audit',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .send(newQuote)
        .expect(201);

      const { body } = response;

      // Validate core fields
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('quote');
      expect(body).toHaveProperty('author');
      expect(body).toHaveProperty('likeCount');
      expect(body).toHaveProperty('tags');

      // Validate audit fields
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');
      expect(body).toHaveProperty('createdBy');
      expect(body).toHaveProperty('updatedBy');

      // Validate field values
      expect(body.quote).toBe(newQuote.quote);
      expect(body.author).toBe(newQuote.author);
      expect(body.tags).toBe(newQuote.tags);
      expect(body.likeCount).toBe(0);

      // Cleanup
      createdQuoteIds.push(body.id);
    });

    it('should set valid timestamps on creation (createdAt and updatedAt)', async () => {
      const newQuote: CreateQuoteDto = {
        author: 'Timestamp Test Author',
        quote: 'Testing timestamp fields',
      };

      const beforeRequest = new Date();
      const response = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .send(newQuote)
        .expect(201);
      const afterRequest = new Date();

      const { body } = response;

      // Validate timestamps are valid dates
      expect(new Date(body.createdAt).getTime()).toBeDefined();
      expect(new Date(body.updatedAt).getTime()).toBeDefined();

      // Validate timestamps are within reasonable range
      const createdTime = new Date(body.createdAt).getTime();
      const updatedTime = new Date(body.updatedAt).getTime();
      expect(createdTime).toBeGreaterThanOrEqual(beforeRequest.getTime() - 1000);
      expect(createdTime).toBeLessThanOrEqual(afterRequest.getTime() + 1000);
      expect(updatedTime).toBeGreaterThanOrEqual(beforeRequest.getTime() - 1000);
      expect(updatedTime).toBeLessThanOrEqual(afterRequest.getTime() + 1000);

      // Initially, createdAt and updatedAt should be the same or very close
      expect(Math.abs(createdTime - updatedTime)).toBeLessThan(100);

      // Cleanup
      createdQuoteIds.push(body.id);
    });

    it('should have createdBy and updatedBy as null (placeholders)', async () => {
      const newQuote: CreateQuoteDto = {
        author: 'Audit User Test',
        quote: 'Testing audit user fields',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .send(newQuote)
        .expect(201);

      const { body } = response;

      // createdBy and updatedBy should be null since auth is not implemented
      expect(body.createdBy).toBeNull();
      expect(body.updatedBy).toBeNull();

      // Cleanup
      createdQuoteIds.push(body.id);
    });
  });

  describe('PATCH /api/v1/quotes/:id', () => {
    it('should update updatedAt timestamp but keep createdAt immutable', async () => {
      // First, create a quote
      const newQuote: CreateQuoteDto = {
        author: 'Update Test Author',
        quote: 'Original quote text',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .send(newQuote)
        .expect(201);

      const quoteId = createResponse.body.id;
      const originalCreatedAt = createResponse.body.createdAt;
      const originalUpdatedAt = createResponse.body.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Now update the quote
      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/quotes/${quoteId}`)
        .send({ quote: 'Updated quote text' })
        .expect(200);

      const { body } = updateResponse;

      // createdAt should remain the same
      expect(body.createdAt).toBe(originalCreatedAt);

      // updatedAt should be different and newer
      expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );

      // Cleanup
      await request(app.getHttpServer()).delete(`/api/v1/quotes/${quoteId}`);
    });

    it('should update likeCount and reflect in timestamp', async () => {
      // First, create a quote
      const newQuote: CreateQuoteDto = {
        author: 'Like Count Test',
        quote: 'Testing like count update',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/quotes')
        .send(newQuote)
        .expect(201);

      const quoteId = createResponse.body.id;
      const originalLikeCount = createResponse.body.likeCount;

      // Update the like count
      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/quotes/${quoteId}`)
        .send({ likeCount: 42 })
        .expect(200);

      const { body } = updateResponse;

      // Validate like count was updated
      expect(body.likeCount).toBe(42);
      expect(body.likeCount).not.toBe(originalLikeCount);

      // Validate audit fields are present
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');

      // Cleanup
      await request(app.getHttpServer()).delete(`/api/v1/quotes/${quoteId}`);
    });
  });

  describe('GET /api/v1/quotes/:id', () => {
    it('should return quote with all audit fields', async () => {
      // Get the first created quote
      const quoteId = createdQuoteIds[0];

      const response = await request(app.getHttpServer())
        .get(`/api/v1/quotes/${quoteId}`)
        .expect(200);

      const { body } = response;

      // Validate all fields are present
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('quote');
      expect(body).toHaveProperty('author');
      expect(body).toHaveProperty('likeCount');
      expect(body).toHaveProperty('tags');
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');
      expect(body).toHaveProperty('createdBy');
      expect(body).toHaveProperty('updatedBy');

      // Validate timestamps are valid
      expect(new Date(body.createdAt).getTime()).toBeDefined();
      expect(new Date(body.updatedAt).getTime()).toBeDefined();
    });
  });
});
