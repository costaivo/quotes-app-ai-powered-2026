import { Test, type TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { QuoteRepository } from "./quote.repository";
import type { Quote } from "../entities/quote.entity";
import { CreateQuoteDto } from "../dto/create-quote.dto";
import { UpdateQuoteDto } from "../dto/update-quote.dto";

describe("QuoteRepository", () => {
  let repository: QuoteRepository;
  let dataSource: DataSource;

  const mockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<QuoteRepository>(QuoteRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all quotes", async () => {
      const mockQuotes = [
        {
          id: "1",
          text: "Test quote 1",
          author: "Author 1",
          likes: 0,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, "find").mockResolvedValue(mockQuotes as Quote[]);

      const result = await repository.findAll();

      expect(result).toEqual(mockQuotes);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe("findAllTags", () => {
    it("should return unique tags", async () => {
      const mockQuotes = [
        {
          id: "1",
          text: "Quote 1",
          author: "Author 1",
          likes: 0,
          tags: "tag1;tag2;tag3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          text: "Quote 2",
          author: "Author 2",
          likes: 0,
          tags: "tag2;tag4",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, "find").mockResolvedValue(mockQuotes as Quote[]);

      const result = await repository.findAllTags();

      expect(result).toContain("tag1");
      expect(result).toContain("tag2");
      expect(result).toContain("tag3");
      expect(result).toContain("tag4");
      expect(result.length).toBe(4);
    });

    it("should return empty array when no quotes have tags", async () => {
      jest.spyOn(repository, "find").mockResolvedValue([]);

      const result = await repository.findAllTags();

      expect(result).toEqual([]);
    });
  });

  describe("findAllAuthors", () => {
    it("should return unique authors", async () => {
      const mockQuotes = [
        {
          id: "1",
          text: "Quote 1",
          author: "Author 1",
          likes: 0,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          text: "Quote 2",
          author: "Author 2",
          likes: 0,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          text: "Quote 3",
          author: "Author 1",
          likes: 0,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, "find").mockResolvedValue(mockQuotes as Quote[]);

      const result = await repository.findAllAuthors();

      expect(result).toContain("Author 1");
      expect(result).toContain("Author 2");
      expect(result.length).toBe(2);
    });

    it("should return empty array when no quotes exist", async () => {
      jest.spyOn(repository, "find").mockResolvedValue([]);

      const result = await repository.findAllAuthors();

      expect(result).toEqual([]);
    });
  });
});
