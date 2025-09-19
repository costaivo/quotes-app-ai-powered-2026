import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteRepository } from '../repositories/quote.repository';
import { Quote } from '../entities/quote.entity';

describe('QuoteService', () => {
  let service: QuoteService;
  let mockRepository: jest.Mocked<QuoteRepository>;

  beforeEach(async () => {
    const mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementLikeCount: jest.fn(),
      decrementLikeCount: jest.fn(),
      findAllTags: jest.fn(),
      findAllAuthors: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: QuoteRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    mockRepository = module.get(QuoteRepository);
  });

  describe('getAllQuotes', () => {
    it('should return all quotes', async () => {
      const mockQuotes = [
        { id: '1', quote: 'Test quote 1', author: 'Author 1' } as Quote,
        { id: '2', quote: 'Test quote 2', author: 'Author 2' } as Quote,
      ];

      mockRepository.findAll.mockResolvedValue(mockQuotes);

      const result = await service.getAllQuotes();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockQuotes);
    });
  });

  describe('getQuoteById', () => {
    it('should return a quote by id', async () => {
      const mockQuote = { id: '1', quote: 'Test quote', author: 'Author' } as Quote;
      mockRepository.findById.mockResolvedValue(mockQuote);

      const result = await service.getQuoteById('1');

      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockQuote);
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getQuoteById('nonexistent')).rejects.toThrow(
        new NotFoundException('Quote with ID nonexistent not found')
      );
    });
  });

  describe('createQuote', () => {
    it('should create a new quote with valid data', async () => {
      const quoteData = { quote: 'Test quote', author: 'Author', tags: 'tag1;tag2' };
      const createdQuote = { id: '1', ...quoteData, like_count: 0 } as Quote;

      mockRepository.create.mockResolvedValue(createdQuote);

      const result = await service.createQuote(quoteData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        quote: 'Test quote',
        author: 'Author',
        tags: 'tag1;tag2',
        like_count: 0,
      });
      expect(result).toEqual(createdQuote);
    });

    it('should create a quote without tags', async () => {
      const quoteData = { quote: 'Test quote', author: 'Author' };
      const createdQuote = { id: '1', ...quoteData, like_count: 0 } as Quote;

      mockRepository.create.mockResolvedValue(createdQuote);

      const result = await service.createQuote(quoteData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        quote: 'Test quote',
        author: 'Author',
        tags: null,
        like_count: 0,
      });
      expect(result).toEqual(createdQuote);
    });

    // Note: Validation is now handled by DTOs at the controller level

    it('should trim whitespace from input', async () => {
      const quoteData = { quote: '  Test quote  ', author: '  Author  ', tags: '  tag1;tag2  ' };
      const createdQuote = { id: '1', quote: 'Test quote', author: 'Author', tags: 'tag1;tag2', like_count: 0 } as Quote;

      mockRepository.create.mockResolvedValue(createdQuote);

      await service.createQuote(quoteData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        quote: 'Test quote',
        author: 'Author',
        tags: 'tag1;tag2',
        like_count: 0,
      });
    });
  });

  describe('updateQuote', () => {
    it('should update a quote with valid data', async () => {
      const existingQuote = { id: '1', quote: 'Old quote', author: 'Author' } as Quote;
      const updatedQuote = { id: '1', quote: 'New quote', author: 'Author' } as Quote;

      mockRepository.findById.mockResolvedValue(existingQuote);
      mockRepository.update.mockResolvedValue(updatedQuote);

      const result = await service.updateQuote('1', { quote: 'New quote' });

      expect(mockRepository.update).toHaveBeenCalledWith('1', { quote: 'New quote' });
      expect(result).toEqual(updatedQuote);
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateQuote('nonexistent', { quote: 'New quote' })).rejects.toThrow(
        new NotFoundException('Quote with ID nonexistent not found')
      );
    });

    // Note: Validation is now handled by DTOs at the controller level
  });

  describe('deleteQuote', () => {
    it('should delete a quote', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.deleteQuote('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.deleteQuote('nonexistent')).rejects.toThrow(
        new NotFoundException('Quote with ID nonexistent not found')
      );
    });
  });

  describe('likeQuote', () => {
    it('should increment like count', async () => {
      const updatedQuote = { id: '1', like_count: 6 } as Quote;
      mockRepository.incrementLikeCount.mockResolvedValue(updatedQuote);

      const result = await service.likeQuote('1');

      expect(mockRepository.incrementLikeCount).toHaveBeenCalledWith('1');
      expect(result).toEqual(updatedQuote);
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockRepository.incrementLikeCount.mockResolvedValue(null);

      await expect(service.likeQuote('nonexistent')).rejects.toThrow(
        new NotFoundException('Quote with ID nonexistent not found')
      );
    });
  });

  describe('unlikeQuote', () => {
    it('should decrement like count', async () => {
      const updatedQuote = { id: '1', like_count: 4 } as Quote;
      mockRepository.decrementLikeCount.mockResolvedValue(updatedQuote);

      const result = await service.unlikeQuote('1');

      expect(mockRepository.decrementLikeCount).toHaveBeenCalledWith('1');
      expect(result).toEqual(updatedQuote);
    });

    it('should throw NotFoundException if quote not found', async () => {
      mockRepository.decrementLikeCount.mockResolvedValue(null);

      await expect(service.unlikeQuote('nonexistent')).rejects.toThrow(
        new NotFoundException('Quote with ID nonexistent not found')
      );
    });

    it('should handle unlike when like_count is already 0', async () => {
      const updatedQuote = { id: '1', like_count: 0 } as Quote;
      mockRepository.decrementLikeCount.mockResolvedValue(updatedQuote);

      const result = await service.unlikeQuote('1');

      expect(mockRepository.decrementLikeCount).toHaveBeenCalledWith('1');
      expect(result).toEqual(updatedQuote);
      expect(result.like_count).toBe(0);
    });
  });

  describe('Concurrency Tests', () => {
    describe('likeQuote concurrency', () => {
      it('should handle multiple simultaneous like requests', async () => {
        const quoteId = '1';
        const initialLikeCount = 5;
        const updatedQuote = { id: quoteId, like_count: initialLikeCount + 1 } as Quote;
        
        mockRepository.incrementLikeCount.mockResolvedValue(updatedQuote);

        // Simulate 10 concurrent like requests
        const promises = Array.from({ length: 10 }, () => service.likeQuote(quoteId));
        const results = await Promise.all(promises);

        // All requests should succeed
        expect(results).toHaveLength(10);
        results.forEach(result => {
          expect(result).toEqual(updatedQuote);
        });

        // Repository method should be called 10 times
        expect(mockRepository.incrementLikeCount).toHaveBeenCalledTimes(10);
        expect(mockRepository.incrementLikeCount).toHaveBeenCalledWith(quoteId);
      });

      it('should handle mixed like/unlike concurrent requests', async () => {
        const quoteId = '1';
        const likeResult = { id: quoteId, like_count: 6 } as Quote;
        const unlikeResult = { id: quoteId, like_count: 4 } as Quote;
        
        mockRepository.incrementLikeCount.mockResolvedValue(likeResult);
        mockRepository.decrementLikeCount.mockResolvedValue(unlikeResult);

        // Simulate mixed concurrent requests
        const likePromises = Array.from({ length: 3 }, () => service.likeQuote(quoteId));
        const unlikePromises = Array.from({ length: 2 }, () => service.unlikeQuote(quoteId));
        
        const [likeResults, unlikeResults] = await Promise.all([
          Promise.all(likePromises),
          Promise.all(unlikePromises)
        ]);

        // All like requests should succeed
        expect(likeResults).toHaveLength(3);
        likeResults.forEach(result => {
          expect(result).toEqual(likeResult);
        });

        // All unlike requests should succeed
        expect(unlikeResults).toHaveLength(2);
        unlikeResults.forEach(result => {
          expect(result).toEqual(unlikeResult);
        });

        // Verify method calls
        expect(mockRepository.incrementLikeCount).toHaveBeenCalledTimes(3);
        expect(mockRepository.decrementLikeCount).toHaveBeenCalledTimes(2);
      });

      it('should handle concurrent requests with some failures', async () => {
        const quoteId = '1';
        const successResult = { id: quoteId, like_count: 6 } as Quote;
        const error = new NotFoundException('Quote with ID 1 not found');
        
        // Mock some successes and some failures
        mockRepository.incrementLikeCount
          .mockResolvedValueOnce(successResult)
          .mockResolvedValueOnce(successResult)
          .mockResolvedValueOnce(null) // Simulate quote not found
          .mockResolvedValueOnce(successResult);

        const promises = Array.from({ length: 4 }, () => service.likeQuote(quoteId));
        
        // Some should succeed, one should fail
        const results = await Promise.allSettled(promises);
        
        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');
        
        expect(successful).toHaveLength(3);
        expect(failed).toHaveLength(1);
        
        // Check that the failed request throws the correct error
        if (failed[0].status === 'rejected') {
          expect(failed[0].reason).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('unlikeQuote concurrency', () => {
      it('should handle multiple simultaneous unlike requests', async () => {
        const quoteId = '1';
        const initialLikeCount = 10;
        const updatedQuote = { id: quoteId, like_count: initialLikeCount - 1 } as Quote;
        
        mockRepository.decrementLikeCount.mockResolvedValue(updatedQuote);

        // Simulate 5 concurrent unlike requests
        const promises = Array.from({ length: 5 }, () => service.unlikeQuote(quoteId));
        const results = await Promise.all(promises);

        // All requests should succeed
        expect(results).toHaveLength(5);
        results.forEach(result => {
          expect(result).toEqual(updatedQuote);
        });

        // Repository method should be called 5 times
        expect(mockRepository.decrementLikeCount).toHaveBeenCalledTimes(5);
        expect(mockRepository.decrementLikeCount).toHaveBeenCalledWith(quoteId);
      });

      it('should handle unlike requests when like_count reaches 0', async () => {
        const quoteId = '1';
        const zeroLikeQuote = { id: quoteId, like_count: 0 } as Quote;
        
        mockRepository.decrementLikeCount.mockResolvedValue(zeroLikeQuote);

        // Simulate unlike requests when count is already 0
        const promises = Array.from({ length: 3 }, () => service.unlikeQuote(quoteId));
        const results = await Promise.all(promises);

        // All requests should succeed and like_count should remain 0
        expect(results).toHaveLength(3);
        results.forEach(result => {
          expect(result).toEqual(zeroLikeQuote);
          expect(result.like_count).toBe(0);
        });
      });
    });

    describe('Edge cases and boundary conditions', () => {
      it('should handle like_count never going negative under any conditions', async () => {
        const quoteId = '1';
        const zeroLikeQuote = { id: quoteId, like_count: 0 } as Quote;
        
        mockRepository.decrementLikeCount.mockResolvedValue(zeroLikeQuote);

        // Try to unlike a quote with 0 likes multiple times
        const promises = Array.from({ length: 10 }, () => service.unlikeQuote(quoteId));
        const results = await Promise.all(promises);

        // All results should have like_count = 0
        results.forEach(result => {
          expect(result.like_count).toBeGreaterThanOrEqual(0);
          expect(result.like_count).toBe(0);
        });
      });

      it('should handle rapid like/unlike cycles', async () => {
        const quoteId = '1';
        const likeResult = { id: quoteId, like_count: 1 } as Quote;
        const unlikeResult = { id: quoteId, like_count: 0 } as Quote;
        
        mockRepository.incrementLikeCount.mockResolvedValue(likeResult);
        mockRepository.decrementLikeCount.mockResolvedValue(unlikeResult);

        // Simulate rapid like/unlike cycles
        const operations = [];
        for (let i = 0; i < 5; i++) {
          operations.push(service.likeQuote(quoteId));
          operations.push(service.unlikeQuote(quoteId));
        }

        const results = await Promise.all(operations);

        // Should have 10 results (5 likes + 5 unlikes)
        expect(results).toHaveLength(10);
        
        // Verify method calls
        expect(mockRepository.incrementLikeCount).toHaveBeenCalledTimes(5);
        expect(mockRepository.decrementLikeCount).toHaveBeenCalledTimes(5);
      });
    });
  });

  describe('getAllTags', () => {
    it('should return all unique tags', async () => {
      const mockTags = ['tag1', 'tag2', 'tag3'];
      mockRepository.findAllTags.mockResolvedValue(mockTags);

      const result = await service.getAllTags();

      expect(mockRepository.findAllTags).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
    });
  });

  describe('getAllAuthors', () => {
    it('should return all unique authors', async () => {
      const mockAuthors = ['Author A', 'Author B', 'Author C'];
      mockRepository.findAllAuthors.mockResolvedValue(mockAuthors);

      const result = await service.getAllAuthors();

      expect(mockRepository.findAllAuthors).toHaveBeenCalled();
      expect(result).toEqual(mockAuthors);
    });
  });
});
