// teams.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from '@prisma/client';
import { CreateTeamDto, UpdateTeamDto } from './dto';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeam: Team = {
    id: '1',
    name: 'Test Team',
    description: 'A test team',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeamsService = {
    create: jest.fn().mockResolvedValue(mockTeam),
    findAll: jest.fn().mockResolvedValue([mockTeam]),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue(mockTeam),
    remove: jest.fn().mockResolvedValue(mockTeam),
    addMemberToTeam: jest.fn().mockResolvedValue(mockTeam),
    removeMemberFromTeam: jest.fn().mockResolvedValue(mockTeam),
    getMembers: jest.fn().mockResolvedValue([]),
    getTeamsForUser: jest.fn().mockResolvedValue([mockTeam]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [{ provide: TeamsService, useValue: mockTeamsService }],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a team', async () => {
      const dto: CreateTeamDto = { name: 'New Team', description: 'A new team' };
      expect(await controller.create(dto)).toEqual(mockTeam);
    });
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      expect(await controller.findAll()).toEqual([mockTeam]);
    });
  });

  describe('findOne', () => {
    it('should return a team by ID', async () => {
      expect(await controller.findOne('1')).toEqual(mockTeam);
    });
  });

  describe('update', () => {
    it('should update a team by ID', async () => {
      const dto: UpdateTeamDto = { name: 'Updated Team' };
      expect(await controller.update('1', dto)).toEqual(mockTeam);
    });
  });

  describe('remove', () => {
    it('should delete a team by ID', async () => {
      expect(await controller.remove('1')).toEqual(mockTeam);
    });
  });

  describe('addMemberToTeam', () => {
    it('should add a member to a team', async () => {
      expect(await controller.addMemberToTeam('1', 'user1')).toEqual(mockTeam);
    });
  });

  describe('removeMemberFromTeam', () => {
    it('should remove a member from a team', async () => {
      expect(await controller.removeMemberFromTeam('1', 'user1')).toEqual(mockTeam);
    });
  });

  describe('getMembers', () => {
    it('should return members of a team', async () => {
      expect(await controller.getMembers('1')).toEqual([]);
    });
  });

  describe('getTeamsForUser', () => {
    it('should return teams for a user', async () => {
      expect(await controller.getTeamsForUser('user1')).toEqual([mockTeam]);
    });
  });
});
