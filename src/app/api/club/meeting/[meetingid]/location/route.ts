import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { MeetingLocationWhere } from "@/types/meetingLocation";

//route is api/club/[meetingid]/meeting/location
export async function GET(req: Request, { params }: { params: { meetingid: string} }){
    try{
        const meeting = await prisma.clubMeeting.findUnique({
            where: {
                id: parseInt(params.meetingid)
            }
        })

        if (meeting){
            NextResponse.json({Meeting: meeting, Status: 'Success'})
        } else {
            NextResponse.json({Meeting: null, Status: 'Meeting not found'})
        }

    } catch(err) {
        NextResponse.json({Meeting: null, Status: 'Meeting not found'})
    }   
}