import { CreateQuotesTable1680000000000 } from '../../migrations/CreateQuotesTable1680000000000';
import { QueryRunner, Table } from 'typeorm';

describe('CreateQuotesTable1680000000000', () => {
  let migration: CreateQuotesTable1680000000000;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    migration = new CreateQuotesTable1680000000000();
    mockQueryRunner = {
      createTable: jest.fn(),
      query: jest.fn(),
      dropTable: jest.fn(),
    } as any;
  });

  describe('up', () => {
    it('should create quotes table with correct schema', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'quotes',
          columns: expect.arrayContaining([
            expect.objectContaining({
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
            }),
            expect.objectContaining({
              name: 'quote',
              type: 'text',
              isNullable: false,
            }),
            expect.objectContaining({
              name: 'author',
              type: 'varchar',
              length: '200',
              isNullable: false,
            }),
            expect.objectContaining({
              name: 'like_count',
              type: 'integer',
              default: 0,
            }),
            expect.objectContaining({
              name: 'tags',
              type: 'varchar',
              length: '500',
              isNullable: true,
            }),
            expect.objectContaining({
              name: 'created_at',
              type: 'timestamp with time zone',
              default: 'now()',
            }),
            expect.objectContaining({
              name: 'updated_at',
              type: 'timestamp with time zone',
              default: 'now()',
            }),
          ]),
        })
      );
    });

    it('should add CHECK constraint for like_count', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        'ALTER TABLE "quotes" ADD CONSTRAINT like_count_non_negative CHECK (like_count >= 0)'
      );
    });
  });

  describe('down', () => {
    it('should drop CHECK constraint and table', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        'ALTER TABLE "quotes" DROP CONSTRAINT IF EXISTS like_count_non_negative'
      );
      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('quotes');
    });
  });

  describe('migration class', () => {
    it('should have correct name', () => {
      expect(migration.constructor.name).toBe('CreateQuotesTable1680000000000');
    });

    it('should implement MigrationInterface', () => {
      expect(typeof migration.up).toBe('function');
      expect(typeof migration.down).toBe('function');
    });
  });
});
