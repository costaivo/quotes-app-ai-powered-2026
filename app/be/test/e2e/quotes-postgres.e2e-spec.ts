import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Quote } from '../../src/entities/quote.entity';
import { getCiDatabaseConfig } from '../../src/config/database.ci.config';

describe('Quotes API (PostgreSQL Integration)', () => {
  let app: INestApplication;
  let createdQuoteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...getCiDatabaseConfig(),
          // Use PostgreSQL for integration tests
          entities: [Quote],
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
  }, 30000); // Increased timeout for PostgreSQL setup

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 10000);

  describe('PostgreSQL Integration Tests', () => {
    it('should connect to PostgreSQL database successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should create quote in PostgreSQL database', async () => {
      const quoteData = {
        quote: 'Test quote for PostgreSQL integration',
        author: 'Test Author',
        tags: ['test', 'postgresql']
      };

      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send(quoteData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.quote).toBe(quoteData.quote);
      expect(response.body.data.author).toBe(quoteData.author);
      expect(response.body.data.tags).toEqual(quoteData.tags);

      createdQuoteId = response.body.data.id;
    });

    it('should retrieve quote from PostgreSQL database', async () => {
      expect(createdQuoteId).toBeDefined();

      const response = await request(app.getHttpServer())
        .get(`/quotes/${createdQuoteId}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdQuoteId);
      expect(response.body.data.quote).toBe('Test quote for PostgreSQL integration');
    });

    it('should update quote in PostgreSQL database', async () => {
      expect(createdQuoteId).toBeDefined();

      const updateData = {
        quote: 'Updated quote for PostgreSQL integration',
        author: 'Updated Author'
      };

      const response = await request(app.getHttpServer())
        .patch(`/quotes/${createdQuoteId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(createdQuoteId);
      expect(response.body.data.quote).toBe(updateData.quote);
      expect(response.body.data.author).toBe(updateData.author);
    });

    it('should handle PostgreSQL-specific data types correctly', async () => {
      const quoteData = {
        quote: 'PostgreSQL timestamp test',
        author: 'Timestamp Author',
        tags: ['timestamp', 'postgresql']
      };

      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send(quoteData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.data).toHaveProperty('updated_at');
      
      // Verify timestamps are properly formatted
      expect(new Date(response.body.data.created_at)).toBeInstanceOf(Date);
      expect(new Date(response.body.data.updated_at)).toBeInstanceOf(Date);
    });

    it('should handle concurrent operations in PostgreSQL', async () => {
      const promises = [];
      
      // Create multiple quotes concurrently
      for (let i = 0; i < 5; i++) {
        const quoteData = {
          quote: `Concurrent quote ${i}`,
          author: `Author ${i}`,
          tags: [`concurrent-${i}`]
        };
        
        promises.push(
          request(app.getHttpServer())
            .post('/quotes')
            .send(quoteData)
            .expect(201)
        );
      }

      const responses = await Promise.all(promises);
      
      // Verify all quotes were created successfully
      responses.forEach((response, index) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.quote).toBe(`Concurrent quote ${index}`);
        expect(response.body.data.author).toBe(`Author ${index}`);
      });
    });

    it('should clean up test data', async () => {
      expect(createdQuoteId).toBeDefined();

      await request(app.getHttpServer())
        .delete(`/quotes/${createdQuoteId}`)
        .expect(204);
    });
  });
});
