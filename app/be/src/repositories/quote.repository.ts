import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';

@Injectable()
export class QuoteRepository {
  constructor(
    @InjectRepository(Quote)
    private readonly repository: Repository<Quote>,
  ) {}

  async findAll(): Promise<Quote[]> {
    return this.repository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Quote | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(quoteData: Partial<Quote>): Promise<Quote> {
    const quote = this.repository.create(quoteData);
    return this.repository.save(quote);
  }

  async update(id: string, updateData: Partial<Quote>): Promise<Quote | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async incrementLikeCount(id: string): Promise<Quote | null> {
    const quote = await this.findById(id);
    if (!quote) {
      return null;
    }

    // Ensure like_count never goes negative
    const newLikeCount = Math.max(0, quote.like_count + 1);
    return this.update(id, { like_count: newLikeCount });
  }

  async decrementLikeCount(id: string): Promise<Quote | null> {
    const quote = await this.findById(id);
    if (!quote) {
      return null;
    }

    // Ensure like_count never goes negative
    const newLikeCount = Math.max(0, quote.like_count - 1);
    return this.update(id, { like_count: newLikeCount });
  }

  async findAllTags(): Promise<string[]> {
    const quotes = await this.repository.find({
      select: ['tags'],
      where: { tags: { $ne: null } as any },
    });

    const allTags = quotes
      .map(quote => quote.tags)
      .filter(tags => tags && tags.trim() !== '')
      .flatMap(tags => tags!.split(';'))
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag !== '');

    return [...new Set(allTags)].sort();
  }

  async findAllAuthors(): Promise<string[]> {
    const quotes = await this.repository.find({
      select: ['author'],
    });

    const allAuthors = quotes
      .map(quote => quote.author.trim())
      .filter(author => author !== '');

    return [...new Set(allAuthors)].sort();
  }
}
