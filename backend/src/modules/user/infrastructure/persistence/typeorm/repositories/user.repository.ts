import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as TypeOrmUser } from '../entities/user.entity';
import { User as DomainUser } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private readonly repository: Repository<TypeOrmUser>,
  ) { }

  async create(user: DomainUser): Promise<DomainUser> {
    const typeOrmUser = TypeOrmUser.fromDomain(user);
    const savedUser = await this.repository.save(typeOrmUser);
    return savedUser.toDomain();
  }

  async findAll(): Promise<DomainUser[]> {
    const users = await this.repository.find();
    return users.map(user => user.toDomain());
  }

  async findById(id: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? user.toDomain() : null;
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? user.toDomain() : null;
  }

  async update(id: string, user: DomainUser): Promise<DomainUser> {
    try {
      const existingUser = await this.findByEmail(user.getEmail());
      if (existingUser && existingUser.getId() !== id) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const typeOrmUser = TypeOrmUser.fromDomain(user);
      await this.repository.update(id, typeOrmUser);
      const updatedUser = await this.findById(id);
      if (!updatedUser) {
        throw new Error(`User with id ${id} not found after update`);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 