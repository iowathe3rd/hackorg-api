import { ApiProperty } from '@nestjs/swagger';
import { HackathonStatus } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateHackathonDto {
  @ApiProperty({ example: 'Vercel Hackathon 2023', description: 'The name of the hackathon' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Join us for an exciting 48-hour coding challenge!', description: 'The description of the hackathon' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Online (Remote)', description: 'The location of the hackathon' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '2023-06-15T00:00:00Z', description: 'The start date of the hackathon' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-06-17T00:00:00Z', description: 'The end date of the hackathon' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: 100, description: 'The maximum number of participants' })
  @IsInt()
  @IsNotEmpty()
  maxParticipants: number;

  @ApiProperty({ example: '2023-06-10T00:00:00Z', description: 'The registration deadline' })
  @IsDateString()
  @IsNotEmpty()
  registrationDeadline: Date;

  @ApiProperty({ example: 'UPCOMING', description: 'The status of the hackathon' })
  @IsString()
  @IsOptional()
  status?: HackathonStatus;
}

export class UpdateHackathonDto {
  @ApiProperty({ example: 'Vercel Hackathon 2023', description: 'The name of the hackathon' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Join us for an exciting 48-hour coding challenge!', description: 'The description of the hackathon' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Online (Remote)', description: 'The location of the hackathon' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '2023-06-15T00:00:00Z', description: 'The start date of the hackathon' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ example: '2023-06-17T00:00:00Z', description: 'The end date of the hackathon' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ example: 100, description: 'The maximum number of participants' })
  @IsInt()
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ example: '2023-06-10T00:00:00Z', description: 'The registration deadline' })
  @IsDateString()
  @IsOptional()
  registrationDeadline?: Date;

  @ApiProperty({ example: 'UPCOMING', description: 'The status of the hackathon' })
  @IsString()
  @IsOptional()
  status?: HackathonStatus;
}

export class GetHackathonDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'The unique identifier of the hackathon' })
  id: string;
}

export class AddTeamToHackathonDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Hackathon ID' })
  @IsString()
  @IsNotEmpty()
  hackathonId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  teamId: string;
}

export class RemoveTeamFromHackathonDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Hackathon ID' })
  @IsString()
  @IsNotEmpty()
  hackathonId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  teamId: string;
}