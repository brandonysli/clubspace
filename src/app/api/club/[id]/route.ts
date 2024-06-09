import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
//import { Club, ClubData } from "@/types/club.d";
import { Club } from "@prisma/client";
import { NextOptions } from "../../auth/[...nextauth]/route";
import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(NextOptions);
  const userId = session?.user?.id;
  const club: Club | null = await prisma.club.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      clubMeetings: true,
      usersFollowing: userId
        ? {
            where: { userId: userId },
          }
        : false,
    },
  });
  // Send response
  return NextResponse.json(club);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const reqBody = await req.json();

  const data = {
    id: reqBody.id,
    img: reqBody.img,
    name: reqBody.name,
    email: reqBody.email ?? null,
    description: reqBody.description,
    website: reqBody.website ?? null,
    instagram: reqBody.instagram ?? null,
    facebook: reqBody.facebook ?? null,
    campusGroupLink: reqBody.campusGroupLink ?? null,
    discord: reqBody.discord ?? null,
    group: reqBody.group,
    categories: reqBody.categories,
    attributes: reqBody.attributes,
  } as Club;

  const club = await prisma.club.update({
    where: { id: parseInt(params.id) },
    data: data,
  });

  return NextResponse.json(club);
}

//delete a club with given id
