/*
  Warnings:

  - The `labels` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialtyLabels` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "labels",
ADD COLUMN     "labels" TEXT[],
DROP COLUMN "specialtyLabels",
ADD COLUMN     "specialtyLabels" TEXT[];

-- DropEnum
DROP TYPE "Label";

-- DropEnum
DROP TYPE "SpecialtyLabel";
