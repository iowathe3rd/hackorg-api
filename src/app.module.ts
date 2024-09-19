import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { HackatonsModule } from './hackatons/hackatons.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [UsersModule, TeamsModule, HackatonsModule, WebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
