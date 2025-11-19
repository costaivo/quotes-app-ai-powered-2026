import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Quote } from "./entities/quote.entity";
import { QuoteRepository } from "./repositories/quote.repository";
import { QuoteService } from "./services/quote.service";
import { QuoteController } from "./controllers/quote.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [
    {
      provide: "QUOTE_REPOSITORY",
      useFactory: (dataSource: DataSource) => new QuoteRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: QuoteService,
      useFactory: (repository: QuoteRepository) => new QuoteService(repository),
      inject: ["QUOTE_REPOSITORY"],
    },
  ],
  controllers: [QuoteController],
})
export class QuotesModule {}
