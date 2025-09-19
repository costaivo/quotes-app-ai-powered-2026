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
    // Use atomic SQL operation to increment like_count and return updated entity
    const result = await this.repository
      .createQueryBuilder()
      .update(Quote)
      .set({ 
        like_count: () => 'like_count + 1',
        updated_at: () => 'CURRENT_TIMESTAMP'
      })
      .where('id = :id', { id })
      .andWhere('like_count >= 0') // Additional safety check
      .returning('*')
      .execute();

    // Return the updated quote if any rows were affected
    return result.affected > 0 ? result.raw[0] : null;
  }

  async decrementLikeCount(id: string): Promise<Quote | null> {
    // Use atomic SQL operation to decrement like_count and return updated entity
    const result = await this.repository
      .createQueryBuilder()
      .update(Quote)
      .set({ 
        like_count: () => 'GREATEST(like_count - 1, 0)',
        updated_at: () => 'CURRENT_TIMESTAMP'
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    // Return the updated quote if any rows were affected
    return result.affected > 0 ? result.raw[0] : null;
  }

  /**
   * Retrieves all unique tags from quotes with normalization applied.
   * 
   * Normalization Rules:
   * - Tags are split by semicolons (;) from the stored tag string
   * - Leading and trailing whitespace is trimmed from each tag
   * - Empty tags (whitespace-only or empty strings) are filtered out
   * - All tags are converted to lowercase for case-insensitive deduplication
   * - Duplicate tags are removed (case-insensitive)
   * - Final result is sorted alphabetically
   * 
   * Note: The API now validates that semicolons are not allowed in tag values
   * during input validation, but this method handles legacy data that may
   * contain semicolons.
   * 
   * @returns Promise<string[]> Array of normalized, deduplicated, sorted tags
   */
  async findAllTags(): Promise<string[]> {
    // Use proper TypeORM null filtering instead of $ne operator
    const quotes = await this.repository.find({
      select: ['tags'],
      where: { tags: { $not: null } as any },
    });

    const allTags = quotes
      .map(quote => quote.tags)
      .filter(tags => tags && tags.trim() !== '')
      .flatMap(tags => {
        // Robust tag splitting that handles multiple consecutive semicolons
        return tags!
          .split(';')
          .map(tag => tag.trim())
          .filter(tag => tag !== ''); // Remove empty tags from splitting
      })
      .map(tag => tag.toLowerCase()) // Normalize to lowercase
      .filter(tag => tag !== ''); // Final filter for any remaining empty tags

    // Deduplicate and sort alphabetically
    return [...new Set(allTags)].sort();
  }

  /**
   * Retrieves all unique authors from quotes with normalization applied.
   * 
   * Normalization Rules:
   * - Leading and trailing whitespace is trimmed from each author name
   * - Empty author names (whitespace-only or empty strings) are filtered out
   * - Case-insensitive deduplication is applied (e.g., "John Doe" and "john doe" are treated as the same)
   * - The original case of the first occurrence is preserved
   * - Final result is sorted alphabetically
   * 
   * Example: If quotes contain authors ["John Doe", "jane smith", "JOHN DOE", "Jane Smith"],
   * the result will be ["Jane Smith", "John Doe"] (preserving first occurrence's case)
   * 
   * @returns Promise<string[]> Array of normalized, deduplicated, sorted authors
   */
  async findAllAuthors(): Promise<string[]> {
    const quotes = await this.repository.find({
      select: ['author'],
    });

    const allAuthors = quotes
      .map(quote => quote.author.trim())
      .filter(author => author !== '');

    // Case-insensitive deduplication while preserving original case
    const uniqueAuthors = new Map<string, string>();
    allAuthors.forEach(author => {
      const lowerKey = author.toLowerCase();
      if (!uniqueAuthors.has(lowerKey)) {
        uniqueAuthors.set(lowerKey, author);
      }
    });

    // Return sorted array of unique authors (preserving original case)
    return Array.from(uniqueAuthors.values()).sort();
  }
}
