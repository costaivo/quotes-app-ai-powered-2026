import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from "@nestjs/common";
import type { QuoteService } from "../services/quote.service";
import type { CreateQuoteDto } from "../dto/create-quote.dto";
import type { UpdateQuoteDto } from "../dto/update-quote.dto";
import type { QuoteResponseDto } from "../dto/quote-response.dto";

@Controller("api/v1/quotes")
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<QuoteResponseDto[]> {
    return this.quoteService.findAll();
  }

  @Get("tags/all")
  @HttpCode(HttpStatus.OK)
  async findAllTags(): Promise<string[]> {
    return this.quoteService.findAllTags();
  }

  @Get("authors/all")
  @HttpCode(HttpStatus.OK)
  async findAllAuthors(): Promise<string[]> {
    return this.quoteService.findAllAuthors();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateQuoteDto): Promise<QuoteResponseDto> {
    return this.quoteService.create(dto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findById(@Param("id", ParseUUIDPipe) id: string): Promise<QuoteResponseDto> {
    return this.quoteService.findById(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuoteDto,
  ): Promise<QuoteResponseDto> {
    return this.quoteService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.quoteService.delete(id);
  }
}
