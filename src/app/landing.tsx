"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import mobileImageSection from "@/assets/images/mobileimagesection.png";
import imageSection from "@/assets/images/imagesection.png";

import SearchBar from "@/components/SearchBar";
import ClubComponent from "@/components/Club";

import { Club } from "@/types/club";

import useWindowSize from "@/hooks/useWindowSize";

import {
  IconPencilPlus,
  IconRefresh,
  IconAlarmFilled,
  IconCalendarTime,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";

export default function Landing() {
  const windowSize = useWindowSize();

  const [club, setClub] = useState<Club>();
  const [numShowLabels, setNumShowLabels] = useState<number>(2);

  const [requestUpdate, setRequestUpdate] = useState<string>(
    "last verified 10 days ago"
  );

  //initialize as webdev club3
  const [selectedClubId, setSelectedClubId] = useState<number>(1689);
  const [search, setSearch] = useState<string>("");
  const [isLoadingClub, setIsLoadingClub] = useState<boolean>(true);

  const [showMoreLabels, setShowMoreLabels] = useState<boolean>(false);

  //CountDown Times
  const [days, setDays] = useState(60);
  const [hours, setHours] = useState(24);
  const [minutes, setMinutes] = useState(60);
  const [seconds, setSeconds] = useState("00");

  const [fadeIn, setFadeIn] = useState<boolean>(false);

  useEffect(() => {
    if (windowSize.width) {
      //sm

      if (windowSize.width < 540) {
        setNumShowLabels(1);
        //md
      } else if (windowSize.width < 1024) {
        setNumShowLabels(2);
        //xl
      } else if (windowSize.width < 1344) {
        setNumShowLabels(3);
        // >XXL
      } else if (windowSize.width < 1408) {
        setNumShowLabels(4);
        // >XXL
      } else {
        setNumShowLabels(5);
      }
    }
  }, [windowSize]);

  //Update CountDownTime
  useEffect(() => {
    const countdown = setInterval(() => {
      const targetDate = new Date("August 1, 2023").getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      const secondsValue = Math.floor((diff / 1000) % 60);

      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((diff / 1000 / 60) % 60));
      setSeconds(
        secondsValue < 10 ? `0${secondsValue}` : secondsValue.toString()
      );
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    setIsLoadingClub(true);
    // fetch clubs
    if (selectedClubId) {
      fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/${selectedClubId}`)
        .then((response) => response.json())
        .then((data: Club) => {
          setClub(data);
          setIsLoadingClub(false);
        })
        .catch((error) => {
          console.error("Error fetching clubs:", error);
        });
    }
  }, [selectedClubId]);
  const scrollShowStyle = useMemo(
    () => ["opacity-100", "duration-[1000ms]", "sm:duration-[1100ms]"],
    []
  );

  useEffect(() => {
    setFadeIn(true);
    if (!("IntersectionObserver" in window)) {
      // IntersectionObserver is not available, stop here
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(...scrollShowStyle);
        }
      });
    });
    const mutationObserver = new MutationObserver(() => {
      const scrollHiddenElements = document.querySelectorAll(".scrollHidden");
      scrollHiddenElements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [scrollShowStyle]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-8 sm:gap-0">
        <section className="relative flex flex-col items-center justify-center w-full h-full gap-4 p-4 overflow-x-hidden lg:p-16 lg:pt-0 sm:my-0">
          <div
            className="w-[150px] h-[1100px] bg-gray-100 absolute left-0 top-12 hidden xl:flex -z-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(256, 256, 256, 1) 1px, rgba(211,211,211,0.6))",
            }}
          >
            <div
              style={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50px", // change this value to adjust the height of the fade effect
                backgroundImage:
                  "linear-gradient(to bottom, rgba(256, 256, 256, 1), rgba(256, 256, 256, 0))",
              }}
            ></div>
          </div>
          <div
            className="w-[150px] h-[1100px] bg-gray-100 absolute right-0 top-12 hidden xl:flex -z-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(256, 256, 256, 1) 1px, rgba(211,211,211,0.6))",
            }}
          >
            <div
              style={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50px", // change this value to adjust the height of the fade effect
                backgroundImage:
                  "linear-gradient(to bottom, rgba(256, 256, 256, 1), rgba(256, 256, 256, 0))",
              }}
            ></div>
          </div>
          <Grid />
          <div className="flex flex-col items-start justify-center gap-8 px-4 mt-0 text-center sm:mt-24 sm:gap-4 lg:px-0">
            <span
              className="text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl bg-clip-text bg-gradient-to-br from-red-600 to-rose-300"
              style={{
                opacity: fadeIn ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            >
              choose your space!
            </span>

            <div
              className={`flex flex-col items-center justify-center w-full gap-8 sm:gap-4 sm:flex-row md:flex-row lg:flex-row`}
              style={{
                opacity: fadeIn ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                transitionDelay: "0.2s",
              }}
            >
              <div className="flex flex-col justify-start text-2xl font-bold text-gray-700 sm:text-3xl lg:text-4xl">
                <span>a gateway to cornell clubs</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full px-2 md:px-16 sm:px-8">
            <SearchBar
              search={search}
              setSearch={setSearch}
              selectedClubId={selectedClubId}
              setSelectedClubId={setSelectedClubId}
              numShowLabels={numShowLabels}
              setNumShowLabels={setNumShowLabels}
              showSearch={true}
              searchBarTopBorderRadius="rounded-t-xl"
              searchBarBottomBorderRadius="rounded-b-xl"
              searchBarBorderColor="gray"
              searchBarShadow="shadow-md"
              searchBarBorderWidth="border-[1px]"
            />
          </div>

          <div className="flex items-center h-[190px] justify-center w-full px-2 mt-12 sm:mb-28 md:px-16 sm:px-8">
            {club && !isLoadingClub && (
              <ClubComponent
                club={club}
                numShowLabels={3}
                numShowSpecialty={2}
                userId={""}
              />
            )}
          </div>

          {windowSize.width && windowSize.width > 320 && (
            <div className="relative mt-28 sm:mt-10 sm:ml-40 md:mt-16 ml-12 md:ml-0 h-full w-[150%] sm:w-[130%] -z-20">
              <Image
                src={imageSection}
                className="hidden lg:flex"
                alt="imagesection"
                loading="eager"
                priority={true}
              ></Image>
              <Image
                src={mobileImageSection}
                className="flex lg:hidden"
                alt="mobileimagesection"
                loading="eager"
                priority={true}
              ></Image>
            </div>
          )}
        </section>

        <section
          className={
            windowSize.width && windowSize.width < 320
              ? "relative flex flex-col items-center justify-center w-full gap-32 p-16 mb-0 mt-40"
              : `relative flex flex-col items-center justify-center w-full gap-32 p-16 mb-0 sm:mb-8`
          }
        >
          <Hue />
          <div className="rounded-[250px] absolute w-full h-[150%] -z-20 grid-container opacity-50">
            <Grid />
          </div>
          <div className="flex flex-col items-center justify-center w-full mt-16 gap-14 sm:ml-16 sm:w-5/6 md:lg:w-1/2 ">
            {/* <div className="flex flex-col items-start justify-center w-full gap-4 scrollHidden">
              <div className="flex p-[6px] text-zinc-600 rounded-md bg-red-300">
                <IconListSearch stroke={2.5} />
              </div>
              <span className="text-2xl font-black text-zinc-700">
                Discover More
              </span>
              <p className="text-lg font-medium text-zinc-600">
                Connect with the diverse club community at Cornell with ease
                through our user-friendly search bar.
              </p>
        </div> */}
            {/*<div className="flex flex-col items-start justify-center w-full gap-4 scrollHidden  duration-1000 delay-[100ms]">
              <div className="flex p-[6px] text-zinc-600 rounded-md bg-red-300">
                <IconSortDescending2 stroke={2} />
              </div>
              <span className="text-2xl font-black text-zinc-700">
                Streamlined Exploration
              </span>
              <p className="text-lg font-medium text-zinc-600">
                Our advanced filter options can help to find and simplify your
                search process for clubs. We offer filtering by multiple club
                criterias, including club meeting times and locations.
              </p>
              <div className="flex flex-row items-center justify-start w-full my-4 ml-4">
                <div className="flex flex-col items-start justify-center bg-white border-2 border-gray-300 rounded-xl">
                  <span className="p-2 pl-4 text-xl font-extrabold text-zinc-700">
                    Filter by
                  </span>
                  <hr className="w-full text-gray-300 border-[1px] "></hr>
                  <div className="flex flex-col items-start justify-center gap-3 px-4 py-4 ml-2">
                    <div className="flex flex-row items-center justify-center gap-2 font-medium ">
                      <IconSquareCheckFilled className="p-[2px] text-red-400 bg-red-100 rounded-lg hover:text-red-300 cursor-pointer" />
                      <span className="font-bold text-zinc-600">
                        Club Details
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 font-medium">
                      <IconSquareCheckFilled className="p-[2px] text-red-400 bg-red-100 rounded-lg hover:text-red-300 cursor-pointer" />
                      <span className="font-bold text-zinc-600">
                        Club Labels
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 font-medium">
                      <IconSquareCheckFilled className="p-[2px] text-red-400 bg-red-100 rounded-lg hover:text-red-300 cursor-pointer" />
                      <span className="font-bold text-zinc-600">
                        Meeting Times
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 font-medium">
                      <IconSquareCheckFilled className="p-[2px] text-red-400 bg-red-100 rounded-lg hover:text-red-300 cursor-pointer" />
                      <span className="font-bold text-gray-600">
                        Meeting Locations
                      </span>
                    </div>
                  </div>
                </div>
              </div>
      </div> */}
            {/*<div className="flex flex-col items-start justify-center w-full gap-4 scrollHidden  duration-1000  delay-[100ms]">
              <div className="flex p-[6px] text-zinc-600 rounded-md bg-red-300">
                <IconTags stroke={2} />
              </div>
              <span className="text-2xl font-black text-zinc-700">
                Explore with Labels
              </span>
              <p className="text-lg font-medium text-zinc-600">
                From GPT generated and manually entered labels, we make your
                club search more simple, targeted and efficient.
              </p>
              <div className="flex flex-row items-center justify-center w-full my-4 ml-4 sm:justify-start">
                <div className="flex flex-row flex-wrap items-end justify-start gap-1">
                  {["Academic", "Creative", "Sports", "Science"].map(
                    (label: string, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center px-2 m-1 font-medium text-gray-600 bg-gray-200 rounded-md "
                      >
                        <span>{label}</span>
                      </div>
                    )
                  )}
                  {showMoreLabels &&
                    [
                      "Professional",
                      "Consulting",
                      "Dance",
                      "Entrepreneurship",
                      "Language",
                      "Volunteering",
                      "Music",
                      "Sustainability",
                      "Gaming",
                      "Technology",
                      "Wellness",
                      "Media",
                      "Political",
                      "Research",
                      "Social",
                      "Networking",
                      "Religious",
                    ].map((label: string, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center px-2 m-1 font-medium text-gray-600 bg-gray-200 rounded-md"
                      >
                        <span>{label}</span>
                      </div>
                    ))}
                  <button
                    className="flex flex-col items-center px-2 m-1 font-medium text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                    onClick={() => setShowMoreLabels(!showMoreLabels)}
                  >
                    {showMoreLabels ? "less..." : "more..."}
                  </button>
                </div>
              </div>
            </div> */}
            {/*<div className="flex flex-col items-start justify-center w-full gap-4 scrollHidden  duration-1000 delay-[100ms]">
              <div className="flex p-[6px] text-zinc-600 rounded-md bg-red-300">
                <IconUrgent stroke={2} />
              </div>
              <div className="flex flex-col items-start justify-center gap-1 sm:gap-4 sm:flex-row sm:items-center ">
                <span className="text-2xl font-black text-zinc-700 ">
                  Specialty Labels
                </span>

                <div className="flex flex-row">
                  <span className="italic font-bold underline text-zinc-600 underline-offset-4">
                    post-beta
                  </span>
                </div>
              </div>
              <p className="text-lg font-medium text-zinc-600">
                Group clubs at a granular level with specialty labels! Examples
                include:
              </p>
              <div className="flex flex-row items-center justify-center w-full my-4 ml-4 sm:justify-start">
                <div className="flex flex-row flex-wrap items-center justify-start w-full gap-1">
                  <div className="flex flex-col items-center px-2 m-1 font-medium rounded-md text-amber-600 bg-amber-100">
                    <span className="">Greek Life</span>
                  </div>
                  <div className="flex flex-col items-center px-2 m-1 font-medium text-green-600 bg-green-100 rounded-md">
                    <span className="">Has Competitions</span>
                  </div>
                  <div className="flex flex-col items-center px-2 m-1 font-medium text-purple-600 bg-purple-100 rounded-md">
                    <span className="">Has Application</span>
                  </div>
                  <div className="flex flex-col items-center px-2 m-1 font-medium text-red-600 bg-red-200 rounded-md">
                    <span className="">Project Team</span>
                  </div>
                  <div className="flex flex-col items-center px-2 m-1 font-medium text-teal-600 bg-teal-100 rounded-md">
                    <span className="">Has Interview</span>
                  </div>
                  <div className="flex flex-col items-center px-2 m-1 font-medium text-pink-600 bg-pink-100 rounded-md">
                    <span className="">Has Audition</span>
                  </div>
                  <div className="flex flex-col items-center px-2 m-1 font-medium text-blue-600 bg-blue-100 rounded-md">
                    <span className="">Virtual</span>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="flex flex-col items-start justify-center w-full gap-4 scrollHidden  duration-1000 delay-[100ms]">
              <div className="flex p-[6px] text-zinc-600 rounded-md bg-red-300">
                <IconPencilPlus stroke={2} />
              </div>
              <div className="flex flex-col items-start justify-center gap-1 sm:gap-4 sm:flex-row sm:items-center ">
                <span className="text-xl font-black md:text-2xl text-zinc-700">
                  Stay Updated
                </span>
                <div className="flex flex-row">
                  <span className="text-lg italic font-bold underline md:text-xl text-zinc-600 underline-offset-4">
                    post-launch
                  </span>
                </div>
              </div>
              <p className="text-base font-medium md:text-lg text-zinc-600">
                Stay well-informed through community update requests from club
                administrators, which allows for all users to get the most
                up-to-date and accurate (verified) information. Club editing
                will begin on July 15th.
              </p>
              <div className="flex flex-row items-center justify-start w-full my-4 ml-0">
                <div className="flex flex-col items-end justify-center gap-2">
                  <button
                    className="flex items-center justify-center gap-1 px-2 py-1 font-semibold bg-orange-200 rounded-md cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-orange-300"
                    onClick={() => {
                      if (requestUpdate == "last verified 10 days ago") {
                        setRequestUpdate("last verified just now");
                      } else {
                        setRequestUpdate("last verified 10 days ago");
                      }
                    }}
                  >
                    <IconRefresh className="w-4 h-4" />
                    <span>Request Update</span>
                  </button>
                  {/*<div className="flex flex-row items-center justify-end mt-2 ">
                    <IconPointFilled
                      className={`p-1 ${
                        requestUpdate == "last verified 10 days ago"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    />
                    <span className="text-sm italic font-semibold text-gray-600 w-[165px]">
                      {requestUpdate}
                    </span>
                    </div> */}
                </div>
              </div>
              <p className="text-base font-medium md:text-lg text-zinc-600">
                Log in as a club officer through a simple process, allowing you
                to manage club details with ease, ensuring accurate and
                up-to-date information for students.
              </p>
              <div className="flex flex-row items-center justify-start w-full my-4 ml-4">
                {/*<div className="flex flex-row items-center gap-4">
                  <div className="flex p-2 bg-pink-100 rounded-md hover:bg-pink-200">
                    <IconBrandInstagram
                      className="text-pink-600"
                      stroke={2.5}
                    />
                  </div>
                  <div className="flex p-2 bg-blue-100 rounded-md hover:bg-blue-200">
                    <IconBrandFacebookFilled
                      className="text-blue-600"
                      stroke={2.5}
                    />
                  </div>
                  </div> */}
              </div>
            </div>
            <div className="flex flex-col items-start justify-center w-full gap-4 scrollHidden  duration-1000 delay-[100ms]">
              <div className="flex p-[6px] text-zinc-600 rounded-md bg-red-300">
                <IconCalendarTime stroke={2} />
              </div>
              <div className="flex flex-col items-start justify-center gap-1 sm:gap-4 sm:flex-row sm:items-center ">
                <span className="text-xl font-black md:text-2xl text-zinc-700">
                  Effortless Scheduling
                </span>

                <div className="flex flex-row italic underline underline-offset-4">
                  <span className="text-lg italic font-bold underline md:text-xl text-zinc-600">
                    post-launch
                  </span>
                </div>
              </div>
              <p className="text-base font-medium md:text-lg text-zinc-600">
                View and integrate club meeting schedules with the clubspace
                Scheduler, and add course times to help you cherry-pick clubs
                without overlapping with classes and other clubs.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex flex-col items-center justify-center w-full h-full gap-12 p-4 pt-0 sm:p-16">
          <Hue />
          <Grid />

          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-end justify-start w-full md:hidden scrollHidden opacity-0  duration-1000 delay-[200ms]">
              <div className="relative flex flex-col items-center justify-center w-full gap-2 md:right-8">
                <div className="flex flex-col items-center justify-center w-full h-full gap-12 md:gap-36">
                  <div className="flex flex-row items-end justify-center gap-[2px] md:gap-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-lg font-normal sm:text-xl md:text-2xl text-zinc-300">
                        Days
                      </span>
                      <span className="text-5xl font-extrabold lg:font-bold sm:text-6xl lg:text-8xl text-zinc-800">
                        {days}
                      </span>
                    </div>
                    <span className="py-2 text-4xl font-extrabold lg:font-bold md:py-4 lg:text-7xl text-zinc-800">
                      :
                    </span>

                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-lg font-normal sm:text-xl md:text-2xl text-zinc-300">
                        Hours
                      </span>
                      <span className="text-5xl font-extrabold lg:font-bold sm:text-6xl lg:text-8xl text-zinc-800">
                        {hours > 9 ? hours : `0${hours}`}
                      </span>
                    </div>
                    <span className="py-2 text-4xl font-extrabold lg:font-bold md:py-4 lg:text-7xl text-zinc-800">
                      :
                    </span>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-lg font-normal sm:text-xl md:text-2xl text-zinc-300">
                        Minutes
                      </span>
                      <span className="text-5xl font-extrabold lg:font-bold sm:text-6xl lg:text-8xl text-zinc-800">
                        {minutes > 9 ? minutes : `0${minutes}`}
                      </span>
                    </div>
                    <span className="py-2 text-4xl font-extrabold lg:font-bold md:py-4 lg:text-7xl text-zinc-800">
                      :
                    </span>
                    <div className="flex flex-col items-start justify-center gap-2 sm:items-center">
                      <span className="text-lg font-normal sm:text-xl md:text-2xl text-zinc-300">
                        Seconds
                      </span>
                      <span className="w-20 text-5xl font-extrabold text-red-400 lg:font-bold sm:text-6xl lg:text-8xl">
                        {seconds}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center gap-4 my-6">
                  <div className="p-2 bg-red-300 rounded-lg text-zinc-700">
                    <IconAlarmFilled />
                  </div>
                  <div className="text-xl font-bold text-red-300 sm:text-2xl">
                    Product Launch Coming Soon
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-center w-full h-full gap-12 my-24 md:mb-64">
              <div className="flex-col items-end justify-start hidden w-full ml-0 lg:ml-16 xl:ml-32 md:flex">
                <div className="relative top-[240px] left-0 flex flex-col items-end justify-center w-full opacity-0 scrollHidden  duration-1000 delay-[200ms]">
                  <span className="text-lg text-red-400">June 30th</span>
                  <span className="text-xl font-semibold md:font-bold md:text-2xl text-zinc-700">
                    Beta Launch
                  </span>
                </div>
                <div className="relative right-8 top-[300px]">
                  <div className="flex flex-col items-center justify-center w-full gap-2 opacity-0 scrollHidden  duration-1000 delay-[200ms]">
                    <div className="flex flex-col items-end justify-center w-full h-full pl-16 gap-36">
                      <div className="flex flex-row items-end justify-center gap-1 md:gap-2">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-normal text-zinc-300">
                            Days
                          </span>
                          <span className="text-5xl font-extrabold lg:font-bold sm:text-6xl lg:text-8xl text-zinc-800">
                            {days}
                          </span>
                        </div>
                        <span className="py-4 text-5xl font-extrabold lg:font-bold lg:text-7xl text-zinc-800">
                          :
                        </span>

                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-normal text-zinc-300">
                            Hours
                          </span>
                          <span className="text-5xl font-extrabold lg:font-bold sm:text-6xl lg:text-8xl text-zinc-800">
                            {hours > 9 ? hours : `0${hours}`}
                          </span>
                        </div>
                        <span className="py-4 text-5xl font-extrabold lg:font-bold lg:text-7xl text-zinc-800">
                          :
                        </span>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-normal text-zinc-300">
                            Minutes
                          </span>
                          <span className="text-5xl font-extrabold lg:font-bold sm:text-6xl lg:text-8xl text-zinc-800">
                            {minutes > 9 ? minutes : `0${minutes}`}
                          </span>
                        </div>
                        <span className="py-4 text-5xl font-extrabold lg:font-bold lg:text-7xl text-zinc-800">
                          :
                        </span>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-normal text-zinc-300">
                            Seconds
                          </span>
                          <span className="w-20 text-5xl font-extrabold text-red-400 lg:font-bold sm:text-6xl lg:text-8xl">
                            {seconds}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-center w-full gap-6 mt-10 left-1/4 md:left-1/2 opacity-0 scrollHidden  duration-1000 delay-[300ms]">
                    <div className="p-2 bg-red-300 rounded-lg text-zinc-700">
                      <IconAlarmFilled />
                    </div>
                    <div className="text-xl font-bold text-red-300 md:text-2xl">
                      Product Launch Coming Soon
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative md:hidden top-[240px] left-0 flex flex-col items-end justify-center w-1/2 md:w-full opacity-0 scrollHidden  duration-1000">
                <span className="text-lg text-red-400">June 30th</span>
                <span className="text-lg font-semibold md:font-bold lg:text-2xl text-zinc-700">
                  Beta Launch
                </span>
              </div>
              <div className="flex-shrink-0 relative flex flex-col justify-start items-center w-[3px] h-[600px] bg-red-200 opacity-0 scrollHidden  duration-1000 delay-[300ms]">
                <div
                  className="absolute w-[3px] bg-red-400"
                  style={{
                    height: 11.5 * (600 / days),
                  }}
                ></div>
                <div className="absolute top-[80px] p-[6px] bg-red-400 rounded-full"></div>
                <div className="absolute top-[260px] p-[6px] bg-red-400 rounded-full"></div>
                <div className="absolute top-[420px] p-[6px] bg-red-400 rounded-full"></div>
                <div className="absolute top-[600px] p-[6px] bg-red-200 rounded-full"></div>
              </div>
              <div className="flex flex-col items-start justify-start w-1/2 2xl:w-3/4">
                <div className="relative top-[55px] right-0 flex flex-col items-start justify-center opacity-0 scrollHidden  duration-1000">
                  <span className="text-lg text-red-400">June 7th</span>

                  <span className="text-lg font-semibold md:font-bold lg:text-2xl text-zinc-700">
                    Intro Release
                  </span>
                </div>
                <div className="relative top-[342px] sm:top-[360px] md:top-[313px] lg:top-[335px] xl:top-[330px] right-0 flex flex-col items-start justify-center opacity-0 scrollHidden  duration-1000 delay-[100ms]">
                  <span className="text-lg text-red-400">July 15th</span>
                  <span className="text-lg font-semibold md:font-bold lg:text-2xl text-zinc-700">
                    Club Edit Info
                  </span>
                </div>
                <div className="relative top-[466px] sm:top-[460px] md:top-[410px] lg:top-[457px] xl:top-[450px] right-0 flex flex-col items-start justify-center opacity-0  scrollHidden  duration-1000 delay-[200ms]">
                  <span className="text-lg text-red-400">August 1st</span>
                  <span className="text-lg font-semibold md:font-bold lg:text-2xl text-zinc-700">
                    Official Launch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function Hue() {
  return (
    <div
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 50% 50%, rgba(255, 64, 64, 0.04) 0%, rgba(255, 122, 122, 0) 100%)",
        position: "absolute",
        width: "1000px",
        height: "1000px",
        overflow: "hidden",
        left: 0,
        zIndex: -10,
      }}
    ></div>
  );
}

function Grid() {
  return (
    <div className="rounded-[250px] absolute w-full h-full -z-30 grid-container opacity-50">
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(211, 211, 211,0.75) 1px, transparent 1px),linear-gradient(90deg, rgba(211, 211, 211, 0.75) 1px, transparent 1px)`,
          backgroundSize: "150px 150px, 150px 150px",
        }}
        className="sm:top-[100px] top-0 absolute bottom-0 left-0 right-0 -z-20"
      />
      <div
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(255, 255, 255, 0) 25%, white 100%)`,
          backgroundSize: "100% 100%",
        }}
        className="sm:top-[100px] top-0 absolute bottom-0 left-0 right-0 -z-20"
      />
    </div>
  );
}
