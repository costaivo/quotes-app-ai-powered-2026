import { IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'The text content of the quote',
    example: 'To be or not to be, that is the question.',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  text!: string;

  @ApiProperty({
    description: 'The author of the quote',
    example: 'William Shakespeare',
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  author!: string;

  @ApiProperty({
    description: 'Comma-separated tags for the quote',
    example: 'classic;drama;philosophy',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\-_]+(;[a-zA-Z0-9\s\-_]+)*$/, {
    message: 'Tags must be semicolon-separated alphanumeric strings',
  })
  tags?: string;
}
