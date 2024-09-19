import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Unique id of clerk entity' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  clerkId: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username for the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Unique email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg', description: 'Profile picture URL' })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'Software developer', description: 'Short biography of the user' })
  @IsString()
  @IsOptional()
  bio?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'johndoe', description: 'Unique username for the user' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'john@example.com', description: 'Unique email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg', description: 'Profile picture URL' })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ example: 'Software developer', description: 'Short biography of the user' })
  @IsString()
  @IsOptional()
  bio?: string;
}

export class AddUserToHackathonDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Hackathon ID' })
  @IsString()
  @IsNotEmpty()
  hackathonId: string;
}

export class RemoveUserFromHackathonDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Hackathon ID' })
  @IsString()
  @IsNotEmpty()
  hackathonId: string;
}

export class AddUserToTeamDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  teamId: string;
}

export class RemoveUserFromTeamDto {
  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'f1e2d3c4-b5a6-7890-abcd-ef1234567890', description: 'Team ID' })
  @IsString()
  @IsNotEmpty()
  teamId: string;
}