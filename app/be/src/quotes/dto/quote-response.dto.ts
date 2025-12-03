import { ApiProperty } from '@nestjs/swagger';

export class QuoteResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the quote',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The text content of the quote',
    example: 'To be or not to be, that is the question.',
  })
  quote!: string;

  @ApiProperty({
    description: 'The author of the quote',
    example: 'William Shakespeare',
  })
  author!: string;

  @ApiProperty({
    description: 'Number of likes for the quote',
    example: 10,
  })
  likeCount!: number;

  @ApiProperty({
    description: 'Semicolon-separated tags for the quote',
    example: 'classic;drama',
    nullable: true,
  })
  tags!: string | null;

  @ApiProperty({
    description: 'When the quote was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the quote was last updated',
    example: '2023-01-02T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'User ID who created the quote',
    example: 'user-123',
    nullable: true,
  })
  createdBy!: string | null;

  @ApiProperty({
    description: 'User ID who last updated the quote',
    example: 'user-456',
    nullable: true,
  })
  updatedBy!: string | null;
}
