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
      provide: QuoteRepository,
      useFactory: (dataSource: DataSource) => new QuoteRepository(dataSource),
      inject: [DataSource],
    },
    QuoteService,
  ],
  controllers: [QuoteController],
})
export class QuotesModule {}
