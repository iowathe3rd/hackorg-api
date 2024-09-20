import { Controller, Post, Body, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Webhook } from 'svix';
import { ClerkService } from 'src/services/clerk.service';
import { PrismaService } from 'src/services/prisma.service';
import { UsersService } from 'src/users/users.service';

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
      console.log('nevermind')
    }
  }

  @Post()
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() payload: any,
  ): Promise<any> {
    this.validateHeaders(svixId, svixTimestamp, svixSignature);

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
      throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
    }

    return this.processEvent(evt);
  }

  private validateHeaders(svixId: string, svixTimestamp: string, svixSignature: string) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new HttpException('Missing SVIX headers', HttpStatus.BAD_REQUEST);
    }
  }

  private async processEvent(evt: any): Promise<any> {
    const { id, type: eventType } = evt;

    try {
      switch (eventType) {
        case 'user.created':
          return await this.handleUserCreated(evt.data);
        case 'user.updated':
          return await this.handleUserUpdated(evt.data);
        case 'user.deleted':
          return await this.handleUserDeleted(evt.data);
        default:
          this.logger.warn(`Unknown event type: ${eventType} with ID: ${id}`);
          return { message: 'Unknown event type' };
      }
    } catch (error) {
      this.logger.error(`Error processing event ${eventType}:`, error);
      throw new HttpException('Error processing event', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async handleUserCreated(data: any): Promise<any> {
    const { id, email_addresses, image_url, first_name, last_name, username } = data;

    const newUser = await this.userService.create({
      email: email_addresses[0].email_address,
      fullName: `${first_name} ${last_name}`,
      username: username!,
      clerkId: id as string,
      profilePicture: image_url,
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

  private async handleUserUpdated(data: any): Promise<any> {
    const { id, image_url, first_name, last_name, username } = data;

    const updatedUser = await this.prismaService.user.update({
      where: { clerkId: id as string },
      data: {
        fullName: `${first_name} ${last_name}`,
        profilePicture: image_url,
      },
    });

    return { message: 'OK', user: updatedUser };
  }

  private async handleUserDeleted(data: any): Promise<any> {
    const { id } = data;

    const deletedUser = await this.prismaService.user.delete({
      where: { clerkId: id },
    });

    return { message: 'OK', user: deletedUser };
  }
}
