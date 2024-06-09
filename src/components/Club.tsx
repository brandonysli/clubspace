"use client";
import { useState, useEffect, useMemo } from "react";
import { IconPointFilled } from "@tabler/icons-react";

import { Club } from "@/types/club.d";

import dayjs from "dayjs";

import BlurImage from "./BlurImage";
import { useRouter } from "next/navigation";
import FollowButton from "./FollowButton";

type ClubProps = {
  club: Club;
  numShowLabels: number;
  numShowSpecialty: number;
  useWebp?: boolean;
  searchString?: string;
  userId?: string;
};

const specialtyLabelStyleMap: {
  [key: string]: { backgroundColor: string; textColor: string };
} = {
  competition: { backgroundColor: "#FEE2E2", textColor: "#E51818" },
  audition: { backgroundColor: "#FEFAD8", textColor: "#DDAC00" },
  interview: { backgroundColor: "#DAFFF8", textColor: "#00C999" },
  project_team: { backgroundColor: "#DAF2FF", textColor: "#00A2FD" },
  greek_life: { backgroundColor: "#F3E8FF", textColor: "#8600FF" },
  application: { backgroundColor: "#FFE0F5", textColor: "#FF1AB1" },
};

const groupStyle: {
  [key: string]: { backgroundColor: string; textColor: string };
} = {
  "Wellness & Lifestyle": { backgroundColor: "#C8E6C9", textColor: "#4CAF50" },
  "Business & Entrepreneurship": {
    backgroundColor: "#FFFBDC",
    textColor: "#FFC700",
  },
  "Sports & Hobby": { backgroundColor: "#FFEECE", textColor: "#FF9900" },
  "Project Teams": { backgroundColor: "#DAF2FF", textColor: "#00A2FD" },
  "Greek Life": { backgroundColor: "#F3E8FF", textColor: "#8600FF" },
  "Arts & Media": { backgroundColor: "#FFE0F5", textColor: "#FF1AB1" },
  "Technology & Science": { backgroundColor: "#B2EBF2", textColor: "#00A5BB" },
  "Cultural & Community": { backgroundColor: "#FFCDD2", textColor: "#F44336" },
  "Law & Politics": { backgroundColor: "#D7CCC8", textColor: "#795548" },
  ROTC: { backgroundColor: "#B2DFDB", textColor: "#009688" },
  Other: { backgroundColor: "#F3F4F6", textColor: "#6E7585" },
};

export default function Club(props: ClubProps) {
  const router = useRouter();

  const { diffYears, diffWeeks, diffDays, lastUpdate } = useMemo(() => {
    let now = dayjs();

    // Convert date strings to Day.js objects
    let createdAt = dayjs(props.club.createdAt);
    let modifiedAt = dayjs(props.club.modifiedAt);

    let diffYears = now.diff(modifiedAt ?? createdAt, "year");
    let diffWeeks = now.diff(modifiedAt ?? createdAt, "week");
    let diffDays = now.diff(modifiedAt ?? createdAt, "day");

    let lastUpdate;

    if (diffYears > 0) {
      lastUpdate = `${diffYears}${diffYears > 1 ? "yrs" : "yr"}`;
    } else if (diffWeeks > 0) {
      lastUpdate = `${diffWeeks}${diffWeeks > 1 ? "wks" : "wk"}`;
    } else {
      lastUpdate = `${diffDays}${diffDays > 1 ? "d" : "d"}`;
    }

    return { diffYears, diffWeeks, diffDays, lastUpdate };
  }, [props.club.modifiedAt, props.club.createdAt]);

  const [liked, setLiked] = useState(
    props.club.usersFollowing ? props.club.usersFollowing?.length == 1 : false
  );

  useEffect(() => {
    setLiked(
      props.club.usersFollowing ? props.club.usersFollowing?.length == 1 : false
    );
  }, [props.club]);

  return (
    <div
      onClick={() => {
        router.push(
          `/catalog/${props.club.id}${
            props.searchString ? `?${props.searchString}` : ""
          }`,
          {
            shallow: true,
          }
        );
      }}
      className="flex flex-col items-center justify-center gap-2 p-3 md:max-w-[385px] lg:max-w-[400px] min-w-[280px] 2xs:min-w-[290px] sm:min-w-[385px] border border-zinc-200  bg-white cursor-pointer md:hover:shadow-md rounded-2xl">
      <div className="flex flex-row items-center justify-between w-full gap-3">
        <div className="flex flex-row items-center w-full gap-3">
          <div className="h-full">
            {props.club.img && (
              <BlurImage image={props.club.img} width={36} height={36} />
            )}
          </div>
          <div className="flex flex-col items-start justify-between w-full ">
            <span className="text-lg font-bold text-zinc-800">
              {props.club.name}
            </span>
          </div>
        </div>
        <FollowButton
          liked={liked}
          setLiked={setLiked}
          clubId={props.club.id}
          userId={props.userId}
        />
      </div>

      <div className="flex flex-row items-center justify-start w-full gap-2 text-xs font-semibold">
        {props.club.categories &&
          props.club.categories.map((category, index) => {
           
              return (
                <div
                  key={index}
                  className="px-2 py-1 text-gray-500 bg-gray-100 rounded-lg">
                  {category}
                </div>
              );
         
          })}
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        {props.club.group && (
          <div
            style={{
              backgroundColor: groupStyle[props.club.group]?.backgroundColor,
              color: groupStyle[props.club.group]?.textColor,
            }}
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              groupStyle[props.club.group]?.backgroundColor || "bg-gray-100"
            } ${groupStyle[props.club.group]?.textColor || "text-gray-500"}`}>
            {props.club.group.replace("_", " ")}
          </div>
        )}

        <div className="flex flex-row items-center justify-center">
          {diffWeeks < 17 ? (
            diffYears < 1 ? (
              <IconPointFilled className="w-3 h-3 text-[#49DD7B]" />
            ) : (
              <IconPointFilled className="w-3 h-3 text-[#FF9534]" />
            )
          ) : (
            <IconPointFilled className="w-3 h-3 text-[#FF2525]" />
          )}
          <span className="text-xs italic font-semibold text-gray-600">
            {`verified ${lastUpdate} ago`}
          </span>
        </div>
      </div>
    </div>
  );
}
