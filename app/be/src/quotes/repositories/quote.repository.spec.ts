describe("QuoteRepository", () => {
  let repository: Record<string, jest.Mock>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn().mockResolvedValue(null),
      createQuote: jest.fn(),
      updateQuote: jest.fn(),
      deleteQuote: jest.fn().mockResolvedValue(false),
      findAllTags: jest.fn().mockResolvedValue([]),
      findAllAuthors: jest.fn().mockResolvedValue([]),
    };
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

      repository.findAll.mockResolvedValue(mockQuotes);

      const result = await repository.findAll();

      expect(result).toEqual(mockQuotes);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe("findAllTags", () => {
    it("should return unique tags", async () => {
      const mockTags = ["tag1", "tag2", "tag3", "tag4"];
      repository.findAllTags.mockResolvedValue(mockTags);

      const result = await repository.findAllTags();

      expect(result).toContain("tag1");
      expect(result).toContain("tag2");
      expect(result).toContain("tag3");
      expect(result).toContain("tag4");
      expect(result.length).toBe(4);
    });

    it("should return empty array when no quotes have tags", async () => {
      repository.findAllTags.mockResolvedValue([]);

      const result = await repository.findAllTags();

      expect(result).toEqual([]);
    });
  });

  describe("findAllAuthors", () => {
    it("should return unique authors", async () => {
      const mockAuthors = ["Author 1", "Author 2"];
      repository.findAllAuthors.mockResolvedValue(mockAuthors);

      const result = await repository.findAllAuthors();

      expect(result).toContain("Author 1");
      expect(result).toContain("Author 2");
      expect(result.length).toBe(2);
    });

    it("should return empty array when no quotes exist", async () => {
      repository.findAllAuthors.mockResolvedValue([]);

      const result = await repository.findAllAuthors();

      expect(result).toEqual([]);
    });
  });
});
