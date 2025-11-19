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
  Inject,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { QuoteService } from "../services/quote.service";
import { CreateQuoteDto } from "../dto/create-quote.dto";
import { UpdateQuoteDto } from "../dto/update-quote.dto";
import { QuoteResponseDto } from "../dto/quote-response.dto";

@ApiTags("Quotes")
@Controller("v1/quotes")
export class QuoteController {
  constructor(@Inject(QuoteService) private quoteService: QuoteService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all quotes" })
  @ApiResponse({
    status: 200,
    description: "Return all quotes.",
    type: [QuoteResponseDto],
  })
  async findAll(): Promise<QuoteResponseDto[]> {
    return this.quoteService.findAll();
  }

  @Get("tags/all")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all unique tags" })
  @ApiResponse({
    status: 200,
    description: "Return all unique tags.",
    type: [String],
  })
  async findAllTags(): Promise<string[]> {
    return this.quoteService.findAllTags();
  }

  @Get("authors/all")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all unique authors" })
  @ApiResponse({
    status: 200,
    description: "Return all unique authors.",
    type: [String],
  })
  async findAllAuthors(): Promise<string[]> {
    return this.quoteService.findAllAuthors();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new quote" })
  @ApiBody({ type: CreateQuoteDto })
  @ApiResponse({
    status: 201,
    description: "The quote has been successfully created.",
    type: QuoteResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  async create(@Body() dto: CreateQuoteDto): Promise<QuoteResponseDto> {
    return this.quoteService.create(dto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get a quote by id" })
  @ApiParam({ name: "id", description: "The UUID of the quote" })
  @ApiResponse({
    status: 200,
    description: "Return the quote.",
    type: QuoteResponseDto,
  })
  @ApiResponse({ status: 404, description: "Quote not found." })
  @ApiResponse({ status: 400, description: "Invalid UUID." })
  async findById(@Param("id", ParseUUIDPipe) id: string): Promise<QuoteResponseDto> {
    return this.quoteService.findById(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update a quote" })
  @ApiParam({ name: "id", description: "The UUID of the quote" })
  @ApiBody({ type: UpdateQuoteDto })
  @ApiResponse({
    status: 200,
    description: "The quote has been successfully updated.",
    type: QuoteResponseDto,
  })
  @ApiResponse({ status: 404, description: "Quote not found." })
  @ApiResponse({ status: 400, description: "Bad Request or Invalid UUID." })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuoteDto,
  ): Promise<QuoteResponseDto> {
    return this.quoteService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a quote" })
  @ApiParam({ name: "id", description: "The UUID of the quote" })
  @ApiResponse({
    status: 204,
    description: "The quote has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Quote not found." })
  @ApiResponse({ status: 400, description: "Invalid UUID." })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.quoteService.delete(id);
  }
}
