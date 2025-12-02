import { NotFoundException, BadRequestException } from "@nestjs/common";
import { QuoteService } from "./quote.service";
import type { QuoteRepository } from "../repositories/quote.repository";
import type { CreateQuoteDto } from "../dto/create-quote.dto";
import type { UpdateQuoteDto } from "../dto/update-quote.dto";

describe("QuoteService", () => {
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

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated quotes when no filters are provided", async () => {
      const mockQuotes = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          text: "Test quote",
          author: "Test author",
          likes: 0,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockTotal = 1;

      mockRepository.findAll.mockResolvedValue([mockQuotes, mockTotal]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].text).toBe("Test quote");
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it("should pass author filter to repository", async () => {
      const query = { author: "Test", page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it("should pass query filter to repository", async () => {
      const query = { query: "something", page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it("should pass both filters to repository", async () => {
      const query = { author: "Test", query: "something", page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue([[], 0]);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe("findById", () => {
    it("should return a quote by id", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      const mockQuote = {
        id: quoteId,
        text: "Test quote",
        author: "Test author",
        likes: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockQuote);

      const result = await service.findById(quoteId);

      expect(result.id).toBe(quoteId);
      expect(result.text).toBe("Test quote");
      expect(mockRepository.findById).toHaveBeenCalledWith(quoteId);
    });

    it("should throw NotFoundException when quote not found", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(quoteId)).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException for invalid UUID", async () => {
      const invalidId = "invalid-uuid";

      await expect(service.findById(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe("create", () => {
    it("should create a new quote", async () => {
      const createDto: CreateQuoteDto = {
        text: "New quote",
        author: "New author",
        tags: "tag1;tag2",
      };

      const mockCreatedQuote = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        ...createDto,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.createQuote.mockResolvedValue(mockCreatedQuote);

      const result = await service.create(createDto);

      expect(result.text).toBe(createDto.text);
      expect(result.author).toBe(createDto.author);
      expect(result.likes).toBe(0);
      expect(mockRepository.createQuote).toHaveBeenCalledWith(createDto);
    });

    it("should throw BadRequestException for missing text", async () => {
      const createDto: CreateQuoteDto = {
        text: "",
        author: "Author",
        tags: "tag1",
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException for text exceeding 1000 characters", async () => {
      const createDto: CreateQuoteDto = {
        text: "a".repeat(1001),
        author: "Author",
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("update", () => {
    it("should update a quote", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      const updateDto: UpdateQuoteDto = {
        text: "Updated quote",
      };

      const existingQuote = {
        id: quoteId,
        text: "Old quote",
        author: "Author",
        likes: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedQuote = {
        ...existingQuote,
        ...updateDto,
      };

      mockRepository.findById.mockResolvedValue(existingQuote);
      mockRepository.updateQuote.mockResolvedValue(updatedQuote);

      const result = await service.update(quoteId, updateDto);

      expect(result.text).toBe(updateDto.text);
      expect(mockRepository.updateQuote).toHaveBeenCalledWith(quoteId, updateDto);
    });

    it("should throw NotFoundException when quote not found", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      const updateDto: UpdateQuoteDto = { text: "Updated" };

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(quoteId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException for negative likes", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      const updateDto: UpdateQuoteDto = {
        likes: -1,
      };

      const existingQuote = {
        id: quoteId,
        text: "Quote",
        author: "Author",
        likes: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(existingQuote);

      await expect(service.update(quoteId, updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("delete", () => {
    it("should delete a quote", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      const mockQuote = {
        id: quoteId,
        text: "Quote to delete",
        author: "Author",
        likes: 0,
        tags: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.deleteQuote.mockResolvedValue(true);

      await service.delete(quoteId);

      expect(mockRepository.deleteQuote).toHaveBeenCalledWith(quoteId);
    });

    it("should throw NotFoundException when quote not found", async () => {
      const quoteId = "123e4567-e89b-12d3-a456-426614174000";
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(quoteId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAllTags", () => {
    it("should return all unique tags", async () => {
      const mockTags = ["tag1", "tag2", "tag3"];
      mockRepository.findAllTags.mockResolvedValue(mockTags);

      const result = await service.findAllTags();

      expect(result).toEqual(mockTags);
      expect(mockRepository.findAllTags).toHaveBeenCalled();
    });
  });

  describe("findAllAuthors", () => {
    it("should return all unique authors", async () => {
      const mockAuthors = ["Author 1", "Author 2"];
      mockRepository.findAllAuthors.mockResolvedValue(mockAuthors);

      const result = await service.findAllAuthors();

      expect(result).toEqual(mockAuthors);
      expect(mockRepository.findAllAuthors).toHaveBeenCalled();
    });
  });
});
