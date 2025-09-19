import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRepository } from './quote.repository';
import { Quote } from '../entities/quote.entity';

describe('QuoteRepository', () => {
  let repository: QuoteRepository;
  let mockRepository: jest.Mocked<Repository<Quote>>;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRepository,
        {
          provide: getRepositoryToken(Quote),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<QuoteRepository>(QuoteRepository);
    mockRepository = module.get(getRepositoryToken(Quote));
  });

  describe('findAll', () => {
    it('should return all quotes ordered by created_at DESC', async () => {
      const mockQuotes = [
        { id: '1', quote: 'Test quote 1', author: 'Author 1' } as Quote,
        { id: '2', quote: 'Test quote 2', author: 'Author 2' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(mockQuotes);
    });
  });

  describe('findById', () => {
    it('should return a quote by id', async () => {
      const mockQuote = { id: '1', quote: 'Test quote', author: 'Author' } as Quote;
      mockRepository.findOne.mockResolvedValue(mockQuote);

      const result = await repository.findById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockQuote);
    });

    it('should return null if quote not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new quote', async () => {
      const quoteData = { quote: 'Test quote', author: 'Author' };
      const createdQuote = { id: '1', ...quoteData } as Quote;
      const savedQuote = { id: '1', ...quoteData, like_count: 0 } as Quote;

      mockRepository.create.mockReturnValue(createdQuote);
      mockRepository.save.mockResolvedValue(savedQuote);

      const result = await repository.create(quoteData);

      expect(mockRepository.create).toHaveBeenCalledWith(quoteData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdQuote);
      expect(result).toEqual(savedQuote);
    });
  });

  describe('update', () => {
    it('should update a quote and return the updated quote', async () => {
      const updateData = { quote: 'Updated quote' };
      const updatedQuote = { id: '1', quote: 'Updated quote', author: 'Author' } as Quote;

      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValue(updatedQuote);

      const result = await repository.update('1', updateData);

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(updatedQuote);
    });
  });

  describe('delete', () => {
    it('should delete a quote and return true', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false if quote not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('incrementLikeCount', () => {
    it('should increment like count and return updated quote', async () => {
      const existingQuote = { id: '1', like_count: 5 } as Quote;
      const updatedQuote = { id: '1', like_count: 6 } as Quote;

      mockRepository.findOne.mockResolvedValue(existingQuote);
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValueOnce(existingQuote).mockResolvedValueOnce(updatedQuote);

      const result = await repository.incrementLikeCount('1');

      expect(mockRepository.update).toHaveBeenCalledWith('1', { like_count: 6 });
      expect(result).toEqual(updatedQuote);
    });

    it('should return null if quote not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.incrementLikeCount('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('decrementLikeCount', () => {
    it('should decrement like count and return updated quote', async () => {
      const existingQuote = { id: '1', like_count: 5 } as Quote;
      const updatedQuote = { id: '1', like_count: 4 } as Quote;

      mockRepository.findOne.mockResolvedValue(existingQuote);
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValueOnce(existingQuote).mockResolvedValueOnce(updatedQuote);

      const result = await repository.decrementLikeCount('1');

      expect(mockRepository.update).toHaveBeenCalledWith('1', { like_count: 4 });
      expect(result).toEqual(updatedQuote);
    });

    it('should not allow negative like count', async () => {
      const existingQuote = { id: '1', like_count: 0 } as Quote;
      const updatedQuote = { id: '1', like_count: 0 } as Quote;

      mockRepository.findOne.mockResolvedValue(existingQuote);
      mockRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockRepository.findOne.mockResolvedValueOnce(existingQuote).mockResolvedValueOnce(updatedQuote);

      const result = await repository.decrementLikeCount('1');

      expect(mockRepository.update).toHaveBeenCalledWith('1', { like_count: 0 });
      expect(result).toEqual(updatedQuote);
    });
  });

  describe('findAllTags', () => {
    it('should return unique sorted tags', async () => {
      const mockQuotes = [
        { tags: 'tag1;tag2' } as Quote,
        { tags: 'tag2;tag3' } as Quote,
        { tags: 'TAG1;TAG4' } as Quote, // Test case sensitivity
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
    });

    it('should handle empty tags', async () => {
      const mockQuotes = [
        { tags: 'tag1;tag2' } as Quote,
        { tags: '' } as Quote,
        { tags: null } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2']);
    });

    it('should handle whitespace-only tags', async () => {
      const mockQuotes = [
        { tags: 'tag1;tag2' } as Quote,
        { tags: '   ;  ;  ' } as Quote, // Whitespace-only tags
        { tags: 'tag3;   ;tag4' } as Quote, // Mixed with whitespace
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
    });

    it('should handle multiple consecutive semicolons', async () => {
      const mockQuotes = [
        { tags: 'tag1;;tag2' } as Quote,
        { tags: 'tag3;;;tag4' } as Quote,
        { tags: 'tag5;;;;tag6' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']);
    });

    it('should handle trailing semicolons', async () => {
      const mockQuotes = [
        { tags: 'tag1;tag2;' } as Quote,
        { tags: 'tag3;;' } as Quote,
        { tags: 'tag4;tag5;;;' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
    });

    it('should handle leading semicolons', async () => {
      const mockQuotes = [
        { tags: ';tag1;tag2' } as Quote,
        { tags: ';;tag3' } as Quote,
        { tags: ';;;tag4;tag5' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5']);
    });

    it('should handle tags with leading and trailing whitespace', async () => {
      const mockQuotes = [
        { tags: ' tag1 ; tag2 ' } as Quote,
        { tags: '  tag3  ;  tag4  ' } as Quote,
        { tags: 'TAG5 ; TAG6 ' } as Quote, // Mixed case with whitespace
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']);
    });

    it('should handle duplicate tags across different quotes', async () => {
      const mockQuotes = [
        { tags: 'tag1;tag2' } as Quote,
        { tags: 'tag2;tag3' } as Quote,
        { tags: 'tag1;tag3' } as Quote,
        { tags: 'TAG1;TAG2' } as Quote, // Same tags in different case
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle duplicate tags within the same quote', async () => {
      const mockQuotes = [
        { tags: 'tag1;tag1;tag2' } as Quote,
        { tags: 'tag2;tag3;tag2' } as Quote,
        { tags: 'TAG1;tag1;TAG2' } as Quote, // Mixed case duplicates
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle quotes with only semicolons', async () => {
      const mockQuotes = [
        { tags: ';' } as Quote,
        { tags: ';;' } as Quote,
        { tags: ';;;' } as Quote,
        { tags: 'tag1;tag2' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2']);
    });

    it('should handle mixed edge cases', async () => {
      const mockQuotes = [
        { tags: ' tag1 ; ; tag2 ;' } as Quote, // Leading/trailing whitespace, empty tags, trailing semicolon
        { tags: ';;TAG1;;tag2;;' } as Quote, // Leading/trailing semicolons, mixed case
        { tags: '   ;  ;  ' } as Quote, // Only whitespace
        { tags: null } as Quote, // Null tags
        { tags: '' } as Quote, // Empty string
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2']);
    });

    it('should return empty array when no valid tags exist', async () => {
      const mockQuotes = [
        { tags: '' } as Quote,
        { tags: null } as Quote,
        { tags: '   ' } as Quote,
        { tags: ';;;' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual([]);
    });

    it('should handle single tag without semicolons', async () => {
      const mockQuotes = [
        { tags: 'tag1' } as Quote,
        { tags: 'TAG2' } as Quote,
        { tags: ' tag3 ' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should perform tag normalization efficiently with large datasets', async () => {
      // Create a large dataset to test performance
      const mockQuotes = Array.from({ length: 1000 }, (_, i) => ({
        tags: `tag${i % 50};tag${(i + 1) % 50};tag${(i + 2) % 50}`, // 50 unique tags
      })) as Quote[];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const startTime = Date.now();
      const result = await repository.findAllTags();
      const endTime = Date.now();

      // Should complete within reasonable time (less than 100ms for 1000 records)
      expect(endTime - startTime).toBeLessThan(100);
      
      // Should return normalized, deduplicated results
      expect(result).toHaveLength(50); // 50 unique tags
      expect(result).toEqual(expect.arrayContaining(['tag0', 'tag49']));
      expect(result).toEqual(expect.arrayContaining(['tag0', 'tag1', 'tag2']));
    });
  });

  describe('findAllAuthors', () => {
    it('should return unique sorted authors', async () => {
      const mockQuotes = [
        { author: 'Author B' } as Quote,
        { author: 'Author A' } as Quote,
        { author: 'Author B' } as Quote, // Duplicate
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      expect(result).toEqual(['Author A', 'Author B']);
    });

    it('should handle authors with leading and trailing whitespace', async () => {
      const mockQuotes = [
        { author: ' Author A ' } as Quote,
        { author: '  Author B  ' } as Quote,
        { author: 'Author C' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      expect(result).toEqual(['Author A', 'Author B', 'Author C']);
    });

    it('should handle case-insensitive author deduplication', async () => {
      const mockQuotes = [
        { author: 'John Doe' } as Quote,
        { author: 'john doe' } as Quote,
        { author: 'JOHN DOE' } as Quote,
        { author: 'Jane Smith' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      // Case-insensitive deduplication preserves the first occurrence's case
      expect(result).toEqual(['Jane Smith', 'John Doe']);
    });

    it('should handle empty author names', async () => {
      const mockQuotes = [
        { author: 'Author A' } as Quote,
        { author: '' } as Quote,
        { author: '   ' } as Quote, // Whitespace-only
        { author: 'Author B' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      expect(result).toEqual(['Author A', 'Author B']);
    });

    it('should handle duplicate authors with different whitespace', async () => {
      const mockQuotes = [
        { author: 'Author A' } as Quote,
        { author: ' Author A ' } as Quote,
        { author: '  Author A  ' } as Quote,
        { author: 'Author B' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      expect(result).toEqual(['Author A', 'Author B']);
    });

    it('should return empty array when no valid authors exist', async () => {
      const mockQuotes = [
        { author: '' } as Quote,
        { author: '   ' } as Quote,
        { author: '' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      expect(result).toEqual([]);
    });

    it('should handle mixed case authors', async () => {
      const mockQuotes = [
        { author: 'albert einstein' } as Quote,
        { author: 'Albert Einstein' } as Quote,
        { author: 'ALBERT EINSTEIN' } as Quote,
        { author: 'Marie Curie' } as Quote,
      ];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const result = await repository.findAllAuthors();

      // Case-insensitive deduplication preserves first occurrence's case
      expect(result).toEqual(['Marie Curie', 'albert einstein']);
    });

    it('should perform normalization efficiently with large datasets', async () => {
      // Create a large dataset to test performance
      const mockQuotes = Array.from({ length: 1000 }, (_, i) => ({
        author: `Author ${i % 100}`, // 100 unique authors
        tags: `tag${i % 50} tag${(i + 1) % 50}`, // 50 unique tags
      })) as Quote[];

      mockRepository.find.mockResolvedValue(mockQuotes);

      const startTime = Date.now();
      const result = await repository.findAllAuthors();
      const endTime = Date.now();

      // Should complete within reasonable time (less than 100ms for 1000 records)
      expect(endTime - startTime).toBeLessThan(100);
      
      // Should return deduplicated results
      expect(result).toHaveLength(100); // 100 unique authors
      expect(result).toEqual(expect.arrayContaining(['Author 0', 'Author 99']));
    });
  });
});
