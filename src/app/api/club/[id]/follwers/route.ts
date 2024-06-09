import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

///Users/doraweng/GitHub/clubspace/src/app/api/club/[id]/follwers/route.ts

//get list of users who follow this given club
export async function GET(req: Request, { params }: { params: { id: string} }){
    try {
        const club = await prisma.club.findUnique({
          where: { id: parseInt(params.id) },
          include: { usersFollowing: { select: { userId: true } } },
        });
    
        if (club) {
          const userIds = club.usersFollowing.map((relation) => relation.userId);
          return NextResponse.json({ userIds: userIds, status: 'Success' });
        } else {
          return NextResponse.json({ userIds: [], status: 'Success' });
        }
      } catch (err) {
        return NextResponse.json({ userIds: null, status: 'Error' });
      }
}