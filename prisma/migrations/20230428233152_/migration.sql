/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `dm_ClubLabel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dm_ClubLabel_name_key" ON "dm_ClubLabel"("name");
