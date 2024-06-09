"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import Image from "next/image";
import CG from "@/assets/images/cg.jpg";
import BlurImage from "../../../components/BlurImage";

dayjs.extend(relativeTime);
dayjs.extend(duration);

import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconLink,
  IconCircleCheckFilled,
  IconMapPinFilled,
  IconClockFilled,
  IconMailPlus,
  IconHeartFilled,
  IconRefresh,
  IconPointFilled,
  IconSunFilled,
  IconChevronLeft,
  IconExternalLink,
} from "@tabler/icons-react";

import { Club, ClubMeeting } from "@/types/club.d";
import Map from "@/components/Map";
import RetainQueryLink from "../../../components/RetainQueryLink";

import { ClubMeetingData } from "@/types/club";

type ClubPageProps = {
  club: Club | null;
  meetingsPreview?: ClubMeetingData[];
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

type MeetingTableProps = {
  meetings: ClubMeeting[];
  meetingsPreview?: ClubMeetingData[];
};

export default function ClubPage(props: ClubPageProps) {
  const modifiedTime = dayjs(props.club?.modifiedAt);
  const now = dayjs();
  const isWithinWeek = now.diff(modifiedTime, "week") < 1;
  const isWithinYear = now.diff(modifiedTime, "year") < 1;

  return (
    <>
      {props.club && (
        <div
          className="flex flex-col h-full gap-4 pb-6 px-6 sm:px-10 md:px-2 min-h-[600px] max-h-[calc(100vh-160px)] xl:max-h-[calc(100vh-100px)] overflow-y-auto  scrollBackgroundTransparent"
          style={{
            position: "relative",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          <div className="p-2 bg-white md:border md:border-zinc-200 md:rounded-3xl md:p-8">
            <RetainQueryLink href={"/catalog/"}>
              <div className="flex flex-row items-center justify-start py-1 pr-2 mb-4 rounded-xl md:hidden w-fit over:bg-zinc-100">
                <IconChevronLeft />

                <span className="text-sm font-semibold text-zinc-600 ">
                  Return to Clubs
                </span>
              </div>
            </RetainQueryLink>
            <div className="flex flex-col gap-4 sm:gap-3">
              <div className="flex flex-row items-end justify-between sm:items-center">
                <div className="flex items-end h-full gap-4 sm:max-w-none">
                  {props.club.img && (
                    <BlurImage image={props.club.img} width={75} height={75} />
                  )}

                  <div className="flex flex-col justify-end h-full gap-2">
                    <div className="flex flex-row items-end h-full gap-2 sm:justify-start">
                      {props.club.campusGroupLink && (
                        <a
                          href={props.club.campusGroupLink}
                          target="_blank"
                          rel="noopener noreferrer">
                          <div className="flex items-center justify-center w-8 h-8 bg-[#FFB4B4] hover:bg-rose-300 rounded-md">
                            <span
                              className="text-[#920404] font-bold"
                              style={{ fontFamily: "SF-Pro-Display" }}>
                              CG
                            </span>
                          </div>
                        </a>
                      )}
                      {props.club.instagram && (
                        <a
                          href={props.club.instagram}
                          target="_blank"
                          rel="noopener noreferrer">
                          <div className="flex items-center w-8 h-8 p-1 bg-pink-100 rounded-md hover:bg-pink-200">
                            <IconBrandInstagram className="text-pink-500 w-7 h-7" />
                          </div>
                        </a>
                      )}
                      {props.club.facebook && (
                        <a
                          href={props.club.facebook}
                          target="_blank"
                          rel="noopener noreferrer">
                          <div className="flex items-center w-8 h-8 p-1 bg-blue-100 rounded-md hover:bg-blue-200">
                            <IconBrandFacebook className="text-blue-900 w-7 h-7" />
                          </div>
                        </a>
                      )}
                      {props.club.website && (
                        <a
                          href={props.club.website}
                          target="_blank"
                          rel="noopener noreferrer">
                          <div className="flex items-center w-8 h-8 p-1.5 bg-gray-200 rounded-md hover:bg-gray-300">
                            <IconExternalLink
                              stroke={2.25}
                              className="w-6 h-6 text-gray-600"
                            />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <span className="hidden text-xl sm:flex sm:text-left md:text-2xl sm:font-bold text-zinc-800">
                {props.club.name ?? "N/A"}
              </span>

              <span className="flex flex-col justify-between gap-4 text-2xl font-bold sm:hidden">
                {props.club.name}
              </span>

              <div className="flex flex-row flex-wrap justify-start gap-3">
                {props.club.categories.map((category, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg">
                      <span>{category}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between ">
                <div className="hidden sm:flex sm:justify-between sm:gap-3">
                  {props.club.attributes.map((attribute) => {
                    let style = specialtyLabelStyleMap[
                      attribute.toLowerCase()
                    ] || {
                      backgroundColor: "#FFFFFF",
                      textColor: "#000000",
                    };

                    return (
                      <div
                        className="flex items-center px-2 py-1 text-sm font-semibold bg-gray-100 rounded-lg"
                        style={{
                          backgroundColor: style.backgroundColor,
                          color: style.textColor,
                        }}
                        key={attribute}>
                        <span>{attribute.replace("_", " ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10 mt-6">
              <div className="text-sm font-medium text-left text-zinc-600">
                {props.club.description}
              </div>

              {props.club.clubMeetings.length > 0 ||
                (props.meetingsPreview && props.meetingsPreview.length > 0 && (
                  <Table
                    meetings={props.club.clubMeetings}
                    meetingsPreview={props.meetingsPreview}
                  />
                ))}

              {props.club.clubMeetings.some(
                (meetings) => meetings.latitude && meetings.longitude
              ) && <Map meetings={props.club.clubMeetings} />}

              <div className="flex justify-end">
                <div className="flex flex-col items-end gap-1">
                  <div className="hidden mt-3 sm:flex sm:items-center sm:justify-between sm:gap-1">
                    {isWithinYear ? (
                      isWithinWeek ? (
                        <IconPointFilled className="w-3 h-3 text-green-500" />
                      ) : (
                        <IconPointFilled className="w-3 h-3 text-orange-500" />
                      )
                    ) : (
                      <IconPointFilled className="w-3 h-3 text-red-500" />
                    )}
                    <span className="text-sm font-semibold text-zinc-600">
                      Updated {dayjs(props.club.modifiedAt).fromNow()}
                    </span>
                  </div>

                  {/* <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-1 sm:font-semibold sm:text-amber-600 sm:px-1.5 sm:rounded-md sm:bg-orange-200">
                    <IconRefresh className="w-4 h-4" />
                    <span>Request Update</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const Table = (props: MeetingTableProps) => {
  return (
    <div>
      {props.meetingsPreview?.length === 0 && props.meetings.length === 0 ? (
        <div>
          <table className="w-full mt-2 text-sm font-normal table-fixed">
            <thead>
              <tr className="border-b border-spacing-2">
                <th className="w-1/3 text-left">
                  <div className="flex items-center">
                    <IconSunFilled className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-zinc-600">Day</span>
                  </div>
                </th>
                <th className="w-1/3 text-left">
                  <div className="flex items-center">
                    <IconClockFilled className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-zinc-600">Time</span>
                  </div>
                </th>

                <th className="w-1/3 text-left">
                  <div className="flex items-center">
                    <IconMapPinFilled className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-zinc-600">Location</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold text-zinc-500">
              <tr>
                <td className="w-1/3 py-3 pl-2 text-left"> -</td>
                <td className="w-1/3 py-3 pl-2 text-left"> -</td>
                <td className="w-1/3 py-3 pl-2 text-left"> -</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <table className="w-full mt-2 ">
          <thead>
            <tr className="w-full p-4 mb-4 text-base border-b border-spacing-2">
              <th className="w-1/3 text-left">
                <div className="flex items-center">
                  <IconSunFilled className="w-5 h-5 text-zinc-600" />
                  <span className="ml-2 text-zinc-600">Day</span>
                </div>
              </th>
              <th className="w-1/3 text-left">
                <div className="flex items-center">
                  <IconClockFilled className="w-5 h-5 text-zinc-600" />
                  <span className="ml-2 text-zinc-600">Time</span>
                </div>
              </th>

              <th className="w-1/3 text-left">
                <div className="flex items-center">
                  <IconMapPinFilled className="w-5 h-5 text-zinc-600" />
                  <span className="ml-2 text-zinc-600">Location</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm font-semibold text-zinc-500">
            {props.meetingsPreview ? (
              <>
                {props.meetingsPreview.map((item) => (
                  <tr
                    key={item.day ?? item.locationName ?? item.startTime}
                    className="border-b">
                    <td className="w-1/3 py-3 pl-2 text-left">
                      {item.day || "-"}
                    </td>
                    <td className="w-1/3 py-3 pl-2 text-left">
                      {item.startTime || "-"}
                    </td>

                    <td className="w-1/3 py-3 pl-2 text-left">
                      {item.locationName || "-"}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <>
                {props.meetings.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="w-1/3 py-3 pl-2 text-left">
                      {item.day || "-"}
                    </td>
                    <td className="w-1/3 py-3 pl-2 text-left">
                      {item.startTime || "-"}
                    </td>

                    <td className="w-1/3 py-3 pl-2 text-left">
                      {item.locationName || "-"}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
