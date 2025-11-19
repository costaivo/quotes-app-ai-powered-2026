import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  text!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  author!: string;

  @IsOptional()
  @IsString()
  tags?: string;
}
