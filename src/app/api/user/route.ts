import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { ClubFollowData } from "@/types/follow";

//get list of all users 

export async function GET(req: Request){
    try{
        const users = await prisma.user.findMany();

        if (users) {
            return NextResponse.json({ data: users, status: "Success" })
        }
    } catch (err) {
        return NextResponse.json({ data: null, status: "Error" })
    }
}
