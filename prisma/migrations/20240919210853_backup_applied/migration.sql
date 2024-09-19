-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "HackathonStatus" AS ENUM ('UPCOMING', 'ONGOING', 'FINISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id","clerkId")
);

-- CreateTable
CREATE TABLE "Hackathon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "status" "HackathonStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HackathonParticipation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "teamParticipationId" TEXT,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "qrPass" TEXT,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackathonParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamParticipation" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HackathonParticipation_qrPass_key" ON "HackathonParticipation"("qrPass");

-- CreateIndex
CREATE UNIQUE INDEX "HackathonParticipation_userId_hackathonId_key" ON "HackathonParticipation"("userId", "hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamParticipation_qrCode_key" ON "TeamParticipation"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "TeamParticipation_teamId_hackathonId_key" ON "TeamParticipation"("teamId", "hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_userId_teamId_key" ON "TeamMember"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_hackathonId_name_key" ON "Topic"("hackathonId", "name");

-- AddForeignKey
ALTER TABLE "HackathonParticipation" ADD CONSTRAINT "HackathonParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonParticipation" ADD CONSTRAINT "HackathonParticipation_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonParticipation" ADD CONSTRAINT "HackathonParticipation_teamParticipationId_fkey" FOREIGN KEY ("teamParticipationId") REFERENCES "TeamParticipation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamParticipation" ADD CONSTRAINT "TeamParticipation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamParticipation" ADD CONSTRAINT "TeamParticipation_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
