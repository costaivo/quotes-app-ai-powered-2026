import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllQuotesDto {
  @ApiPropertyOptional({ description: 'Filter by author (partial match)' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Filter by text content (partial match)' })
  @IsOptional()
  @IsString()
  query?: string;

  // Added to support type compatibility in tests and service
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
