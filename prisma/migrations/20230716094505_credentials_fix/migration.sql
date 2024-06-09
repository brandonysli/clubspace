-- DropForeignKey
ALTER TABLE "ClubCredential" DROP CONSTRAINT "ClubCredential_clubId_fkey";

-- AddForeignKey
ALTER TABLE "ClubCredential" ADD CONSTRAINT "ClubCredential_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
