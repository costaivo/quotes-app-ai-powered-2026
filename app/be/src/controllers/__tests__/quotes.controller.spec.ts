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
});
