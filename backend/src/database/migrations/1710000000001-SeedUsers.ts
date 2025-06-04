import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

type UserSeed = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export class SeedUsers1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: UserSeed[] = [];

    for (let i = 0; i < 10; i++) {
      const password = await bcrypt.hash('password123', 10);
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
    }

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values(users)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
  }
} 