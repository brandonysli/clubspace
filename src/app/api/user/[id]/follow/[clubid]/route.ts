import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { ClubFollowData } from "@/types/follow";

//check if following
export async function GET(
  req: Request,
  { params }: { params: { id: string; clubid: string } }
) {
  try {
    const follow = await prisma.clubFollowRelation.findUnique({
      where: {
        userId_clubId: {
          userId: params.id,
          clubId: parseInt(params.clubid),
        },
      },
    });

    if (follow) {
      return NextResponse.json({ follow: true, status: "Success" });
    } else {
      return NextResponse.json({ follow: false, status: "Success" });
    }
  } catch (err) {
    return NextResponse.json({ follow: null, status: "Error" });
  }
}

//unfollowing
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; clubid: string } }
) {
  try {
    const unfollow = await prisma.clubFollowRelation.delete({
      where: {
        userId_clubId: {
          userId: params.id,
          clubId: parseInt(params.clubid),
        },
      },
    });

    if (unfollow) {
      return NextResponse.json({ status: "Success" });
    }
  } catch (err) {
    return NextResponse.json({ status: "Error" });
  }
}
