import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { Quote } from '../entities/quote.entity';
import type { QuoteRepository } from '../repositories/quote.repository';
import type { CreateQuoteDto } from '../dto/create-quote.dto';
import type { UpdateQuoteDto } from '../dto/update-quote.dto';
import type { QuoteResponseDto } from '../dto/quote-response.dto';
import type { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { PaginationMetaDto } from '../dto/pagination-meta.dto';

@Injectable()
export class QuoteService {
  constructor(private quoteRepository: QuoteRepository) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<QuoteResponseDto>> {
    const page = query.page || 1;
    const limit = query.limit || 20;

    const [quotes, total] = await this.quoteRepository.findAll(query);

    const quoteDtos = quotes.map(this.mapToDto);
    const meta = new PaginationMetaDto(page, limit, total);

    return new PaginatedResponseDto(quoteDtos, meta);
  }

  async findById(id: string): Promise<QuoteResponseDto> {
    this.validateUUID(id);
    const quote = await this.quoteRepository.findById(id);

    if (!quote) {
      throw new NotFoundException(`Quote with id ${id} not found`);
    }

    return this.mapToDto(quote);
  }

  async create(dto: CreateQuoteDto): Promise<QuoteResponseDto> {
    this.validateCreateDto(dto);
    const quote = await this.quoteRepository.createQuote(dto);
    return this.mapToDto(quote);
  }

  async update(id: string, dto: UpdateQuoteDto): Promise<QuoteResponseDto> {
    this.validateUUID(id);
    this.validateUpdateDto(dto);

    // Check if quote exists
    const existingQuote = await this.quoteRepository.findById(id);
    if (!existingQuote) {
      throw new NotFoundException(`Quote with id ${id} not found`);
    }

    const updatedQuote = await this.quoteRepository.updateQuote(id, dto);
    if (!updatedQuote) {
      throw new NotFoundException(`Quote with id ${id} not found`);
    }

    return this.mapToDto(updatedQuote);
  }

  async delete(id: string): Promise<void> {
    this.validateUUID(id);

    // Check if quote exists
    const existingQuote = await this.quoteRepository.findById(id);
    if (!existingQuote) {
      throw new NotFoundException(`Quote with id ${id} not found`);
    }

    await this.quoteRepository.deleteQuote(id);
  }

  async findAllTags(): Promise<string[]> {
    return this.quoteRepository.findAllTags();
  }

  async findAllAuthors(): Promise<string[]> {
    return this.quoteRepository.findAllAuthors();
  }

  private validateCreateDto(dto: CreateQuoteDto): void {
    if (!dto.quote || dto.quote.trim().length === 0) {
      throw new BadRequestException('Quote is required');
    }

    if (dto.quote.length > 1000) {
      throw new BadRequestException('Quote cannot exceed 1000 characters');
    }

    if (!dto.author || dto.author.trim().length === 0) {
      throw new BadRequestException('Author is required');
    }

    if (dto.author.length > 200) {
      throw new BadRequestException('Author cannot exceed 200 characters');
    }
  }

  private validateUpdateDto(dto: UpdateQuoteDto): void {
    if (dto.quote !== undefined) {
      if (dto.quote.trim().length === 0) {
        throw new BadRequestException('Quote cannot be empty');
      }

      if (dto.quote.length > 1000) {
        throw new BadRequestException('Quote cannot exceed 1000 characters');
      }
    }

    if (dto.author !== undefined) {
      if (dto.author.trim().length === 0) {
        throw new BadRequestException('Author cannot be empty');
      }

      if (dto.author.length > 200) {
        throw new BadRequestException('Author cannot exceed 200 characters');
      }
    }

    if (dto.likeCount !== undefined) {
      if (typeof dto.likeCount !== 'number' || dto.likeCount < 0) {
        throw new BadRequestException('Like count must be a non-negative number');
      }
    }
  }

  private validateUUID(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
  }

  private mapToDto(quote: Quote): QuoteResponseDto {
    return {
      id: quote.id,
      quote: quote.quote,
      author: quote.author,
      likeCount: quote.likeCount,
      tags: quote.tags,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      createdBy: quote.createdBy,
      updatedBy: quote.updatedBy,
    };
  }
}
