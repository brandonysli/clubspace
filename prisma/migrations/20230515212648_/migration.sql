/*
  Warnings:

  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageId` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClubAdmin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ClubAdmin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `ClubAdmin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubId` column on the `ClubAdmin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClubFollowed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ClubFollowed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `ClubFollowed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubId` column on the `ClubFollowed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClubLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `clubId` column on the `ClubLabel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `labelId` column on the `ClubLabel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClubMeeting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ClubMeeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubId` column on the `ClubMeeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locationId` column on the `ClubMeeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `meetingTimeId` column on the `ClubMeeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClubMeetingLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ClubMeetingLocation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubMeetingId` column on the `ClubMeetingLocation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClubMeetingTime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ClubMeetingTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubMeetingId` column on the `ClubMeetingTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubId` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clubId` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `InterestEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `InterestEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `InterestEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `eventId` column on the `InterestEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `dm_ClubLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `dm_ClubLabel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ClubAdmin" DROP CONSTRAINT "ClubAdmin_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubAdmin" DROP CONSTRAINT "ClubAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClubFollowed" DROP CONSTRAINT "ClubFollowed_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubFollowed" DROP CONSTRAINT "ClubFollowed_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLabel" DROP CONSTRAINT "ClubLabel_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubLabel" DROP CONSTRAINT "ClubLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_meetingTimeId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clubId_fkey";

-- DropForeignKey
ALTER TABLE "InterestEvent" DROP CONSTRAINT "InterestEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "InterestEvent" DROP CONSTRAINT "InterestEvent_userId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "imageId",
ADD COLUMN     "imageId" SERIAL,
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClubAdmin" DROP CONSTRAINT "ClubAdmin_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" SERIAL NOT NULL,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" SERIAL NOT NULL,
ADD CONSTRAINT "ClubAdmin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClubFollowed" DROP CONSTRAINT "ClubFollowed_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" SERIAL NOT NULL,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" SERIAL NOT NULL,
ADD CONSTRAINT "ClubFollowed_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClubLabel" DROP CONSTRAINT "ClubLabel_pkey",
DROP COLUMN "clubId",
ADD COLUMN     "clubId" SERIAL NOT NULL,
DROP COLUMN "labelId",
ADD COLUMN     "labelId" SERIAL NOT NULL,
ADD CONSTRAINT "ClubLabel_pkey" PRIMARY KEY ("clubId", "labelId");

-- AlterTable
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" SERIAL,
DROP COLUMN "locationId",
ADD COLUMN     "locationId" SERIAL,
DROP COLUMN "meetingTimeId",
ADD COLUMN     "meetingTimeId" SERIAL,
ADD CONSTRAINT "ClubMeeting_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClubMeetingLocation" DROP CONSTRAINT "ClubMeetingLocation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clubMeetingId",
ADD COLUMN     "clubMeetingId" SERIAL NOT NULL,
ADD CONSTRAINT "ClubMeetingLocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClubMeetingTime" DROP CONSTRAINT "ClubMeetingTime_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clubMeetingId",
ADD COLUMN     "clubMeetingId" SERIAL NOT NULL,
ADD CONSTRAINT "ClubMeetingTime_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" SERIAL NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clubId",
ADD COLUMN     "clubId" SERIAL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "InterestEvent" DROP CONSTRAINT "InterestEvent_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" SERIAL NOT NULL,
DROP COLUMN "eventId",
ADD COLUMN     "eventId" SERIAL NOT NULL,
ADD CONSTRAINT "InterestEvent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dm_ClubLabel" DROP CONSTRAINT "dm_ClubLabel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "dm_ClubLabel_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Club_imageId_key" ON "Club"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMeeting_locationId_key" ON "ClubMeeting"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubMeeting_meetingTimeId_key" ON "ClubMeeting"("meetingTimeId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLabel" ADD CONSTRAINT "ClubLabel_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLabel" ADD CONSTRAINT "ClubLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "dm_ClubLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubAdmin" ADD CONSTRAINT "ClubAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubAdmin" ADD CONSTRAINT "ClubAdmin_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubFollowed" ADD CONSTRAINT "ClubFollowed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubFollowed" ADD CONSTRAINT "ClubFollowed_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestEvent" ADD CONSTRAINT "InterestEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestEvent" ADD CONSTRAINT "InterestEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "ClubMeetingLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_meetingTimeId_fkey" FOREIGN KEY ("meetingTimeId") REFERENCES "ClubMeetingTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
