import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HackathonParticipation, Prisma, TeamMember } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.prisma.user.delete({ where: { id } });
  }


  async addUserToHackathon(userId: string, hackathonId: string): Promise<HackathonParticipation> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const hackathon = await this.prisma.hackathon.findUnique({ where: { id: hackathonId } });

    if (!user || !hackathon) {
      throw new NotFoundException('User or Hackathon not found.');
    }

    return this.prisma.hackathonParticipation.create({
      data: { userId, hackathonId },
    });
  }

  async removeUserFromHackathon(userId: string, hackathonId: string): Promise<HackathonParticipation> {
    const participation = await this.prisma.hackathonParticipation.findUnique({
      where: { userId_hackathonId: { userId, hackathonId } },
    });

    if (!participation) {
      throw new NotFoundException('Hackathon Participation not found.');
    }

    return this.prisma.hackathonParticipation.delete({
      where: { id: participation.id },
    });
  }

  async addUserToTeam(userId: string, teamId: string): Promise<TeamMember> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });

    if (!user || !team) {
      throw new NotFoundException('User or Team not found.');
    }

    return this.prisma.teamMember.create({
      data: { userId, teamId, role: 'MEMBER' }, // Set role as needed
    });
  }

  async removeUserFromTeam(userId: string, teamId: string): Promise<TeamMember> {
    const member = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (!member) {
      throw new NotFoundException('Team Member not found.');
    }

    return this.prisma.teamMember.delete({
      where: { id: member.id },
    });
  }
}
