import { IsNumber, IsOptional, IsString, MaxLength, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuoteDto {
  @ApiProperty({
    description: 'The text content of the quote',
    example: 'To be or not to be, that is the question.',
    maxLength: 1000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  text?: string;

  @ApiProperty({
    description: 'The author of the quote',
    example: 'William Shakespeare',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  author?: string;

  @ApiProperty({
    description: 'Number of likes for the quote',
    example: 42,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  likes?: number;

  @ApiProperty({
    description: 'Comma-separated tags for the quote',
    example: 'classic;drama',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\-_]+(;[a-zA-Z0-9\s\-_]+)*$/, {
    message: 'Tags must be semicolon-separated alphanumeric strings',
  })
  tags?: string;
}
