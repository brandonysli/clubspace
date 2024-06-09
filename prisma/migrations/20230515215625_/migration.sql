-- AlterTable
ALTER TABLE "Club" ALTER COLUMN "imageId" DROP DEFAULT;
DROP SEQUENCE "Club_imageId_seq";

-- AlterTable
ALTER TABLE "ClubAdmin" ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "clubId" DROP DEFAULT;
DROP SEQUENCE "ClubAdmin_userId_seq";
DROP SEQUENCE "ClubAdmin_clubId_seq";

-- AlterTable
ALTER TABLE "ClubFollowed" ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "clubId" DROP DEFAULT;
DROP SEQUENCE "ClubFollowed_userId_seq";
DROP SEQUENCE "ClubFollowed_clubId_seq";

-- AlterTable
ALTER TABLE "ClubLabel" ALTER COLUMN "labelId" DROP DEFAULT;
DROP SEQUENCE "ClubLabel_labelId_seq";

-- AlterTable
ALTER TABLE "ClubMeeting" ALTER COLUMN "clubId" DROP DEFAULT,
ALTER COLUMN "locationId" DROP DEFAULT,
ALTER COLUMN "meetingTimeId" DROP DEFAULT;
DROP SEQUENCE "ClubMeeting_clubId_seq";
DROP SEQUENCE "ClubMeeting_locationId_seq";
DROP SEQUENCE "ClubMeeting_meetingTimeId_seq";

-- AlterTable
ALTER TABLE "ClubMeetingLocation" ALTER COLUMN "clubMeetingId" DROP DEFAULT;
DROP SEQUENCE "ClubMeetingLocation_clubMeetingId_seq";

-- AlterTable
ALTER TABLE "ClubMeetingTime" ALTER COLUMN "clubMeetingId" DROP DEFAULT;
DROP SEQUENCE "ClubMeetingTime_clubMeetingId_seq";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "clubId" DROP DEFAULT;
DROP SEQUENCE "Event_clubId_seq";

-- AlterTable
ALTER TABLE "InterestEvent" ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "eventId" DROP DEFAULT;
DROP SEQUENCE "InterestEvent_userId_seq";
DROP SEQUENCE "InterestEvent_eventId_seq";
