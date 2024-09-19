// teams.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from '../services/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Team, TeamMember, User } from '@prisma/client';
import { CreateTeamDto, UpdateTeamDto } from './dto';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: PrismaService;

  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    description: 'A test team',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser: User = {
    id: 'user1',
    username: 'testuser',
    email: 'testuser@example.com',
    fullName: 'Test User',
    profilePicture: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeamMembership = {
    teamId: '1',
    userId: 'user1',
    createdAt: new Date(),
  };

  const mockPrismaService = {
    team: {
      create: jest.fn().mockResolvedValue(mockTeam),
      findMany: jest.fn().mockResolvedValue([mockTeam]),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === '1') return mockTeam;
        return null;
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        if (where.id === '1') return { ...mockTeam, ...data };
        return null;
      }),
      delete: jest.fn().mockResolvedValue(mockTeam),
    },
    user: {
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === 'user1') return mockUser;
        return null;
      }),
    },
    teamMembership: {
      findMany: jest.fn().mockResolvedValue([mockTeamMembership]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a team', async () => {
      const dto: CreateTeamDto = { name: 'New Team', description: 'A new team' };
      expect(await service.create(dto)).toEqual(mockTeam);
    });
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      expect(await service.findAll()).toEqual([mockTeam]);
    });
  });

  describe('findOne', () => {
    it('should return a team by ID', async () => {
      expect(await service.findOne('1')).toEqual(mockTeam);
    });

    it('should throw an exception if team not found', async () => {
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a team by ID', async () => {
      const dto: UpdateTeamDto = { name: 'Updated Team' };
      expect(await service.update('1', dto)).toEqual({ ...mockTeam, ...dto });
    });

    it('should throw an exception if team not found', async () => {
      await expect(service.update('2', { name: 'Updated Team' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a team by ID', async () => {
      expect(await service.remove('1')).toEqual(mockTeam);
    });

    it('should throw an exception if team not found', async () => {
      await expect(service.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
  describe('addMemberToTeam', () => {
    it('should add a member to a team', async () => {
      jest.spyOn(prisma.team, 'update').mockImplementation(({ where, data }) => {
        if (where.id === '1') {
          return {
            ...mockTeam,
            members: {
              connect: { id: 'user1' },
            },
          } as any;
        }
        return null;
      });

      await expect(service.addMemberToTeam('1', 'user1')).resolves.toEqual({
        ...mockTeam,
        members: {
          connect: { id: 'user1' },
        },
      });
    });

    it('should throw an exception if team or user not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
      await expect(service.addMemberToTeam('2', 'user1')).rejects.toThrow(NotFoundException);

      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(mockTeam);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.addMemberToTeam('1', 'user2')).rejects.toThrow(NotFoundException);
    });
  });


  describe('removeMemberFromTeam', () => {
    it('should remove a member from a team', async () => {
      jest.spyOn(prisma.team, 'update').mockImplementation(({ where, data }) => {
        if (where.id === '1') {
          return {
            ...mockTeam,
            members: {
              disconnect: { id: 'user1' },
            },
          } as any; // Casting to `any` to satisfy TypeScript
        }
        return null;
      });

      await expect(service.removeMemberFromTeam('1', 'user1')).resolves.toEqual({
        ...mockTeam,
        members: {
          disconnect: { id: 'user1' },
        },
      });
    });

    it('should throw an exception if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
      await expect(service.removeMemberFromTeam('2', 'user1')).rejects.toThrow(NotFoundException);
    });
  });
  describe('getMembers', () => {
    it('should return members of a team', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue({
        ...mockTeam,
        members: [{ user: mockUser } as any], // Use `any` to bypass type checks
      } as any); // Casting to `any` to satisfy TypeScript
      await expect(service.getMembers('1')).resolves.toEqual([mockUser]);
    });

    it('should throw an exception if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
      await expect(service.getMembers('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTeamsForUser', () => {
    it('should return teams for a user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        teamMemberships: [{ team: mockTeam }]
      } as any);
      expect(await service.getTeamsForUser('user1')).toEqual([mockTeam]);
    });

    it('should throw an exception if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.getTeamsForUser('user2')).rejects.toThrow(NotFoundException);
    });
  });
});
