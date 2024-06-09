/*
  Warnings:

  - The values [Membership] on the enum `SpecialtyLabel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpecialtyLabel_new" AS ENUM ('Greek_Life', 'Competition', 'Application', 'Project_Team', 'Interview', 'Audition');
ALTER TABLE "Club" ALTER COLUMN "specialtyLabels" TYPE "SpecialtyLabel_new"[] USING ("specialtyLabels"::text::"SpecialtyLabel_new"[]);
ALTER TYPE "SpecialtyLabel" RENAME TO "SpecialtyLabel_old";
ALTER TYPE "SpecialtyLabel_new" RENAME TO "SpecialtyLabel";
DROP TYPE "SpecialtyLabel_old";
COMMIT;
