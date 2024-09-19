import { Module } from '@nestjs/common';
import { HackathonsService } from './hackatons.service';
import { HackathonsController } from './hackatons.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [HackathonsController],
  providers: [HackathonsService, PrismaService],
})
export class HackatonsModule {}
