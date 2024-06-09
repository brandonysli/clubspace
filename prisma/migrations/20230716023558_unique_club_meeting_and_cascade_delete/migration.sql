/*
  Warnings:

  - Made the column `clubId` on table `ClubMeeting` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ClubFollowRelation" DROP CONSTRAINT "ClubFollowRelation_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMeeting" DROP CONSTRAINT "ClubMeeting_clubId_fkey";

-- AlterTable
ALTER TABLE "ClubMeeting" ALTER COLUMN "clubId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ClubFollowRelation" ADD CONSTRAINT "ClubFollowRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMeeting" ADD CONSTRAINT "ClubMeeting_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
