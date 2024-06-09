/*
  Warnings:

  - Added the required column `iv` to the `ClubCredential` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `ClubCredential` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ClubCredential" ADD COLUMN     "iv" TEXT NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
