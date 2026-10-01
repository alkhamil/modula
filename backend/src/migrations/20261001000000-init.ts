import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Skema awal: module_definitions + records (ditulis tangan; generate butuh DB hidup). */
export class Init20261001000000 implements MigrationInterface {
  name = 'Init20261001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`module_definitions\` (
        \`key\` varchar(191) NOT NULL,
        \`status\` varchar(16) NOT NULL DEFAULT 'draft',
        \`label\` varchar(100) NOT NULL,
        \`singularLabel\` varchar(100) NOT NULL,
        \`parent\` varchar(191) NULL,
        \`routeBase\` varchar(191) NOT NULL,
        \`permissionKey\` varchar(100) NOT NULL,
        \`apiPlural\` varchar(100) NOT NULL,
        \`moduleType\` varchar(16) NOT NULL DEFAULT 'crud',
        \`features\` json NOT NULL,
        \`fields\` json NOT NULL,
        \`layout\` json NOT NULL,
        \`deleteMode\` varchar(8) NOT NULL DEFAULT 'soft',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`key\`),
        UNIQUE INDEX \`IDX_definitions_routeBase\` (\`routeBase\`),
        UNIQUE INDEX \`IDX_definitions_apiPlural\` (\`apiPlural\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await queryRunner.query(`
      CREATE TABLE \`records\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`moduleKey\` varchar(191) NOT NULL,
        \`data\` json NOT NULL,
        \`status\` varchar(16) NOT NULL DEFAULT 'active',
        \`createdBy\` varchar(100) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_records_module_status\` (\`moduleKey\`, \`status\`),
        CONSTRAINT \`FK_records_moduleKey\`
          FOREIGN KEY (\`moduleKey\`) REFERENCES \`module_definitions\` (\`key\`)
          ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`records\``);
    await queryRunner.query(`DROP TABLE \`module_definitions\``);
  }
}
