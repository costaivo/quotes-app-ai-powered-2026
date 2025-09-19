import { IsString, IsNotEmpty, MaxLength, IsOptional, ValidateIf } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty({ message: 'Quote should not be empty' })
  @MaxLength(1000, { message: 'Quote must be 1000 characters or less' })
  quote: string;

  @IsString()
  @IsNotEmpty({ message: 'Author should not be empty' })
  @MaxLength(200, { message: 'Author must be 200 characters or less' })
  author: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Tags must be 500 characters or less' })
  tags?: string;
}
