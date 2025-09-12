import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuoteRepository } from '../repositories/quote.repository';
import { Quote } from '../entities/quote.entity';

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

  async createQuote(quoteData: {
    quote: string;
    author: string;
    tags?: string;
  }): Promise<Quote> {
    // Validate required fields
    if (!quoteData.quote || !quoteData.author) {
      throw new BadRequestException('Quote and author are required');
    }

    // Validate field lengths
    if (quoteData.quote.length > 1000) {
      throw new BadRequestException('Quote must be 1000 characters or less');
    }

    if (quoteData.author.length > 200) {
      throw new BadRequestException('Author must be 200 characters or less');
    }

    if (quoteData.tags && quoteData.tags.length > 500) {
      throw new BadRequestException('Tags must be 500 characters or less');
    }

    return this.quoteRepository.create({
      quote: quoteData.quote.trim(),
      author: quoteData.author.trim(),
      tags: quoteData.tags?.trim() || null,
      like_count: 0,
    });
  }

  async updateQuote(id: string, updateData: {
    quote?: string;
    author?: string;
    tags?: string;
  }): Promise<Quote> {
    // Check if quote exists
    await this.getQuoteById(id);

    // Validate field lengths if provided
    if (updateData.quote && updateData.quote.length > 1000) {
      throw new BadRequestException('Quote must be 1000 characters or less');
    }

    if (updateData.author && updateData.author.length > 200) {
      throw new BadRequestException('Author must be 200 characters or less');
    }

    if (updateData.tags && updateData.tags.length > 500) {
      throw new BadRequestException('Tags must be 500 characters or less');
    }

    // Prepare update data with trimmed values
    const trimmedUpdateData: Partial<Quote> = {};
    if (updateData.quote !== undefined) {
      trimmedUpdateData.quote = updateData.quote.trim();
    }
    if (updateData.author !== undefined) {
      trimmedUpdateData.author = updateData.author.trim();
    }
    if (updateData.tags !== undefined) {
      trimmedUpdateData.tags = updateData.tags.trim() || null;
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
