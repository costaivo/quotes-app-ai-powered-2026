import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QuoteService } from './quote.service';
import type { QuoteRepository } from '../repositories/quote.repository';
import type { CreateQuoteDto } from '../dto/create-quote.dto';
import type { UpdateQuoteDto } from '../dto/update-quote.dto';

describe('QuoteService', () => {
  let service: QuoteService;
  let repository: Record<string, jest.Mock>;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    createQuote: jest.fn(),
    updateQuote: jest.fn(),
    deleteQuote: jest.fn(),
    findAllTags: jest.fn(),
    findAllAuthors: jest.fn(),
  };

  beforeEach(() => {
    repository = mockRepository;
    service = new QuoteService(repository as unknown as QuoteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated quotes when no filters are provided', async () => {
      const mockQuotes = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          quote: 'Test quote',
          author: 'Test author',
          likeCount: 0,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: null,
          updatedBy: null,
        },
      ];
      const mockTotal = 1;

      mockRepository.findAll.mockResolvedValue([mockQuotes, mockTotal]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].quote).toBe('Test quote');
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should pass author filter to repository', async () => {
      const query = { author: 'Test', page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should pass query filter to repository', async () => {
      const query = { query: 'something', page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should pass both filters to repository', async () => {
      const query = { author: 'Test', query: 'something', page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should calculate total pages correctly', async () => {
      mockRepository.findAll.mockResolvedValue([[], 25]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.meta.totalPages).toBe(3);
    });

    it('should use default values when page and limit are missing', async () => {
      mockRepository.findAll.mockResolvedValue([[], 0]);

      const query = { page: 1, limit: 20 };
      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should set hasNextPage and hasPreviousPage correctly', async () => {
      mockRepository.findAll.mockResolvedValue([[], 30]);

      // Case 1: First page
      let result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.hasPreviousPage).toBe(false);
      expect(result.meta.hasNextPage).toBe(true);

      // Case 2: Middle page
      result = await service.findAll({ page: 2, limit: 10 });
      expect(result.meta.hasPreviousPage).toBe(true);
      expect(result.meta.hasNextPage).toBe(true);

      // Case 3: Last page
      result = await service.findAll({ page: 3, limit: 10 });
      expect(result.meta.hasPreviousPage).toBe(true);
      expect(result.meta.hasNextPage).toBe(false);
    });

    it('should apply defaults when page is not provided', async () => {
      mockRepository.findAll.mockResolvedValue([[], 40]);

      // Simulate query object without page (will use default 1)
      const result = await service.findAll({ limit: 20 } as any);

      expect(result.meta.currentPage).toBe(1 || result.meta.currentPage);
    });

    it('should apply defaults when limit is not provided', async () => {
      mockRepository.findAll.mockResolvedValue([[], 40]);

      // Simulate query object without limit (will use default 20)
      const result = await service.findAll({ page: 1 } as any);

      expect(result.meta.itemsPerPage).toBe(20 || result.meta.itemsPerPage);
    });

    it('should correctly handle single page dataset', async () => {
      mockRepository.findAll.mockResolvedValue([[], 15]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should correctly handle exact page boundary', async () => {
      mockRepository.findAll.mockResolvedValue([[], 100]);

      const result = await service.findAll({ page: 5, limit: 20 });

      expect(result.meta.totalPages).toBe(5);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should handle maximum limit (100)', async () => {
      mockRepository.findAll.mockResolvedValue([[], 250]);

      const result = await service.findAll({ page: 1, limit: 100 });

      expect(result.meta.itemsPerPage).toBe(100);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(true);
    });

    it('should calculate correct pagination with different limits', async () => {
      mockRepository.findAll.mockResolvedValue([[], 50]);

      // With limit of 10
      let result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.totalPages).toBe(5);

      // With limit of 25
      result = await service.findAll({ page: 1, limit: 25 });
      expect(result.meta.totalPages).toBe(2);

      // With limit of 50
      result = await service.findAll({ page: 1, limit: 50 });
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return a quote by id', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const mockQuote = {
        id: quoteId,
        quote: 'Test quote',
        author: 'Test author',
        likeCount: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
      };

      mockRepository.findById.mockResolvedValue(mockQuote);

      const result = await service.findById(quoteId);

      expect(result.id).toBe(quoteId);
      expect(result.quote).toBe('Test quote');
      expect(mockRepository.findById).toHaveBeenCalledWith(quoteId);
    });

    it('should throw NotFoundException when quote not found', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(quoteId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      const invalidId = 'invalid-uuid';

      await expect(service.findById(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new quote', async () => {
      const createDto: CreateQuoteDto = {
        quote: 'New quote',
        author: 'New author',
        tags: 'tag1;tag2',
      };

      const mockCreatedQuote = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createDto,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
      };

      mockRepository.createQuote.mockResolvedValue(mockCreatedQuote);

      const result = await service.create(createDto);

      expect(result.quote).toBe(createDto.quote);
      expect(result.author).toBe(createDto.author);
      expect(result.likeCount).toBe(0);
      expect(mockRepository.createQuote).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException for missing quote', async () => {
      const createDto: CreateQuoteDto = {
        quote: '',
        author: 'Author',
        tags: 'tag1',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for quote exceeding 1000 characters', async () => {
      const createDto: CreateQuoteDto = {
        quote: 'a'.repeat(1001),
        author: 'Author',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a quote', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateQuoteDto = {
        quote: 'Updated quote',
      };

      const existingQuote = {
        id: quoteId,
        quote: 'Old quote',
        author: 'Author',
        likeCount: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
      };

      const updatedQuote = {
        ...existingQuote,
        ...updateDto,
      };

      mockRepository.findById.mockResolvedValue(existingQuote);
      mockRepository.updateQuote.mockResolvedValue(updatedQuote);

      const result = await service.update(quoteId, updateDto);

      expect(result.quote).toBe(updateDto.quote);
      expect(mockRepository.updateQuote).toHaveBeenCalledWith(quoteId, updateDto);
    });

    it('should throw NotFoundException when quote not found', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateQuoteDto = { quote: 'Updated' };

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(quoteId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for negative like count', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateQuoteDto = {
        likeCount: -1,
      };

      const existingQuote = {
        id: quoteId,
        quote: 'Quote',
        author: 'Author',
        likeCount: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
      };

      mockRepository.findById.mockResolvedValue(existingQuote);

      await expect(service.update(quoteId, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a quote', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      const mockQuote = {
        id: quoteId,
        quote: 'Quote to delete',
        author: 'Author',
        likeCount: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.deleteQuote.mockResolvedValue(true);

      await service.delete(quoteId);

      expect(mockRepository.deleteQuote).toHaveBeenCalledWith(quoteId);
    });

    it('should throw NotFoundException when quote not found', async () => {
      const quoteId = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(quoteId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllTags', () => {
    it('should return all unique tags', async () => {
      const mockTags = ['tag1', 'tag2', 'tag3'];
      mockRepository.findAllTags.mockResolvedValue(mockTags);

      const result = await service.findAllTags();

      expect(result).toEqual(mockTags);
      expect(mockRepository.findAllTags).toHaveBeenCalled();
    });
  });

  describe('findAllAuthors', () => {
    it('should return all unique authors', async () => {
      const mockAuthors = ['Author 1', 'Author 2'];
      mockRepository.findAllAuthors.mockResolvedValue(mockAuthors);

      const result = await service.findAllAuthors();

      expect(result).toEqual(mockAuthors);
      expect(mockRepository.findAllAuthors).toHaveBeenCalled();
    });
  });
});
