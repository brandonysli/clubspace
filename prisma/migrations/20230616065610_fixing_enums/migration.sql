/*
  Warnings:

  - The values [Volunteering] on the enum `Label` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Label_new" AS ENUM ('Creative', 'Sports', 'Science', 'Professional', 'Consulting', 'Dance', 'Cultural', 'Entrepreneurship', 'Language', 'Volunteer', 'Music', 'Sustainability', 'Gaming', 'Technology', 'Wellness', 'Media', 'Political', 'Research', 'Social', 'Networking', 'Religious');
ALTER TABLE "Club" ALTER COLUMN "labels" TYPE "Label_new"[] USING ("labels"::text::"Label_new"[]);
ALTER TYPE "Label" RENAME TO "Label_old";
ALTER TYPE "Label_new" RENAME TO "Label";
DROP TYPE "Label_old";
COMMIT;
