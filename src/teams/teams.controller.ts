import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { Team } from '@prisma/client';
import { CreateTeamDto, UpdateTeamDto } from './dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'The team has been successfully created.'})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of all teams'})
  findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiResponse({ status: 200, description: 'The team with the specified ID'})
  @ApiResponse({ status: 404, description: 'Team not found' })
  findOne(@Param('id') id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team by ID' })
  @ApiResponse({ status: 200, description: 'The updated team'})
  @ApiResponse({ status: 404, description: 'Team not found' })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto): Promise<Team> {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team by ID' })
  @ApiResponse({ status: 200, description: 'The team has been successfully deleted'})
  @ApiResponse({ status: 404, description: 'Team not found' })
  remove(@Param('id') id: string): Promise<Team> {
    return this.teamsService.remove(id);
  }

  @Post(':teamId/members/:userId')
  @ApiOperation({ summary: 'Добавление участника в команду' })
  @ApiResponse({ status: 200, description: 'Участник добавлен в команду.' })
  @ApiResponse({ status: 404, description: 'Команда или пользователь не найдены.' })
  async addMemberToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamsService.addMemberToTeam(teamId, userId);
  }

  @Delete(':teamId/members/:userId')
  @ApiOperation({ summary: 'Удаление участника из команды' })
  @ApiResponse({ status: 200, description: 'Участник удален из команды.' })
  @ApiResponse({ status: 404, description: 'Команда или пользователь не найдены.' })
  async removeMemberFromTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamsService.removeMemberFromTeam(teamId, userId);
  }

  @Get(':teamId/members')
  @ApiOperation({ summary: 'Получение членов команды' })
  @ApiResponse({ status: 200, description: 'Список участников команды.' })
  @ApiResponse({ status: 404, description: 'Команда не найдена.' })
  async getMembers(
    @Param('teamId') teamId: string
  ) {
    return this.teamsService.getMembers(teamId);
  }

  @Get('/users/:userId/teams')
  @ApiOperation({ summary: 'Получение команд для пользователя' })
  @ApiResponse({ status: 200, description: 'Список команд пользователя.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  async getTeamsForUser(
    @Param('userId') userId: string
  ) {
    return this.teamsService.getTeamsForUser(userId);
  }
}
