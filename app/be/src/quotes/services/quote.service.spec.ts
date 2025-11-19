import { Test, type TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { QuoteService } from "./quote.service";
import { QuoteRepository } from "../repositories/quote.repository";
import type { CreateQuoteDto } from "../dto/create-quote.dto";
import type { UpdateQuoteDto } from "../dto/update-quote.dto";

describe("QuoteService", () => {
  let service: QuoteService;
  let repository: QuoteRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAllTags: jest.fn(),
    findAllAuthors: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: QuoteRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    repository = module.get<QuoteRepository>(QuoteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all quotes", async () => {
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

      mockRepository.findAll.mockResolvedValue(mockQuotes);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("Test quote");
      expect(mockRepository.findAll).toHaveBeenCalled();
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

      mockRepository.create.mockResolvedValue(mockCreatedQuote);

      const result = await service.create(createDto);

      expect(result.text).toBe(createDto.text);
      expect(result.author).toBe(createDto.author);
      expect(result.likes).toBe(0);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
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
      mockRepository.update.mockResolvedValue(updatedQuote);

      const result = await service.update(quoteId, updateDto);

      expect(result.text).toBe(updateDto.text);
      expect(mockRepository.update).toHaveBeenCalledWith(quoteId, updateDto);
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
      mockRepository.delete.mockResolvedValue(true);

      await service.delete(quoteId);

      expect(mockRepository.delete).toHaveBeenCalledWith(quoteId);
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
