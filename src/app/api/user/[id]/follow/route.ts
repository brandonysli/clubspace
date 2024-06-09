import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { ClubFollowData } from "@/types/follow";

//get list of clubs followed by user
export async function GET(req: Request, { params }: { params: { id: string} }){
    try{
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: { clubsFollowing: { select: { clubId: true } } },
          });
        
        if (user) {
            return NextResponse.json({clubs: user.clubsFollowing, status: "Success"})
        } else {
            return NextResponse.json({clubs: null, status: "Success"})
        }
    } catch (err) {
        return NextResponse.json({clubs: null, status: "Error"})
    }
}


//post user with given id follows a club with the given id
export async function POST(req: Request, { params }: { params: { id: string}}) {
    try {
        const reqBody = await req.json();        
        const data = {
            clubId: parseInt(reqBody.clubId),
        } as ClubFollowData;

        const follow = await prisma.clubFollowRelation.create({
            data: {
                user: {
                    connect: {id: params.id}
                },
                club: {
                    connect: {
                        id: data.clubId
                    }
                }
            }
        })
        
        if (follow) {
            return NextResponse.json({following: true, status: "Success"})
        }
    } catch (err) {
        return NextResponse.json({following: true, status: "Error"})
    }
}


