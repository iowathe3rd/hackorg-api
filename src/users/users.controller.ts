import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully.', type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users retrieved successfully.', type: [CreateUserDto] })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found.', type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully.', type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @HttpCode(HttpStatus.OK)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'User deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':userId/hackathons/:hackathonId')
  @ApiOperation({ summary: 'Добавление пользователя в хакатон' })
  @ApiResponse({ status: 200, description: 'Пользователь добавлен в хакатон.' })
  @ApiResponse({ status: 404, description: 'Пользователь или хакатон не найден.' })
  async addUserToHackathon(
    @Param('userId') userId: string,
    @Param('hackathonId') hackathonId: string
  ) {
    return this.usersService.addUserToHackathon(userId, hackathonId);
  }

  @Delete(':userId/hackathons/:hackathonId')
  @ApiOperation({ summary: 'Удаление пользователя из хакатона' })
  @ApiResponse({ status: 200, description: 'Пользователь удален из хакатона.' })
  @ApiResponse({ status: 404, description: 'Пользователь или хакатон не найден.' })
  async removeUserFromHackathon(
    @Param('userId') userId: string,
    @Param('hackathonId') hackathonId: string
  ) {
    return this.usersService.removeUserFromHackathon(userId, hackathonId);
  }

  @Post(':userId/teams/:teamId')
  @ApiOperation({ summary: 'Добавление пользователя в команду' })
  @ApiResponse({ status: 200, description: 'Пользователь добавлен в команду.' })
  @ApiResponse({ status: 404, description: 'Пользователь или команда не найдены.' })
  async addUserToTeam(
    @Param('userId') userId: string,
    @Param('teamId') teamId: string
  ) {
    return this.usersService.addUserToTeam(userId, teamId);
  }

  @Delete(':userId/teams/:teamId')
  @ApiOperation({ summary: 'Удаление пользователя из команды' })
  @ApiResponse({ status: 200, description: 'Пользователь удален из команды.' })
  @ApiResponse({ status: 404, description: 'Пользователь или команда не найдены.' })
  async removeUserFromTeam(
    @Param('userId') userId: string,
    @Param('teamId') teamId: string
  ) {
    return this.usersService.removeUserFromTeam(userId, teamId);
  }
}
