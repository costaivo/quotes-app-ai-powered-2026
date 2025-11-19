export class QuoteResponseDto {
  id!: string;
  text!: string;
  author!: string;
  likes!: number;
  tags!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
