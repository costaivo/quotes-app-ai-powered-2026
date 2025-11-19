import { IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateQuoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  text?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  likes?: number;

  @IsOptional()
  @IsString()
  tags?: string;
}
