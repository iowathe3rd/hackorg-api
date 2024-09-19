import { Controller, Post, Body, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';import e from 'express';
import prisma from 'src/lib/db';
import { ClerkService } from 'src/services/clerk.service';
import { PrismaService } from 'src/services/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Webhook } from 'svix';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private readonly webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  constructor(
    private readonly clerkService: ClerkService,
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
  ) {
    if (!this.webhookSecret) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
    }
  }

  @Post()
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() payload: any,
  ): Promise<any> {
    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new HttpException('Error occurred -- no svix headers', HttpStatus.BAD_REQUEST);
    }

    const body = JSON.stringify(payload);
    const wh = new Webhook(this.webhookSecret);

    let evt;

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      this.logger.error('Error verifying webhook:', err);
      throw new HttpException('Error occurred', HttpStatus.BAD_REQUEST);
    }

    const { id, type: eventType } = evt;

    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

        const newUser = await this.userService.create({
          email: email_addresses[0].email_address,
          fullName: `${first_name} ${last_name}`,
          username: username!,
          clerkId: id as string,
        });

        if (newUser) {
          await this.clerkService.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser.id,
            },
          });
        }

        return { message: 'OK', user: newUser };
      }

      case 'user.updated': {
        const { id, image_url, first_name, last_name, username } = evt.data;

        const user = {
          firstName: first_name,
          lastName: last_name,
          username: username!,
          photo: image_url,
        };

        const updatedUser = await this.prismaService.user.update({
          where: {
            clerkId: id as string,
          },
          data: user
        });

        return { message: 'OK', user: updatedUser };
      }

      case 'user.deleted': {
        const { id } = evt.data;

        const deleted = await prisma.user.delete({
          where: {
            clerkId: id,
          }
        })

        return { message: 'OK', user: deleted };
      }

      default:
        this.logger.log(`Webhook with ID ${id} and type ${eventType}`);
        this.logger.log('Webhook body:', body);
        return { message: 'Unknown event type' };
    }
  }
}
