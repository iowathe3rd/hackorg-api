import { Injectable, NotFoundException } from '@nestjs/common';
import { Team, TeamParticipation, User } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { CreateTeamDto, UpdateTeamDto } from './dto';
import { isRFC3339 } from 'class-validator';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    return this.prisma.team.create({
      data: {
        description: createTeamDto.description,
        name: createTeamDto.name,
      },
    });
  }

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany();
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const existingTeam = await this.prisma.team.findUnique({ where: { id } });
    if (!existingTeam) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async remove(id: string): Promise<Team> {
    const existingTeam = await this.prisma.team.findUnique({ where: { id } });
    if (!existingTeam) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    return this.prisma.team.delete({ where: { id } });
  }

  async addMemberToTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!team || !user) {
      throw new NotFoundException('Team or User not found.');
    }

    // Check if user is already a member of the team
    const existingMembership = await this.prisma.user.findUnique({
      where: {
        id: userId,
        AND: {
          teamMemberships: {
            some: {
              teamId: teamId
            }
          }
        }
      }
    });

    if (existingMembership) {
      throw new NotFoundException('User is already a member of the team.');
    }
    // Return the updated team with its members
    const updated = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: { id: userId }
        }
      }
    })

    return updated;
  }

  async removeMemberFromTeam(teamId: string, userId: string): Promise<Team> {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });

    if(!team){
      throw new NotFoundException('Team not found.');
    }

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          disconnect: { id: userId }
        }
      }
    })
  }

  async getMembers(teamId: string): Promise<User[]> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { include: { user: true } } },
    });

    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    return team.members.map(member => member.user);
  }

  async getTeamsForUser(userId: string): Promise<Team[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { teamMemberships: { include: { team: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user.teamMemberships.map(membership => membership.team);
  }
}
