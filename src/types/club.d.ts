import {
  Prisma,
  ClubMeeting as ClubMeetingType,
  Day,
  ClubFollowRelation as ClubFollowRelationType,
} from "@prisma/client";

import { Group, Category, Attribute } from "./enums.d";

// Define a type for Club with its relations
const clubWithRelations = Prisma.validator<Prisma.ClubArgs>()({
  include: {
    clubMeetings: true,
  },
});

// club
// export type Club = Prisma.ClubGetPayload<typeof clubWithRelations>;
export type Club = Prisma.ClubGetPayload<typeof clubWithRelations> & {
  usersFollowing?: ClubFollowRelation[];
};

export type ClubFollowRelation = ClubFollowRelationType;

// clubmeeting
export type ClubMeeting = ClubMeetingType;

// image or club
export type Image = ImageType;

export type ClubData = {
  name: string;
  description: string;
  password?: string | null;
  website: string | undefined;
  img: string;
  email: string | undefined;
  instagram: string | undefined;
  facebook: string | undefined;
  discord: string | undefined;
  campusGroupLink: string | undefined;
  group: Group;
  categories: Category[];
  attributes: Attribute[];
};

export type ClubMeetingData = {
  clubId: number;
  locationName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  startTime?: string;
  endTime?: string;
  day?: Day;
};

export { Day };
