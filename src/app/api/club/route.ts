import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { Club, ClubMeeting } from "@/types/club.d";
import { Group, Category, Attributes } from "@/types/enums.d";
import { getSession, useSession } from "next-auth/react";
import { NextOptions } from "../auth/[...nextauth]/route";
import NextAuth, { AuthOptions, getServerSession } from "next-auth";

export type ClubPaginationParams = {
  take?: number;
  skip?: number;
};

export type ClubSearchParams = {
  search?: string;
  // labels?: string[];
  cursorParam?: number;
  group?: Group;
  categories?: Category[];
  attributes?: Attributes[];
  sort?:
    | "alphabetical_asc"
    | "alphabetical_desc"
    | "latest_asc"
    | "latest_desc";
  followed?: boolean;
};

export type ClubReturnType = Club & { clubMeetings: ClubMeeting[] };

type SortCategory = "alphabetical" | "latest";
type SortType = "asc" | "desc";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const take = parseInt(searchParams.get("take") || "100");
  const skip = parseInt(searchParams.get("skip") || "0");
  const search = searchParams.get("search") || undefined;
  // const labelsString = searchParams.get("labels");
  const categoriesString = searchParams.get("categories");
  const group = searchParams.get("group");
  const attributesString = searchParams.get("attributes");
  const sortString = searchParams.get("sort");
  const followedString = searchParams.get("followed");
  const cursor = searchParams.get("cursor") || undefined;
  const groupParam: Group | undefined = group ? (group as Group) : undefined;

  console.log(categoriesString);
  console.log(group);
  console.log(groupParam);

  // Use cursor if it exists
  const cursorParam = cursor ? parseInt(cursor) : undefined;

  const session = await getServerSession(NextOptions);
  const userId = session?.user?.id;

  //  let labelsArray = [] as string[];
  let categoriesArray = [] as string[];
  let attributesArray = [] as string[];
  let orderBy;
  let isFollowed = false;

  if (followedString) {
    isFollowed = followedString == "true";
  }

  // TODO: group and attribute filtering
  // if (labelsString) {
  //   labelsArray = labelsString.split(",");
  // }

  if (categoriesString) {
    categoriesArray = categoriesString.split(",");
  }

  if (attributesString) {
    attributesArray = attributesString.split(",");
  }

  if (sortString) {
    const [sortCategory, sortType] = sortString.split("_") as [
      SortCategory,
      SortType
    ];
    switch (sortCategory) {
      case "alphabetical":
        orderBy = { name: sortType };
        break;
      case "latest":
        orderBy = { modifiedAt: sortType };
        break;
      default:
        orderBy = undefined;
    }
  }

  const params: ClubSearchParams & ClubPaginationParams = {
    take,
    skip,
    search,
    cursorParam,
    // labels: labelsArray,
    group: groupParam !== null ? groupParam : undefined,
    categories: categoriesArray as Category[],
    attributes: attributesArray as Attributes[],
    followed: isFollowed,
  };

  const clubs = (await prisma.club.findMany({
    include: {
      clubMeetings: true,
      usersFollowing: userId
        ? {
            where: {
              userId: userId,
            },
          }
        : false,
    },
    where: {
      AND: [
        {
          name: {
            contains: params.search,
            mode: "insensitive",
          },
        },
        {
          group: params.group,
        },
        categoriesArray.length > 0
          ? {
              categories: {
                hasEvery: categoriesArray,
              },
            }
          : {},
        attributesArray.length > 0
          ? {
              attributes: {
                hasEvery: attributesArray,
              },
            }
          : {},
        isFollowed
          ? {
              usersFollowing: {
                some: {
                  userId: userId as string,
                },
              },
            }
          : {},
      ],
    },
    take: params.take,
    skip: params.skip,
    cursor: params.cursorParam ? { id: params.cursorParam } : undefined,
    orderBy,
  })) as ClubReturnType[];

  // Send response
  return NextResponse.json(clubs);
}

export async function POST(req: Request) {
  const reqBody = await req.json();

  const data = {
    name: reqBody.name,
    description: reqBody.description,
    password: reqBody.password && undefined,
    location: reqBody.location,
    group: reqBody.group ?? "Other",
  }; //TODO: Add type for this data

  const club = await prisma.club.create({
    data: data,
  });

  // return create club response
  return NextResponse.json(club);
}
