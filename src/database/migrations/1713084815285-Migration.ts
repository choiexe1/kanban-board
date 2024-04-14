import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713084815285 implements MigrationInterface {
    name = 'Migration1713084815285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refresh_token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refresh_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refresh_token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refresh_token" SET NOT NULL`);
    }

}
