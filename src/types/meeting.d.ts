import { Prisma, ClubMeeting as MeetingType } from "@prisma/client";

export type MeetingLocationWhere = {
  id: number;
};

export type MeetingHour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type MeetingMinute = number;
export type MeetingMeridiem = "am" | "pm";
export type MeetingDay =
  | "Mon"
  | "Tues"
  | "Wed"
  | "Thurs"
  | "Fri"
  | "Sat"
  | "Sun";

export type MeetingTime = {
  hour?: MeetingHour | null;
  minute?: MeetingMinute | null;
  meridiem?: MeetingMeridiem | null;
};

// interface for restricted meeting time options
export type Meeting = {
  time?: MeetingTime | null;
  day?: MeetingDay | null;
  location?: string | null;
};
