import { Injectable } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  async updateUserMetadata(userId: string, metadata: any): Promise<void> {
    await clerkClient.users.updateUserMetadata(userId, metadata);
  }
}
