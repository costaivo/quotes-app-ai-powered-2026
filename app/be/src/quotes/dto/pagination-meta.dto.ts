import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
  @ApiProperty({ description: "Current page number" })
  currentPage: number;

  @ApiProperty({ description: "Number of items per page" })
  itemsPerPage: number;

  @ApiProperty({ description: "Total number of items" })
  totalItems: number;

  @ApiProperty({ description: "Total number of pages" })
  totalPages: number;

  @ApiProperty({ description: "Whether there is a next page" })
  hasNextPage: boolean;

  @ApiProperty({ description: "Whether there is a previous page" })
  hasPreviousPage: boolean;

  constructor(currentPage: number, itemsPerPage: number, totalItems: number) {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.hasNextPage = this.currentPage < this.totalPages;
    this.hasPreviousPage = this.currentPage > 1;
  }
}
