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

  @Get('tags')
  async getAllTags() {
    return this.quoteService.getAllTags();
  }

  @Get('authors')
  async getAllAuthors() {
    return this.quoteService.getAllAuthors();
  }

  @Get(':id')
  async getQuoteById(@Param('id') id: string) {
    return this.quoteService.getQuoteById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuote(@Body(ValidationPipe) createQuoteDto: CreateQuoteDto) {
    return this.quoteService.createQuote(createQuoteDto);
  }

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
