import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quote } from "./entities/quote.entity";
import { QuoteRepository } from "./repositories/quote.repository";
import { QuoteService } from "./services/quote.service";
import { QuoteController } from "./controllers/quote.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Quote])],
  providers: [QuoteRepository, QuoteService],
  controllers: [QuoteController],
})
export class QuotesModule {}
