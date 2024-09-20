import { Injectable, NotFoundException } from '@nestjs/common';
import { Hackathon, HackathonParticipation, Team, TeamParticipation } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { AddTeamToHackathonDto, CreateHackathonDto, UpdateHackathonDto } from './dto';

@Injectable()
export class HackathonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHackathonDto: CreateHackathonDto): Promise<Hackathon> {
    return this.prisma.hackathon.create({
      data: createHackathonDto,
    });
  }

  async findAll(): Promise<Hackathon[]> {
    return this.prisma.hackathon.findMany({
      include: {
        participants: true,
        teamParticipations: true,
        topics: true,
      },
    });
  }

  async findOne(id: string): Promise<Hackathon> {
    const hackathon = await this.prisma.hackathon.findUnique({ where: { id },       include: {
      participants: true,
      teamParticipations: true,
      topics: true,
    }, });
    if (!hackathon) {
      throw new NotFoundException(`Hackathon with id ${id} not found`);
    }
    return hackathon;
  }

  async update(id: string, updateHackathonDto: UpdateHackathonDto): Promise<Hackathon> {
    const existingHackathon = await this.prisma.hackathon.findUnique({ where: { id } });
    if (!existingHackathon) {
      throw new NotFoundException(`Hackathon with id ${id} not found`);
    }
    return this.prisma.hackathon.update({
      where: { id },
      data: updateHackathonDto,
    });
  }

  async remove(id: string): Promise<Hackathon> {
    const existingHackathon = await this.prisma.hackathon.findUnique({ where: { id } });
    if (!existingHackathon) {
      throw new NotFoundException(`Hackathon with id ${id} not found`);
    }
    return this.prisma.hackathon.delete({ where: { id } });
  }

  async addTeamToHackathon(hackathonId: string, teamId: string): Promise<TeamParticipation> {
    const hackathon = await this.prisma.hackathon.findUnique({ where: { id: hackathonId } });
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });

    if (!hackathon || !team) {
      throw new NotFoundException('Hackathon or Team not found.');
    }

    return this.prisma.teamParticipation.create({
      data: { teamId, hackathonId },
    });
  }

  async removeTeamFromHackathon(hackathonId: string, teamId: string): Promise<TeamParticipation> {
    const participation = await this.prisma.teamParticipation.findUnique({
      where: { teamId_hackathonId: { teamId, hackathonId } },
    });

    if (!participation) {
      throw new NotFoundException('Team Participation not found.');
    }

    return this.prisma.teamParticipation.delete({
      where: { id: participation.id },
    });
  }

  async getParticipants(hackathonId: string): Promise<any[]> { // Укажите правильный тип для участников
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { participants: true },
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found.');
    }

    return hackathon.participants;
  }

  async getTeams(hackathonId: string): Promise<Team[]> {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { teamParticipations: { include: {
        hackathon: true,
        participants: true,
        team: true
      } } },
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found.');
    }

    return hackathon.teamParticipations.map(tp => tp.team);
  }

  async getAllHackathons() {
    return this.prisma.hackathon.findMany({
      include: {
        participants: true,
        teamParticipations: true,
        topics: true,
      },
    });
  }

  // Новый метод для получения конкретного хакатона по ID
  async getHackathon(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
      include: {
        participants: true,
        teamParticipations: true,
        topics: true,
      },
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found.');
    }

    return hackathon;
  }
}
