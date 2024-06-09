/*
  Warnings:

  - You are about to drop the column `imageId` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `ClubMeeting` table. All the data in the column will be lost.
  - You are about to drop the column `meetingTimeId` on the `ClubMeeting` table. All the data in the column will be lost.
  - You are about to drop the `ClubAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubFollowed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubMeetingLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClubMeetingTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterestEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dm_ClubLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Labels" AS ENUM ('Academic', 'Creative', 'Sports', 'Science', 'Professional', 'Consulting', 'Dance', 'Entrepreneurship', 'Language', 'Volunteering', 'Music', 'Sustainability', 'Gaming', 'Technology', 'Wellness', 'Media', 'Political', 'Research', 'Social', 'Networking', 'Religious');

-- CreateEnum
CREATE TYPE "SpecialtyLabels" AS ENUM ('Greek_Life', 'Has_Competitions', 'Has_Application', 'Project_Team', 'Has_Interview', 'Has_Audition', 'Virtual');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun');

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
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_meetingTimeId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clubId_fkey";

-- DropForeignKey
ALTER TABLE "InterestEvent" DROP CONSTRAINT "InterestEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "InterestEvent" DROP CONSTRAINT "InterestEvent_userId_fkey";

-- DropIndex
DROP INDEX "Club_imageId_key";

-- DropIndex
DROP INDEX "ClubMeeting_locationId_key";

-- DropIndex
DROP INDEX "ClubMeeting_meetingTimeId_key";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "imageId",
ADD COLUMN     "campusGroupLink" TEXT,
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "imgAlt" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "labels" "Labels"[],
ADD COLUMN     "specialtyLabels" "SpecialtyLabels"[];

-- AlterTable
ALTER TABLE "ClubMeeting" DROP COLUMN "locationId",
DROP COLUMN "meetingTimeId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "day" "Day",
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "startTime" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedAt" TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "ClubAdmin";

-- DropTable
DROP TABLE "ClubFollowed";

-- DropTable
DROP TABLE "ClubLabel";

-- DropTable
DROP TABLE "ClubMeetingLocation";

-- DropTable
DROP TABLE "ClubMeetingTime";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "InterestEvent";

-- DropTable
DROP TABLE "dm_ClubLabel";

-- CreateTable
CREATE TABLE "ClubFollowRelation" (
    "userId" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,

    CONSTRAINT "ClubFollowRelation_pkey" PRIMARY KEY ("userId","clubId")
);

-- AddForeignKey
ALTER TABLE "ClubFollowRelation" ADD CONSTRAINT "ClubFollowRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubFollowRelation" ADD CONSTRAINT "ClubFollowRelation_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
