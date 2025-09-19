import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { QuoteService } from '../services/quote.service';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteDto } from '../dto/update-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  async getAllQuotes() {
    return this.quoteService.getAllQuotes();
  }

  /**
   * Get all unique tags from quotes with normalization applied.
   * 
   * @returns Promise<{ data: string[], success: boolean, message: string }>
   * 
   * Tag Normalization Rules:
   * - Tags are split by semicolons (;) from stored tag strings
   * - Leading and trailing whitespace is trimmed from each tag
   * - Empty tags (whitespace-only or empty strings) are filtered out
   * - All tags are converted to lowercase for case-insensitive deduplication
   * - Duplicate tags are removed (case-insensitive)
   * - Final result is sorted alphabetically
   * 
   * Example Response:
   * {
   *   "data": ["inspiration", "life", "wisdom", "work"],
   *   "success": true,
   *   "message": "Operation completed successfully"
   * }
   */
  @Get('tags')
  async getAllTags() {
    return this.quoteService.getAllTags();
  }

  /**
   * Get all unique authors from quotes with normalization applied.
   * 
   * @returns Promise<{ data: string[], success: boolean, message: string }>
   * 
   * Author Normalization Rules:
   * - Leading and trailing whitespace is trimmed from each author name
   * - Empty author names (whitespace-only or empty strings) are filtered out
   * - Case-insensitive deduplication is applied (e.g., "John Doe" and "john doe" are treated as the same)
   * - The original case of the first occurrence is preserved
   * - Final result is sorted alphabetically
   * 
   * Example Response:
   * {
   *   "data": ["Albert Einstein", "Maya Angelou", "Steve Jobs"],
   *   "success": true,
   *   "message": "Operation completed successfully"
   * }
   */
  @Get('authors')
  async getAllAuthors() {
    return this.quoteService.getAllAuthors();
  }

  @Get(':id')
  async getQuoteById(@Param('id') id: string) {
    return this.quoteService.getQuoteById(id);
  }

  /**
   * Create a new quote with validation applied.
   * 
   * @param createQuoteDto - The quote data to create
   * @returns Promise<{ data: Quote, success: boolean, message: string }>
   * 
   * Validation Rules:
   * - quote: Required, max 1000 characters
   * - author: Required, max 200 characters
   * - tags: Optional, max 500 characters, space-separated (semicolons not allowed)
   * 
   * Tag Validation:
   * - Semicolons (;) are not allowed in tag values
   * - Tags are sanitized to remove control characters and excessive whitespace
   * - Use space-separated tags instead of semicolon-separated values
   * 
   * Example Request Body:
   * {
   *   "quote": "The only way to do great work is to love what you do.",
   *   "author": "Steve Jobs",
   *   "tags": "inspiration work passion"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuote(@Body(ValidationPipe) createQuoteDto: CreateQuoteDto) {
    return this.quoteService.createQuote(createQuoteDto);
  }

  /**
   * Update an existing quote with validation applied.
   * 
   * @param id - The UUID of the quote to update
   * @param updateQuoteDto - The partial quote data to update
   * @returns Promise<{ data: Quote, success: boolean, message: string }>
   * 
   * Validation Rules (same as create):
   * - quote: Optional, max 1000 characters
   * - author: Optional, max 200 characters
   * - tags: Optional, max 500 characters, space-separated (semicolons not allowed)
   * 
   * Tag Validation:
   * - Semicolons (;) are not allowed in tag values
   * - Tags are sanitized to remove control characters and excessive whitespace
   * - Use space-separated tags instead of semicolon-separated values
   */
  @Patch(':id')
  async updateQuote(
    @Param('id') id: string,
    @Body(ValidationPipe) updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quoteService.updateQuote(id, updateQuoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuote(@Param('id') id: string) {
    await this.quoteService.deleteQuote(id);
  }
}
