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

    it('should throw BadRequestException for missing quote', async () => {
      const quoteData = { quote: '', author: 'Author' };

      await expect(service.createQuote(quoteData)).rejects.toThrow(
        new BadRequestException('Quote and author are required')
      );
    });

    it('should throw BadRequestException for missing author', async () => {
      const quoteData = { quote: 'Test quote', author: '' };

      await expect(service.createQuote(quoteData)).rejects.toThrow(
        new BadRequestException('Quote and author are required')
      );
    });

    it('should throw BadRequestException for quote too long', async () => {
      const longQuote = 'A'.repeat(1001);
      const quoteData = { quote: longQuote, author: 'Author' };

      await expect(service.createQuote(quoteData)).rejects.toThrow(
        new BadRequestException('Quote must be 1000 characters or less')
      );
    });

    it('should throw BadRequestException for author too long', async () => {
      const longAuthor = 'A'.repeat(201);
      const quoteData = { quote: 'Test quote', author: longAuthor };

      await expect(service.createQuote(quoteData)).rejects.toThrow(
        new BadRequestException('Author must be 200 characters or less')
      );
    });

    it('should throw BadRequestException for tags too long', async () => {
      const longTags = 'A'.repeat(501);
      const quoteData = { quote: 'Test quote', author: 'Author', tags: longTags };

      await expect(service.createQuote(quoteData)).rejects.toThrow(
        new BadRequestException('Tags must be 500 characters or less')
      );
    });

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

    it('should throw BadRequestException for quote too long', async () => {
      const existingQuote = { id: '1', quote: 'Old quote', author: 'Author' } as Quote;
      const longQuote = 'A'.repeat(1001);

      mockRepository.findById.mockResolvedValue(existingQuote);

      await expect(service.updateQuote('1', { quote: longQuote })).rejects.toThrow(
        new BadRequestException('Quote must be 1000 characters or less')
      );
    });
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
