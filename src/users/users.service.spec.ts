import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser: User = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'Test User',
    profilePicture: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      delete: jest.fn().mockResolvedValue(mockUser),
      findMany: jest.fn().mockResolvedValue([mockUser]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await service.findAll()).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      expect(await service.findOne('user-id')).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { username: 'newuser', email: 'new@example.com', fullName: 'New User' };
      expect(await service.create(createUserDto)).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto = { fullName: 'Updated User' };
      expect(await service.update('user-id', updateUserDto)).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      expect(await service.remove('user-id')).toEqual(mockUser);
    });
  });
});
