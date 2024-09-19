import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../services/prisma.service';
import { CreateHackathonDto, UpdateHackathonDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { Hackathon, Team, TeamParticipation } from '@prisma/client';
import { HackathonsService } from './hackatons.service';

describe('HackathonsService', () => {
  let service: HackathonsService;
  let prisma: PrismaService;

  const mockHackathon: Hackathon = {
    id: '1',
    name: 'Hackathon Test',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    location: 'Test Location',
    maxParticipants: 10,
    registrationDeadline: new Date(),
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

  const mockPrismaService = {
    hackathon: {
      create: jest.fn().mockResolvedValue(mockHackathon),
      findMany: jest.fn().mockResolvedValue([mockHackathon]),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === '1') return mockHackathon;
        return null;
      }),
      update: jest.fn().mockResolvedValue(mockHackathon),
      delete: jest.fn().mockResolvedValue(mockHackathon),
    },
    team: {
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        if (id === 'team1') return mockTeam;
        return null;
      }),
    },
    teamParticipation: {
      create: jest.fn().mockResolvedValue(mockTeamParticipation),
      findUnique: jest.fn().mockImplementation(({ where: { teamId_hackathonId } }) => {
        if (teamId_hackathonId.teamId === 'team1' && teamId_hackathonId.hackathonId === '1') {
          return mockTeamParticipation;
        }
        return null;
      }),
      delete: jest.fn().mockResolvedValue(mockTeamParticipation),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HackathonsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<HackathonsService>(HackathonsService);
    prisma = module.get<PrismaService>(PrismaService);
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
      };
      await expect(service.create(dto)).resolves.toEqual(mockHackathon);
    });
  });

  describe('update', () => {
    it('should update an existing hackathon', async () => {
      const dto: UpdateHackathonDto = {
        name: 'Updated Hackathon',
        description: 'Updated Description',
      };
      await expect(service.update('1', dto)).resolves.toEqual(mockHackathon);
    });
  });

  describe('addTeamToHackathon', () => {
    it('should add a team to a hackathon', async () => {
      await expect(service.addTeamToHackathon('1', 'team1')).resolves.toEqual(mockTeamParticipation);
    });

    it('should throw NotFoundException if hackathon or team not found', async () => {
      jest.spyOn(prisma.hackathon, 'findUnique').mockResolvedValue(null);
      await expect(service.addTeamToHackathon('1', 'team1')).rejects.toThrow(NotFoundException);

      jest.spyOn(prisma.hackathon, 'findUnique').mockResolvedValue(mockHackathon);
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
      await expect(service.addTeamToHackathon('1', 'team1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeTeamFromHackathon', () => {
    it('should remove a team from a hackathon', async () => {
      await expect(service.removeTeamFromHackathon('1', 'team1')).resolves.toEqual(mockTeamParticipation);
    });

    it('should throw NotFoundException if team participation not found', async () => {
      jest.spyOn(prisma.teamParticipation, 'findUnique').mockResolvedValue(null);
      await expect(service.removeTeamFromHackathon('1', 'team1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getParticipants', () => {
    it('should return participants of a hackathon', async () => {
      await expect(service.getParticipants('1')).resolves.toEqual([]);
    });

    it('should throw NotFoundException if hackathon not found', async () => {
      jest.spyOn(prisma.hackathon, 'findUnique').mockResolvedValue(null);
      await expect(service.getParticipants('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTeams', () => {
    it('should return teams of a hackathon', async () => {
      await expect(service.getTeams('1')).resolves.toEqual([mockTeam]);
    });

    it('should throw NotFoundException if hackathon not found', async () => {
      jest.spyOn(prisma.hackathon, 'findUnique').mockResolvedValue(null);
      await expect(service.getTeams('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllHackathons', () => {
    it('should return all hackathons', async () => {
      await expect(service.getAllHackathons()).resolves.toEqual([mockHackathon]);
    });
  });

  describe('getHackathon', () => {
    it('should return a specific hackathon by ID', async () => {
      await expect(service.getHackathon('1')).resolves.toEqual(mockHackathon);
    });

    it('should throw NotFoundException if hackathon not found', async () => {
      jest.spyOn(prisma.hackathon, 'findUnique').mockResolvedValue(null);
      await expect(service.getHackathon('2')).rejects.toThrow(NotFoundException);
    });
  });
});
