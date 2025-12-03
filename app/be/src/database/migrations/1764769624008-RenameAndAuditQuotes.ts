import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RenameAndAuditQuotes1764769624008 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Rename columns
        // text -> quote
        await queryRunner.renameColumn("quotes", "text", "quote");
        
        // likes -> like_count
        await queryRunner.renameColumn("quotes", "likes", "like_count");

        // 2. Add new audit columns
        // created_by (nullable)
        await queryRunner.addColumn("quotes", new TableColumn({
            name: "created_by",
            type: "varchar",
            length: "255",
            isNullable: true
        }));

        // updated_by (nullable)
        await queryRunner.addColumn("quotes", new TableColumn({
            name: "updated_by",
            type: "varchar",
            length: "255",
            isNullable: true
        }));

        // 3. Fix/Standardize timestamps to snake_case
        // Check if createdAt exists and rename to created_at, or alter if it's already snake_case but misconfigured.
        // Assuming the previous entity definition used defaults which usually map 'createdAt' property to 'createdAt' column or 'created_at' depending on naming strategy.
        // Let's check the existing column names by renaming or checking.
        // NOTE: The previous entity had @CreateDateColumn(). By default in TypeORM without naming strategy, it uses the property name 'createdAt'.
        // We want 'created_at'.
        
        // Try renaming createdAt to created_at. If createdAt doesn't exist, we might need to check `created_at`.
        // Safest way is to check if 'createdAt' exists, then rename.
        
        // We will attempt to rename assuming default TypeORM behavior (camelCase column names).
        // If the column is ALREADY created_at, this might fail or be redundant. 
        // But standard practice for this migration is to explicitly ensure snake_case.
        
        // Rename 'createdAt' -> 'created_at'
        const table = await queryRunner.getTable("quotes");
        const createdAtColumn = table?.findColumnByName("createdAt");
        if (createdAtColumn) {
            await queryRunner.renameColumn("quotes", "createdAt", "created_at");
        }

        // Rename 'updatedAt' -> 'updated_at'
        const updatedAtColumn = table?.findColumnByName("updatedAt");
        if (updatedAtColumn) {
            await queryRunner.renameColumn("quotes", "updatedAt", "updated_at");
        }

        // If the columns didn't exist (unlikely for a quotes app), we would create them, but we assume they exist from previous migrations.
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert 3. Timestamps
        const table = await queryRunner.getTable("quotes");
        
        const createdAtColumn = table?.findColumnByName("created_at");
        if (createdAtColumn) {
            await queryRunner.renameColumn("quotes", "created_at", "createdAt");
        }

        const updatedAtColumn = table?.findColumnByName("updated_at");
        if (updatedAtColumn) {
            await queryRunner.renameColumn("quotes", "updated_at", "updatedAt");
        }

        // Revert 2. Audit columns
        await queryRunner.dropColumn("quotes", "updated_by");
        await queryRunner.dropColumn("quotes", "created_by");

        // Revert 1. Rename columns
        await queryRunner.renameColumn("quotes", "like_count", "likes");
        await queryRunner.renameColumn("quotes", "quote", "text");
    }

}
