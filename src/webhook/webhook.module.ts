import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ClerkService } from 'src/services/clerk.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [WebhookController],
  providers: [ClerkService, UsersService, PrismaService]
})
export class WebhookModule {}
