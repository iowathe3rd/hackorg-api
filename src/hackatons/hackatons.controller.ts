import { Controller, Post, Delete, Get, Param, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HackathonsService } from './hackatons.service';
import { CreateHackathonDto, UpdateHackathonDto } from './dto';

@ApiTags('Hackathons')
@Controller('hackathons')
export class HackathonsController {
  constructor(private readonly hackathonsService: HackathonsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание нового хакатона' })
  @ApiResponse({ status: 201, description: 'Хакатон создан.' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации данных.' })
  create(@Body() createHackathonDto: CreateHackathonDto) {
    return this.hackathonsService.create(createHackathonDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление данных хакатона' })
  @ApiResponse({ status: 200, description: 'Хакатон обновлен.' })
  @ApiResponse({ status: 404, description: 'Хакатон не найден.' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации данных.' })
  update(@Param('id') id: string, @Body() updateHackathonDto: UpdateHackathonDto) {
    return this.hackathonsService.update(id, updateHackathonDto);
  }

  @Post(':hackathonId/teams/:teamId')
  @ApiOperation({ summary: 'Добавление команды в хакатон' })
  @ApiResponse({ status: 200, description: 'Команда добавлена в хакатон.' })
  @ApiResponse({ status: 404, description: 'Хакатон или команда не найдены.' })
  async addTeamToHackathon(
    @Param('hackathonId') hackathonId: string,
    @Param('teamId') teamId: string
  ) {
    return this.hackathonsService.addTeamToHackathon(hackathonId, teamId);
  }

  @Delete(':hackathonId/teams/:teamId')
  @ApiOperation({ summary: 'Удаление команды из хакатона' })
  @ApiResponse({ status: 200, description: 'Команда удалена из хакатона.' })
  @ApiResponse({ status: 404, description: 'Хакатон или команда не найдены.' })
  async removeTeamFromHackathon(
    @Param('hackathonId') hackathonId: string,
    @Param('teamId') teamId: string
  ) {
    return this.hackathonsService.removeTeamFromHackathon(hackathonId, teamId);
  }

  @Get(':hackathonId/participants')
  @ApiOperation({ summary: 'Получение участников хакатона' })
  @ApiResponse({ status: 200, description: 'Список участников хакатона.' })
  @ApiResponse({ status: 404, description: 'Хакатон не найден.' })
  async getParticipants(@Param('hackathonId') hackathonId: string) {
    return this.hackathonsService.getParticipants(hackathonId);
  }

  @Get(':hackathonId/teams')
  @ApiOperation({ summary: 'Получение команд хакатона' })
  @ApiResponse({ status: 200, description: 'Список команд хакатона.' })
  @ApiResponse({ status: 404, description: 'Хакатон не найден.' })
  async getTeams(@Param('hackathonId') hackathonId: string) {
    return this.hackathonsService.getTeams(hackathonId);
  }

    // Новый метод для получения всех хакатонов
    @Get()
    @ApiOperation({ summary: 'Получение всех хакатонов' })
    @ApiResponse({ status: 200, description: 'Список всех хакатонов.' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера.' })
    async getAllHackathons() {
      return this.hackathonsService.getAllHackathons();
    }
  
    // Новый метод для получения конкретного хакатона
    @Get(':id')
    @ApiOperation({ summary: 'Получение хакатона по ID' })
    @ApiResponse({ status: 200, description: 'Информация о хакатоне.' })
    @ApiResponse({ status: 404, description: 'Хакатон не найден.' })
    async getHackathon(@Param('id') id: string) {
      return this.hackathonsService.getHackathon(id);
    }
}
