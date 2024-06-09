/*
  Warnings:

  - The primary key for the `ClubLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ClubLabel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ClubLabel` table. All the data in the column will be lost.
  - You are about to drop the `_ClubToClubLabel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clubId` to the `ClubLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labelId` to the `ClubLabel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ClubToClubLabel" DROP CONSTRAINT "_ClubToClubLabel_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClubToClubLabel" DROP CONSTRAINT "_ClubToClubLabel_B_fkey";

-- AlterTable
ALTER TABLE "ClubLabel" DROP CONSTRAINT "ClubLabel_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "clubId" UUID NOT NULL,
ADD COLUMN     "labelId" UUID NOT NULL,
ADD CONSTRAINT "ClubLabel_pkey" PRIMARY KEY ("clubId", "labelId");

-- DropTable
DROP TABLE "_ClubToClubLabel";

-- CreateTable
CREATE TABLE "dm_ClubLabel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "dm_ClubLabel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClubLabel" ADD CONSTRAINT "ClubLabel_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLabel" ADD CONSTRAINT "ClubLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "dm_ClubLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
