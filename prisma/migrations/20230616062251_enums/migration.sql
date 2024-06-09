/*
  Warnings:

  - The `labels` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialtyLabels` column on the `Club` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Label" AS ENUM ('Academic', 'Creative', 'Sports', 'Science', 'Professional', 'Consulting', 'Dance', 'Entrepreneurship', 'Language', 'Volunteering', 'Music', 'Sustainability', 'Gaming', 'Technology', 'Wellness', 'Media', 'Political', 'Research', 'Social', 'Networking', 'Religious');

-- CreateEnum
CREATE TYPE "SpecialtyLabel" AS ENUM ('Greek_Life', 'Has_Competitions', 'Has_Application', 'Project_Team', 'Has_Interview', 'Has_Audition', 'Virtual');

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "labels",
ADD COLUMN     "labels" "Label"[],
DROP COLUMN "specialtyLabels",
ADD COLUMN     "specialtyLabels" "SpecialtyLabel"[];

-- DropEnum
DROP TYPE "Labels";

-- DropEnum
DROP TYPE "SpecialtyLabels";
