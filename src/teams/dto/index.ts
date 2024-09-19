import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Team Alpha', description: 'The name of the team' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A description of Team Alpha', description: 'The description of the team' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTeamDto {
  @ApiProperty({ example: 'Team Alpha', description: 'The name of the team' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'A description of Team Alpha', description: 'The description of the team' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class GetTeamDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'The unique identifier of the team' })
  id: string;
}

export class AddMemberToTeamDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class RemoveMemberFromTeamDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}