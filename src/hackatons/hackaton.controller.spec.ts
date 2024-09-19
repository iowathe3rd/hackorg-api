import { Test, TestingModule } from '@nestjs/testing';
import { CreateHackathonDto, UpdateHackathonDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { Hackathon, Team, TeamParticipation } from '@prisma/client';
import { HackathonsController } from './hackatons.controller';
import { HackathonsService } from './hackatons.service';

describe('HackathonsController', () => {
  let controller: HackathonsController;
  let service: HackathonsService;

  const mockHackathon: Hackathon = {
    id: '1',
    name: 'Hackathon Test',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    endDate: new Date(),
    location: 'Test Location',
    maxParticipants: 10,
    registrationDeadline: new Date(),
    startDate: new Date(),
    status: 'FINISHED',
  };

  const mockTeam: Team = {
    id: 'team1',
    name: 'Team Test',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeamParticipation: TeamParticipation = {
    teamId: 'team1',
    hackathonId: '1',
    id: '1',
    createdAt: new Date(),
    qrCode: '123456',
    totalScore: 0,
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockHackathon),
    update: jest.fn().mockResolvedValue(mockHackathon),
    addTeamToHackathon: jest.fn().mockResolvedValue(mockTeamParticipation),
    removeTeamFromHackathon: jest.fn().mockResolvedValue(mockTeamParticipation),
    getParticipants: jest.fn().mockResolvedValue([]),
    getTeams: jest.fn().mockResolvedValue([mockTeam]),
    getAllHackathons: jest.fn().mockResolvedValue([mockHackathon]),
    getHackathon: jest.fn().mockResolvedValue(mockHackathon),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HackathonsController],
      providers: [
        { provide: HackathonsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<HackathonsController>(HackathonsController);
    service = module.get<HackathonsService>(HackathonsService);
  });

  describe('create', () => {
    it('should create a new hackathon', async () => {
      const dto: CreateHackathonDto = {
        name: 'Hackathon Test',
        description: 'Test Description',
        endDate: new Date(),
        location: 'Test Location',
        maxParticipants: 10,
        registrationDeadline: new Date(),
        startDate: new Date(),
        status: 'FINISHED',
      };
      await expect(controller.create(dto)).resolves.toEqual(mockHackathon);
    });
  });

  describe('update', () => {
    it('should update an existing hackathon', async () => {
      const dto: UpdateHackathonDto = {
        name: 'Updated Hackathon',
        description: 'Updated Description',
      };
      await expect(controller.update('1', dto)).resolves.toEqual(mockHackathon);
    });
  });

  describe('addTeamToHackathon', () => {
    it('should add a team to a hackathon', async () => {
      await expect(controller.addTeamToHackathon('1', 'team1')).resolves.toEqual(mockTeamParticipation);
    });
  });

  describe('removeTeamFromHackathon', () => {
    it('should remove a team from a hackathon', async () => {
      await expect(controller.removeTeamFromHackathon('1', 'team1')).resolves.toEqual(mockTeamParticipation);
    });
  });

  describe('getParticipants', () => {
    it('should return participants of a hackathon', async () => {
      await expect(controller.getParticipants('1')).resolves.toEqual([]);
    });
  });

  describe('getTeams', () => {
    it('should return teams of a hackathon', async () => {
      await expect(controller.getTeams('1')).resolves.toEqual([mockTeam]);
    });
  });

  describe('getAllHackathons', () => {
    it('should return all hackathons', async () => {
      await expect(controller.getAllHackathons()).resolves.toEqual([mockHackathon]);
    });
  });

  describe('getHackathon', () => {
    it('should return a specific hackathon by ID', async () => {
      await expect(controller.getHackathon('1')).resolves.toEqual(mockHackathon);
    });
  });

  describe('handle exceptions', () => {
    it('should throw NotFoundException if hackathon not found in getParticipants', async () => {
      jest.spyOn(service, 'getParticipants').mockRejectedValue(new NotFoundException());
      await expect(controller.getParticipants('2')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if hackathon not found in getTeams', async () => {
      jest.spyOn(service, 'getTeams').mockRejectedValue(new NotFoundException());
      await expect(controller.getTeams('2')).rejects.toThrow(NotFoundException);
    });
  });
});
