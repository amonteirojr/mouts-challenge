import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../../src/modules/user/presentation/controllers/user.controller';
import { UserService } from '../../src/modules/user/application/services/user.service';
import { User } from '../../src/modules/user/domain/entities/user.entity';
import { HttpException } from '@nestjs/common';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser = new User(
    'Test User',
    'test@example.com',
    'hashedPassword',
    new Date('2025-06-03'),
    new Date('2025-06-03'),
    '1283d608-7703-4f6a-9879-9930add91250'
  );

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      // Arrange
      mockUserService.create.mockResolvedValue(mockUser);

      // Act
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Assert
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should return 409 when email already exists', async () => {
      // Arrange
      mockUserService.create.mockRejectedValue(new HttpException('User already exists', 409));

      // Act & Assert
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });

  describe('GET /users/:id', () => {
    const userId = '123';

    it('should return user by id', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
    });

    it('should return 404 when user not found', async () => {
      mockUserService.findById.mockRejectedValue(new HttpException('User not found', 404));

      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
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

      mockUserService.update.mockResolvedValue(updatedUser);

      const response = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Updated Name');
      expect(mockUserService.update).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it('should return 404 when user not found', async () => {
      mockUserService.update.mockRejectedValue(new HttpException('User not found', 404));

      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    const userId = '123';

    it('should delete user successfully', async () => {
      mockUserService.delete.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(204);

      expect(mockUserService.delete).toHaveBeenCalledWith(userId);
    });

    it('should return 404 when user not found', async () => {
      mockUserService.delete.mockRejectedValue(new HttpException('User not found', 404));

      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(404);
    });
  });
}); 