import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindAllQuotesDto {
  @ApiPropertyOptional({ description: "Filter by author (partial match)" })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: "Filter by text content (partial match)" })
  @IsOptional()
  @IsString()
  query?: string;
}

