import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../presentation/dtos/create-user.dto';
import { UpdateUserDto } from '../../presentation/dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 300;
  private readonly CACHE_KEYS = {
    USER: (id: string) => `user:${id}`,
    USERS_LIST: (page: number, limit: number) => `users:list:${page}:${limit}`,
  };

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = User.create(
      createUserDto.name,
      createUserDto.email,
      hashedPassword
    );

    const createdUser = await this.userRepository.create(user);
    await this.invalidateListCache();
    return createdUser;
  }

  async findAll(page?: number, limit?: number): Promise<{ users: User[]; total: number }> {
    try {
      const allUsers = await this.userRepository.findAll();
      const total = allUsers.length;

      if (!page || !limit) {
        return { users: allUsers, total };
      }

      const cacheKey = this.CACHE_KEYS.USERS_LIST(page, limit);
      const cached = await this.cacheManager.get<{ users: User[]; total: number }>(cacheKey);

      if (cached) {
        return cached;
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      const result = { users: paginatedUsers, total };
      await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);

      return result;
    } catch (error) {
      throw new HttpException(
        'Error fetching users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: string): Promise<User> {
    const cacheKey = this.CACHE_KEYS.USER(id);
    const cached = await this.cacheManager.get<User>(cacheKey);

    if (cached) {
      return cached;
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(cacheKey, user, this.CACHE_TTL);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);

    if (updateUserDto.name) user.updateName(updateUserDto.name);
    if (updateUserDto.email) user.updateEmail(updateUserDto.email);
    if (updateUserDto.password) user.updatePassword(updateUserDto.password);

    const updatedUser = await this.userRepository.update(id, user);
    await this.invalidateUserCache(id);
    await this.invalidateListCache();
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.delete(id);
    await this.invalidateUserCache(id);
    await this.invalidateListCache();
  }

  private async invalidateUserCache(id: string): Promise<void> {
    await this.cacheManager.del(this.CACHE_KEYS.USER(id));
  }

  private async invalidateListCache(): Promise<void> {
    try {
      const commonLimits = [10, 20, 50];
      const pages = Array.from({ length: 10 }, (_, i) => i + 1);

      const invalidationPromises = pages.flatMap(page =>
        commonLimits.map(limit =>
          this.cacheManager.del(this.CACHE_KEYS.USERS_LIST(page, limit))
        )
      );

      await Promise.all(invalidationPromises);
      await this.cacheManager.del('users:total');
    } catch (error) {
      console.error('Error invalidating list cache:', error);
    }
  }
} 