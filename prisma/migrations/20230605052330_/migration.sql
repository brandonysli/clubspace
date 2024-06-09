/*
  Warnings:

  - You are about to drop the column `college` on the `Club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "college",
ALTER COLUMN "password" DROP NOT NULL;
