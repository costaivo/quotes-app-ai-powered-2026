import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuotesTable1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quotes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'quote', type: 'text', isNullable: false },
          { name: 'author', type: 'varchar', length: '200', isNullable: false },
          { name: 'like_count', type: 'integer', default: 0 },
          { name: 'tags', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_at', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updated_at', type: 'timestamp with time zone', default: 'now()' },
        ],
      }),
    );

    // enforce non-negative like_count
    await queryRunner.query("ALTER TABLE \"quotes\" ADD CONSTRAINT like_count_non_negative CHECK (like_count >= 0)");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "quotes" DROP CONSTRAINT IF EXISTS like_count_non_negative');
    await queryRunner.dropTable('quotes');
  }
}
