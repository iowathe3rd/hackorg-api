import { PrismaClient, TeamRole, HackathonStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create Users using Faker.js
  const users = [];
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        clerkId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        bio: faker.lorem.sentence(),
      },
    });
    users.push(user);
  }

  // Create Hackathons using Faker.js
  const hackathons = [];
  for (let i = 0; i < 2; i++) {
    const hackathon = await prisma.hackathon.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        location: faker.address.city(),
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        maxParticipants: faker.number.int({ min: 50, max: 300 }),
        registrationDeadline: faker.date.future(),
        status: faker.helpers.arrayElement([
          HackathonStatus.UPCOMING,
          HackathonStatus.ONGOING,
          HackathonStatus.FINISHED,
        ]),
      },
    });
    hackathons.push(hackathon);
  }

  // Create Teams using Faker.js
  const teams = [];
  for (let i = 0; i < 2; i++) {
    const team = await prisma.team.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
      },
    });
    teams.push(team);
  }

  // Create Team Members using Faker.js
  for (let i = 0; i < 2; i++) {
    await prisma.teamMember.create({
      data: {
        teamId: teams[i].id,
        userId: users[i].id,
        role: TeamRole.LEADER,
      },
    });
  }

  await prisma.teamMember.create({
    data: {
      teamId: teams[0].id,
      userId: users[1].id,
      role: TeamRole.MEMBER,
    },
  });

  // Create Team Participations
  const teamParticipation1 = await prisma.teamParticipation.create({
    data: {
      teamId: teams[0].id,
      hackathonId: hackathons[0].id,
      totalScore: faker.number.int({ min: 0, max: 100 }),
      qrCode: uuidv4(),
    },
  });

  const teamParticipation2 = await prisma.teamParticipation.create({
    data: {
      teamId: teams[1].id,
      hackathonId: hackathons[1].id,
      totalScore: faker.number.int({ min: 0, max: 100 }),
      qrCode: uuidv4(),
    },
  });

  // Create Hackathon Participations using Faker.js
  await prisma.hackathonParticipation.create({
    data: {
      userId: users[0].id,
      hackathonId: hackathons[0].id,
      teamParticipationId: teamParticipation1.id,
      totalScore: faker.number.int({ min: 0, max: 100 }),
      qrPass: uuidv4(),
    },
  });

  await prisma.hackathonParticipation.create({
    data: {
      userId: users[1].id,
      hackathonId: hackathons[0].id,
      teamParticipationId: teamParticipation1.id,
      totalScore: faker.number.int({ min: 0, max: 100 }),
      qrPass: uuidv4(),
    },
  });

  await prisma.hackathonParticipation.create({
    data: {
      userId: users[2].id,
      hackathonId: hackathons[1].id,
      teamParticipationId: teamParticipation2.id,
      totalScore: faker.number.int({ min: 0, max: 100 }),
      qrPass: uuidv4(),
    },
  });

  // Individual Hackathon Participation
  await prisma.hackathonParticipation.create({
    data: {
      userId: users[0].id,
      hackathonId: hackathons[1].id,
      totalScore: faker.number.int({ min: 0, max: 100 }),
      qrPass: uuidv4(),
    },
  });

  // Create Topics using Faker.js
  for (let i = 0; i < 2; i++) {
    await prisma.topic.create({
      data: {
        hackathonId: hackathons[0].id,
        name: faker.hacker.noun(),
      },
    });

    await prisma.topic.create({
      data: {
        hackathonId: hackathons[1].id,
        name: faker.hacker.noun(),
      },
    });
  }

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
