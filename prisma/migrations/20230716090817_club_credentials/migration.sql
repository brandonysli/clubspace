/*
  Warnings:

  - You are about to drop the column `password` on the `Club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "ClubCredential" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ClubCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubCredential_clubId_key" ON "ClubCredential"("clubId");

-- AddForeignKey
ALTER TABLE "ClubCredential" ADD CONSTRAINT "ClubCredential_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
