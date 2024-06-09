import ClubComponent from "@/components/Club";
import { Club } from "@/types/club";

import ClubPage from "./ClubPage";
import { useState, useEffect } from "react";
import Loading from "./loading";
//import { getClubs } from "./[id]/data";

import { NextOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import { prisma } from "@/utils/prisma";

async function getClub(
  id: string
): Promise<{ club: Club | null; userId: string | undefined }> {
  try {
    const session = await getServerSession(NextOptions);
    const userId = session?.user?.id;
    const club = await prisma.club.findFirst({
      where: { id: parseInt(id) },
      include: {
        clubMeetings: true,
        usersFollowing: userId
          ? {
              where: { userId: userId },
            }
          : false,
      },
    });

    return { club: club, userId: userId };
  } catch (e) {
    return { club: null, userId: undefined };
  }
}

export default async function Page({
  params = { id: "1" },
}: {
  params: { id: string };
}) {
  const { club, userId } = await getClub(params.id);
  return (
    <>
      <ClubPage club={club} userId={userId} />
    </>
  );
}
