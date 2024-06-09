/*
  Warnings:

  - You are about to drop the column `clubTypeId` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `meetTime` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the `dm_ClubType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_clubTypeId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "clubTypeId",
DROP COLUMN "location",
DROP COLUMN "meetTime";

-- DropTable
DROP TABLE "dm_ClubType";

-- CreateTable
CREATE TABLE "ClubLabel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ClubLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMeeting" (
    "id" UUID NOT NULL,
    "clubId" UUID,
    "locationId" UUID,
    "meetingTimeId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMPTZ(6),
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ClubMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMeetingLocation" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMPTZ(6),
    "deletedAt" TIMESTAMPTZ(6),
    "clubMeetingId" UUID NOT NULL,

    CONSTRAINT "ClubMeetingLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubMeetingTime" (
    "id" UUID NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "day" TEXT NOT NULL,
    "clubMeetingId" UUID NOT NULL,

    CONSTRAINT "ClubMeetingTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClubToClubLabel" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubMeeting_locationId_key" ON "ClubMeeting"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMeeting_meetingTimeId_key" ON "ClubMeeting"("meetingTimeId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToClubLabel_AB_unique" ON "_ClubToClubLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToClubLabel_B_index" ON "_ClubToClubLabel"("B");

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "ClubMeetingLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_meetingTimeId_fkey" FOREIGN KEY ("meetingTimeId") REFERENCES "ClubMeetingTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToClubLabel" ADD CONSTRAINT "_ClubToClubLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToClubLabel" ADD CONSTRAINT "_ClubToClubLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "ClubLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
