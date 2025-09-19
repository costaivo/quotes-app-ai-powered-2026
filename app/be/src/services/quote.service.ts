import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';
import { Quote } from '../entities/quote.entity';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { UpdateQuoteDto } from '../dto/update-quote.dto';

@Injectable()
export class QuoteService {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async getAllQuotes(): Promise<Quote[]> {
    return this.quoteRepository.findAll();
  }

  async getQuoteById(id: string): Promise<Quote> {
    const quote = await this.quoteRepository.findById(id);
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return quote;
  }

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    return this.quoteRepository.create({
      quote: createQuoteDto.quote.trim(),
      author: createQuoteDto.author.trim(),
      tags: createQuoteDto.tags?.trim() || null,
      like_count: 0,
    });
  }

  async updateQuote(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    // Check if quote exists
    await this.getQuoteById(id);

    // Prepare update data with trimmed values
    const trimmedUpdateData: Partial<Quote> = {};
    if (updateQuoteDto.quote !== undefined) {
      trimmedUpdateData.quote = updateQuoteDto.quote.trim();
    }
    if (updateQuoteDto.author !== undefined) {
      trimmedUpdateData.author = updateQuoteDto.author.trim();
    }
    if (updateQuoteDto.tags !== undefined) {
      trimmedUpdateData.tags = updateQuoteDto.tags.trim() || null;
    }

    const updatedQuote = await this.quoteRepository.update(id, trimmedUpdateData);
    if (!updatedQuote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    return updatedQuote;
  }

  async deleteQuote(id: string): Promise<void> {
    const deleted = await this.quoteRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
  }

  async likeQuote(id: string): Promise<Quote> {
    const updatedQuote = await this.quoteRepository.incrementLikeCount(id);
    if (!updatedQuote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return updatedQuote;
  }

  async unlikeQuote(id: string): Promise<Quote> {
    const updatedQuote = await this.quoteRepository.decrementLikeCount(id);
    if (!updatedQuote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return updatedQuote;
  }

  async getAllTags(): Promise<string[]> {
    return this.quoteRepository.findAllTags();
  }

  async getAllAuthors(): Promise<string[]> {
    return this.quoteRepository.findAllAuthors();
  }
}
