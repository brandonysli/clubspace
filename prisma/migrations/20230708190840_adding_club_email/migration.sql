/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[website]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instagram]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebook]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[campusGroupLink]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Club_email_key" ON "Club"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Club_website_key" ON "Club"("website");

-- CreateIndex
CREATE UNIQUE INDEX "Club_instagram_key" ON "Club"("instagram");

-- CreateIndex
CREATE UNIQUE INDEX "Club_facebook_key" ON "Club"("facebook");

-- CreateIndex
CREATE UNIQUE INDEX "Club_campusGroupLink_key" ON "Club"("campusGroupLink");

-- CreateIndex
CREATE UNIQUE INDEX "Club_discord_key" ON "Club"("discord");
