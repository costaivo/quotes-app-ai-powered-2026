import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuoteTable1763578758430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quotes" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "text" text NOT NULL, "author" character varying(200) NOT NULL, "likes" integer NOT NULL DEFAULT '0', "tags" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_quotes_likes" CHECK ("likes" >= 0))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quotes"`);
  }
}
