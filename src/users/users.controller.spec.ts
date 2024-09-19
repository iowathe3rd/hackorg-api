import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'Test User',
    profilePicture: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      expect(await controller.findOne('user-id')).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { username: 'newuser', email: 'new@example.com', fullName: 'New User' };
      expect(await controller.create(createUserDto)).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto: UpdateUserDto = { fullName: 'Updated User' };
      expect(await controller.update('user-id', updateUserDto)).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      expect(await controller.remove('user-id')).toEqual(mockUser);
    });
  });
});
