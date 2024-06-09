/*
  Warnings:

  - You are about to drop the column `labels` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `specialtyLabels` on the `Club` table. All the data in the column will be lost.
  - Added the required column `group` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "labels",
DROP COLUMN "specialtyLabels",
ADD COLUMN     "attributes" TEXT[],
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "group" TEXT NOT NULL;
