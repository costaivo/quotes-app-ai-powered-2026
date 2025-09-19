import { Test, TestingModule } from '@nestjs/testing';
import { QuotesController } from '../quotes.controller';
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../entities/quote.entity';

describe('QuotesController', () => {
  let controller: QuotesController;
  let service: QuoteService;

  const mockQuoteService = {
    getAllQuotes: jest.fn(),
    getQuoteById: jest.fn(),
    createQuote: jest.fn(),
    updateQuote: jest.fn(),
    deleteQuote: jest.fn(),
    getAllTags: jest.fn(),
    getAllAuthors: jest.fn(),
    likeQuote: jest.fn(),
    unlikeQuote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        {
          provide: QuoteService,
          useValue: mockQuoteService,
        },
      ],
    }).compile();

    controller = module.get<QuotesController>(QuotesController);
    service = module.get<QuoteService>(QuoteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllQuotes', () => {
    it('should return all quotes', async () => {
      const quotes = [
        { id: '1', quote: 'Quote 1', author: 'Author 1', tags: 'tag1', like_count: 0 },
        { id: '2', quote: 'Quote 2', author: 'Author 2', tags: 'tag2', like_count: 1 },
      ] as Quote[];

      mockQuoteService.getAllQuotes.mockResolvedValue(quotes);

      const result = await controller.getAllQuotes();

      expect(service.getAllQuotes).toHaveBeenCalled();
      expect(result).toEqual(quotes);
    });
  });

  describe('getQuoteById', () => {
    it('should return a quote by id', async () => {
      const quote = { id: '1', quote: 'Test quote', author: 'Test Author', tags: 'test', like_count: 0 } as Quote;

      mockQuoteService.getQuoteById.mockResolvedValue(quote);

      const result = await controller.getQuoteById('1');

      expect(service.getQuoteById).toHaveBeenCalledWith('1');
      expect(result).toEqual(quote);
    });
  });

  describe('createQuote', () => {
    it('should create a new quote', async () => {
      const createQuoteDto = { quote: 'New quote', author: 'New Author', tags: 'new' };
      const createdQuote = { id: '1', ...createQuoteDto, like_count: 0 } as Quote;

      mockQuoteService.createQuote.mockResolvedValue(createdQuote);

      const result = await controller.createQuote(createQuoteDto);

      expect(service.createQuote).toHaveBeenCalledWith(createQuoteDto);
      expect(result).toEqual(createdQuote);
    });
  });

  describe('updateQuote', () => {
    it('should update a quote', async () => {
      const updateQuoteDto = { quote: 'Updated quote' };
      const updatedQuote = { id: '1', quote: 'Updated quote', author: 'Author', tags: 'tag', like_count: 0 } as Quote;

      mockQuoteService.updateQuote.mockResolvedValue(updatedQuote);

      const result = await controller.updateQuote('1', updateQuoteDto);

      expect(service.updateQuote).toHaveBeenCalledWith('1', updateQuoteDto);
      expect(result).toEqual(updatedQuote);
    });
  });

  describe('deleteQuote', () => {
    it('should delete a quote', async () => {
      mockQuoteService.deleteQuote.mockResolvedValue(undefined);

      await controller.deleteQuote('1');

      expect(service.deleteQuote).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      const tags = ['tag1', 'tag2', 'tag3'];

      mockQuoteService.getAllTags.mockResolvedValue(tags);

      const result = await controller.getAllTags();

      expect(service.getAllTags).toHaveBeenCalled();
      expect(result).toEqual(tags);
    });
  });

  describe('getAllAuthors', () => {
    it('should return all authors', async () => {
      const authors = ['Author 1', 'Author 2', 'Author 3'];

      mockQuoteService.getAllAuthors.mockResolvedValue(authors);

      const result = await controller.getAllAuthors();

      expect(service.getAllAuthors).toHaveBeenCalled();
      expect(result).toEqual(authors);
    });
  });

  describe('likeQuote', () => {
    it('should like a quote and return updated quote', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedQuote = {
        id: quoteId,
        quote: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        tags: 'inspiration work passion',
        like_count: 5,
        created_at: new Date('2024-01-15T10:30:00Z'),
        updated_at: new Date('2024-01-15T10:30:00Z')
      } as Quote;

      mockQuoteService.likeQuote.mockResolvedValue(updatedQuote);

      const result = await controller.likeQuote(quoteId);

      expect(service.likeQuote).toHaveBeenCalledWith(quoteId);
      expect(result).toEqual(updatedQuote);
    });

    it('should handle like request for non-existent quote', async () => {
      const quoteId = 'nonexistent-id';
      const error = new Error('Quote with ID nonexistent-id not found');

      mockQuoteService.likeQuote.mockRejectedValue(error);

      await expect(controller.likeQuote(quoteId)).rejects.toThrow(error);
      expect(service.likeQuote).toHaveBeenCalledWith(quoteId);
    });

    it('should handle like request with invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';
      const error = new Error('Invalid UUID format');

      mockQuoteService.likeQuote.mockRejectedValue(error);

      await expect(controller.likeQuote(invalidId)).rejects.toThrow(error);
      expect(service.likeQuote).toHaveBeenCalledWith(invalidId);
    });

    it('should handle concurrent like requests', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedQuote = {
        id: quoteId,
        quote: 'Test quote',
        author: 'Test Author',
        tags: 'test',
        like_count: 3,
        created_at: new Date(),
        updated_at: new Date()
      } as Quote;

      mockQuoteService.likeQuote.mockResolvedValue(updatedQuote);

      // Simulate concurrent requests
      const promises = Array.from({ length: 5 }, () => controller.likeQuote(quoteId));
      const results = await Promise.all(promises);

      expect(service.likeQuote).toHaveBeenCalledTimes(5);
      results.forEach(result => {
        expect(result).toEqual(updatedQuote);
      });
    });
  });

  describe('unlikeQuote', () => {
    it('should unlike a quote and return updated quote', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedQuote = {
        id: quoteId,
        quote: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        tags: 'inspiration work passion',
        like_count: 4,
        created_at: new Date('2024-01-15T10:30:00Z'),
        updated_at: new Date('2024-01-15T10:30:00Z')
      } as Quote;

      mockQuoteService.unlikeQuote.mockResolvedValue(updatedQuote);

      const result = await controller.unlikeQuote(quoteId);

      expect(service.unlikeQuote).toHaveBeenCalledWith(quoteId);
      expect(result).toEqual(updatedQuote);
    });

    it('should handle unlike request for non-existent quote', async () => {
      const quoteId = 'nonexistent-id';
      const error = new Error('Quote with ID nonexistent-id not found');

      mockQuoteService.unlikeQuote.mockRejectedValue(error);

      await expect(controller.unlikeQuote(quoteId)).rejects.toThrow(error);
      expect(service.unlikeQuote).toHaveBeenCalledWith(quoteId);
    });

    it('should handle unlike request with invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';
      const error = new Error('Invalid UUID format');

      mockQuoteService.unlikeQuote.mockRejectedValue(error);

      await expect(controller.unlikeQuote(invalidId)).rejects.toThrow(error);
      expect(service.unlikeQuote).toHaveBeenCalledWith(invalidId);
    });

    it('should handle unlike request when like_count is already 0', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedQuote = {
        id: quoteId,
        quote: 'Test quote',
        author: 'Test Author',
        tags: 'test',
        like_count: 0, // Already at 0, should remain 0
        created_at: new Date(),
        updated_at: new Date()
      } as Quote;

      mockQuoteService.unlikeQuote.mockResolvedValue(updatedQuote);

      const result = await controller.unlikeQuote(quoteId);

      expect(service.unlikeQuote).toHaveBeenCalledWith(quoteId);
      expect(result).toEqual(updatedQuote);
      expect(result.like_count).toBe(0);
    });

    it('should handle concurrent unlike requests', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedQuote = {
        id: quoteId,
        quote: 'Test quote',
        author: 'Test Author',
        tags: 'test',
        like_count: 2,
        created_at: new Date(),
        updated_at: new Date()
      } as Quote;

      mockQuoteService.unlikeQuote.mockResolvedValue(updatedQuote);

      // Simulate concurrent requests
      const promises = Array.from({ length: 3 }, () => controller.unlikeQuote(quoteId));
      const results = await Promise.all(promises);

      expect(service.unlikeQuote).toHaveBeenCalledTimes(3);
      results.forEach(result => {
        expect(result).toEqual(updatedQuote);
      });
    });
  });
});
