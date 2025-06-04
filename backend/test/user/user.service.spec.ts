import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../../src/modules/user/application/services/user.service';
import { User } from '../../src/modules/user/domain/entities/user.entity';
import { HttpException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/modules/user/domain/repositories/user.repository.token';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;
  let mockCacheManager: any;

  const mockUser = new User(
    'Test User',
    'test@example.com',
    'hashedPassword',
    new Date('2025-06-03'),
    new Date('2025-06-03'),
    '1283d608-7703-4f6a-9879-9930add91250');

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.getName()).toBe('Test User');
      expect(result.getEmail()).toBe('test@example.com');
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw exception if email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    const userId = '123';

    it('should return user from cache if available', async () => {
      mockCacheManager.get.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toBe(mockUser);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('should fetch user from repository if not in cache', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toBe(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw exception if user not found', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    const userId = '123';
    const updateUserDto = {
      name: 'Updated Name',
    };

    it('should update user successfully', async () => {
      const updatedUser = new User(
        'Updated Name',
        'test@example.com',
        'hashedPassword',
      );

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result?.getName()).toBe('Updated Name');
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalled();
    });

    it('should throw exception if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    const userId = '123';

    it('should delete user successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      await service.delete(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(mockCacheManager.del).toHaveBeenCalled();
    });

    it('should throw exception if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.delete(userId)).rejects.toThrow(HttpException);
    });
  });
}); 