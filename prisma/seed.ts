import { PrismaClient, TeamRole, HackathonStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      clerkId: "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
      username: 'johndoe',
      email: 'john@example.com',
      fullName: 'John Doe',
      bio: 'Enthusiastic developer',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      clerkId: "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
      username: 'janedoe',
      email: 'jane@example.com',
      fullName: 'Jane Doe',
      bio: 'UX/UI designer',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      clerkId: "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
      username: 'bobsmith',
      email: 'bob@example.com',
      fullName: 'Bob Smith',
      bio: 'Data scientist',
    },
  });

  // Create Hackathons
  const hackathon1 = await prisma.hackathon.create({
    data: {
      name: 'Web3 Innovation Hackathon',
      description: 'Building the future of decentralized applications',
      location: 'Virtual',
      startDate: new Date('2024-10-15'),
      endDate: new Date('2024-10-17'),
      maxParticipants: 200,
      registrationDeadline: new Date('2024-10-10'),
      status: HackathonStatus.UPCOMING,
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      name: 'AI for Good Hackathon',
      description: 'Leveraging AI to solve global challenges',
      location: 'New York, NY',
      startDate: new Date('2024-11-20'),
      endDate: new Date('2024-11-22'),
      maxParticipants: 150,
      registrationDeadline: new Date('2024-11-15'),
      status: HackathonStatus.UPCOMING,
    },
  });

  // Create Teams
  const team1 = await prisma.team.create({
    data: {
      name: 'CodeCrafters',
      description: 'We craft elegant solutions to complex problems',
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'DataMinds',
      description: 'Unleashing the power of data for a better world',
    },
  });

  // Create Team Members
  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: user1.id,
      role: TeamRole.LEADER,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: user2.id,
      role: TeamRole.MEMBER,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team2.id,
      userId: user3.id,
      role: TeamRole.LEADER,
    },
  });

  // Create Team Participations
  const teamParticipation1 = await prisma.teamParticipation.create({
    data: {
      teamId: team1.id,
      hackathonId: hackathon1.id,
      totalScore: 0,
      qrCode: uuidv4(),
    },
  });

  const teamParticipation2 = await prisma.teamParticipation.create({
    data: {
      teamId: team2.id,
      hackathonId: hackathon2.id,
      totalScore: 0,
      qrCode: uuidv4(),
    },
  });

  // Create Hackathon Participations
  await prisma.hackathonParticipation.create({
    data: {
      userId: user1.id,
      hackathonId: hackathon1.id,
      teamParticipationId: teamParticipation1.id,
      totalScore: 0,
      qrPass: uuidv4(),
    },
  });

  await prisma.hackathonParticipation.create({
    data: {
      userId: user2.id,
      hackathonId: hackathon1.id,
      teamParticipationId: teamParticipation1.id,
      totalScore: 0,
      qrPass: uuidv4(),
    },
  });

  await prisma.hackathonParticipation.create({
    data: {
      userId: user3.id,
      hackathonId: hackathon2.id,
      teamParticipationId: teamParticipation2.id,
      totalScore: 0,
      qrPass: uuidv4(),
    },
  });

  // Individual participation
  await prisma.hackathonParticipation.create({
    data: {
      userId: user1.id,
      hackathonId: hackathon2.id,
      totalScore: 0,
      qrPass: uuidv4(),
    },
  });

  // Create Topics
  await prisma.topic.create({
    data: {
      hackathonId: hackathon1.id,
      name: 'Blockchain',
    },
  });

  await prisma.topic.create({
    data: {
      hackathonId: hackathon1.id,
      name: 'Smart Contracts',
    },
  });

  await prisma.topic.create({
    data: {
      hackathonId: hackathon2.id,
      name: 'Machine Learning',
    },
  });

  await prisma.topic.create({
    data: {
      hackathonId: hackathon2.id,
      name: 'Natural Language Processing',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });