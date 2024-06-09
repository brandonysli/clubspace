import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { ClubMeeting } from "@/types/club.d";

//post function in nextjs 13 to update a list of meetings for a club given its id as a param. The function should update the ClubMeeting table in the database and create meetings based on the request data if they don't already exist or if there are more meetings than already exist. It should also delete extra meetings based on the request data.
export async function POST(req: Request) {
  try {
    const reqbody = await req.json();
    const meetings = reqbody.meetings as ClubMeeting[];
    const id = parseInt(reqbody.id);
    const existingMeetings = await prisma.clubMeeting.findMany({
      where: {
        clubId: id,
      },
    });
    if (meetings.length === 0) {
      // Delete all existing meetings
      await prisma.clubMeeting.deleteMany({
        where: {
          clubId: id,
        },
      });
    } else if (existingMeetings.length > meetings.length) {
      const excessMeetings = existingMeetings.slice(meetings.length);
      await prisma.clubMeeting.deleteMany({
        where: {
          id: {
            in: excessMeetings.map((meeting) => meeting.id),
          },
        },
      });
    }

    // Update or create meetings
    for (let i = 0; i < meetings.length; i++) {
      const meeting = meetings[i];
      if (existingMeetings[i]) {
        await prisma.clubMeeting.update({
          where: {
            id: existingMeetings[i].id,
          },
          data: {
            ...meeting,
          },
        });
      } else {
        await prisma.clubMeeting.create({
          data: {
            ...meeting,
            clubId: id,
          },
        });
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
