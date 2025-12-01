import { Injectable } from "@nestjs/common";
import { type DataSource, Repository } from "typeorm";
import { Quote } from "../entities/quote.entity";
import type { CreateQuoteDto } from "../dto/create-quote.dto";
import type { UpdateQuoteDto } from "../dto/update-quote.dto";
import type { FindAllQuotesDto } from "../dto/find-all-quotes.dto";

@Injectable()
export class QuoteRepository extends Repository<Quote> {
  constructor(dataSource: DataSource) {
    super(Quote, dataSource.createEntityManager());
  }

  async findAll(query: FindAllQuotesDto, skip?: number, take?: number): Promise<[Quote[], number]> {
    const qb = this.createQueryBuilder("quote");

    if (query.author) {
      qb.andWhere("quote.author ILIKE :author", { author: `%${query.author}%` });
    }

    if (query.query) {
      qb.andWhere("quote.text ILIKE :text", { text: `%${query.query}%` });
    }

    if (skip !== undefined) {
      qb.skip(skip);
    }

    if (take !== undefined) {
      qb.take(take);
    }

    return qb.getManyAndCount();
  }

  async findById(id: string): Promise<Quote | null> {
    return this.findOne({ where: { id } });
  }

  async createQuote(dto: CreateQuoteDto): Promise<Quote> {
    const quote = this.createQueryBuilder()
      .insert()
      .into(Quote)
      .values({
        text: dto.text,
        author: dto.author,
        tags: dto.tags || null,
        likes: 0,
      })
      .returning("*")
      .execute();

    const result = await quote;
    return result.generatedMaps[0] as Quote;
  }

  async updateQuote(id: string, dto: UpdateQuoteDto): Promise<Quote | null> {
    await this.createQueryBuilder().update(Quote).set(dto).where("id = :id", { id }).execute();

    return this.findById(id);
  }

  async deleteQuote(id: string): Promise<boolean> {
    const result = await this.createQueryBuilder()
      .delete()
      .from(Quote)
      .where("id = :id", { id })
      .execute();

    return result.affected ? result.affected > 0 : false;
  }

  async findAllTags(): Promise<string[]> {
    const quotes = await this.find({ select: ["tags"] });
    const tagSet = new Set<string>();

    quotes.forEach((quote) => {
      if (quote.tags) {
        quote.tags.split(";").forEach((tag) => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            tagSet.add(trimmedTag);
          }
        });
      }
    });

    return Array.from(tagSet).sort();
  }

  async findAllAuthors(): Promise<string[]> {
    const quotes = await this.find({ select: ["author"] });
    const authorSet = new Set<string>();

    quotes.forEach((quote) => {
      if (quote.author) {
        authorSet.add(quote.author);
      }
    });

    return Array.from(authorSet).sort();
  }
}
