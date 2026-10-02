import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Tabel users untuk login JWT (ditulis tangan; generate butuh DB hidup). */
export class Users20261002000000 implements MigrationInterface {
  name = 'Users20261002000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(100) NOT NULL,
        \`passwordHash\` varchar(255) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`role\` varchar(50) NOT NULL,
        \`permissions\` json NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_users_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
