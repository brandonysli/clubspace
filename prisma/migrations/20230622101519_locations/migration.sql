/*
  Warnings:

  - You are about to alter the column `latitude` on the `ClubMeeting` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,6)`.
  - You are about to alter the column `longitude` on the `ClubMeeting` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,6)`.

*/
-- AlterTable
ALTER TABLE "ClubMeeting" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(8,6),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(9,6);
