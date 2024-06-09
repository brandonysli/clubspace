/*
  Warnings:

  - The primary key for the `ClubFollowed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ClubFollowed` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClubFollowed" DROP CONSTRAINT "ClubFollowed_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ClubFollowed_pkey" PRIMARY KEY ("userId", "clubId");

-- AlterTable
ALTER TABLE "ClubLabel" ALTER COLUMN "clubId" DROP DEFAULT;
DROP SEQUENCE "ClubLabel_clubId_seq";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "clubId" DROP DEFAULT;
DROP SEQUENCE "Image_clubId_seq";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- CreateTable
CREATE TABLE "InterestForm" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "clubOfficer" BOOLEAN NOT NULL,
    "addClubInfo" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestForm_pkey" PRIMARY KEY ("id")
);
