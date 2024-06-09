"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { IconSearch, IconArrowBack, IconX } from "@tabler/icons-react";

import debounce from "lodash/debounce";

import { Club } from "@/types/club.d";
import { Label, SpecialtyLabel } from "@/types/enums.d";

import useWebpSupport from "@/hooks/useWebpSupport";
import Link from "next/link";

type SearchBarPropTypes = {
  search: string;
  setSearch: (search: string) => void;
  selectedClubId: number;
  setSelectedClubId: (selectedClubId: number) => void;
  numShowLabels: number;
  setNumShowLabels: (numShowLabels: number) => void;
  showSearch: boolean;

  searchBarHeight?: string;
  searchBarWidth?: string;
  searchBarTopBorderRadius?: string;
  searchBarBottomBorderRadius?: string;
  searchBarBorderColor?: string;
  searchBarShadow?: string;
  searchBarBorderWidth?: string;
};

const MAX_LABELS = 3;
function getStringEnumValues(e: object) {
  return Object.values(e)
    .filter((value) => isNaN(Number(value))) // Removes the numeric values
    .map((value) => value.replace("_", " ")); // Replaces underscores with spaces
}

const SPECIALTY_LABELS = [
  "Project Team",
  "Greek Life",
  "Competition",
  "Application",
  "Interview",
  "Audition",
];
export default function SearchBar(props: SearchBarPropTypes) {
  const webpSupport = useWebpSupport();
  const [loadingClub, setLoadingClub] = useState<boolean>(true);
  const [showLabelError, setShowLabelError] = useState<boolean>(false);

  const [totalLabels, setTotalLabels] = useState<number>(
    [...getStringEnumValues(Label), ...getStringEnumValues(SpecialtyLabel)]
      .length
  );
  const [showSearch, setShowSearch] = useState<boolean>(props.showSearch);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [labels, setLabels] = useState<(string | Label | SpecialtyLabel)[]>([
    ...getStringEnumValues(Label),
    ...getStringEnumValues(SpecialtyLabel),
  ]);
  const [labelPage, setLabelPage] = useState<number>(0);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [selectedClubIdx, setSelectedClubIdx] = useState<number>(0);
  const [selectedClubLabels, setSelectedClubLabels] = useState<
    (string | Label | SpecialtyLabel)[]
  >([]);

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const searchBarRef = useRef<HTMLDivElement>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(props.search);
  const [debouncedLabels, setDebouncedLabels] = useState(selectedClubLabels);

  const handleFocus = () => {
    setShowSearch(true);
  };

  const handleSelectKeys = (index: number) => {
    setSelectedClubIdx(index);
    if (filteredClubs.length > 0) {
      props.setSelectedClubId(filteredClubs[index].id);
      props.setSearch(filteredClubs[index].name);
    }
  };

  const handleClick = (index: number, club: Club) => {
    setSelectedClubIdx(index);
    props.setSelectedClubId(club.id);
    props.setSearch(club.name);
    setShowSearch(false);
  };

  // Key Presses handler for meeting time
  const handleKeys: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // Handle keyboard events for meeting search
    const { key } = e;
    let nextIdxCount = selectedClubIdx;
    if (key === "ArrowDown") {
      nextIdxCount = (selectedClubIdx + 1) % filteredClubs.length;
    }
    if (key === "ArrowUp") {
      nextIdxCount = Math.max(selectedClubIdx - 1, 0);
    }
    if (key == "Escape" || key === "Tab") {
      setShowSearch(false);
    }
    if (key === "Enter") {
      e.preventDefault();
      handleSelectKeys(nextIdxCount);
      setShowSearch(false);
    }
    if (key === "ArrowDown" || key === "ArrowUp") {
      setSelectedClubIdx(nextIdxCount);
      if (filteredClubs.length > 0) {
        props.setSelectedClubId(filteredClubs[nextIdxCount].id);
      }
    }
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      !isMouseDown &&
      !searchBarRef.current?.contains(e.relatedTarget as Node)
    ) {
      setShowSearch(false);
    }
  };

  // function addLabel(label: string | Label) {
  //   if (selectedClubLabels.length != MAX_LABELS) {
  //     setSelectedClubLabels([...selectedClubLabels, label]);
  //     setLabels(labels.filter((clublabel) => clublabel !== label));
  //   }
  // }

  // function removeLabel(label: string | Label) {
  //   setSelectedClubLabels(
  //     selectedClubLabels.filter((clublabel) => clublabel !== label)
  //   );
  //   setLabels([...labels, label]);
  // }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(props.search);
      setDebouncedLabels(selectedClubLabels);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [props.search, selectedClubLabels]);

  const fetchClubs = useCallback(
    (
      searchTerm: string,
      selectedClubLabels: (string | Label | SpecialtyLabel)[]
    ) => {
      setLoadingClub(true);

      const debouncedClubFetch = debounce(() => {
        // Prepare the search parameters
        let params = new URLSearchParams({
          take: "20", // Define the number of clubs you want to take
          skip: "0", // Define the number of clubs you want to skip
        });
        let search = searchTerm.toLowerCase();
        if (search != "") {
          params.append("search", search);
        }
        setLoadingClub(true);

        // fetch clubs
        fetch(
          `${
            process.env.NEXT_PUBLIC_ROOT_URL
          }/api/club?take=25&${params.toString()}`
        )
          .then((response) => response.json())
          .then((data: Club[]) => {
            setClubs(data);
            setFilteredClubs(data);
            setLoadingClub(false);
          })

          .catch((error) => {
            console.error("Error fetching clubs:", error);
          });
      }, 300);

      debouncedClubFetch();
    },
    []
  ); // 200ms delay

  useEffect(() => {
    fetchClubs(debouncedSearch, debouncedLabels);
    setLoadingClub(false);
  }, [debouncedSearch, debouncedLabels, fetchClubs]);

  const labelsToDisplay = labels.slice(
    labelPage * (props.numShowLabels + 1),
    (labelPage + 1) * (props.numShowLabels + 1)
  );

  const maxLabelPage = Math.ceil(totalLabels / (props.numShowLabels + 1)) - 1;

  const RemainingLabels =
    labelPage == maxLabelPage - 1
      ? (labelPage + 1) * (props.numShowLabels + 1) >= labels.length
        ? false
        : true
      : true;

  useEffect(() => {
    if (labelPage - 1 >= 0 && labelsToDisplay.length == 0) {
      setLabelPage(labelPage - 1);
    }
  }, [labelsToDisplay.length, labelPage]);

  return (
    <>
      <div
        className={`flex flex-col items-start justify-center  gap-2 ${
          props.searchBarWidth != undefined
            ? "w-full"
            : "w-full sm:w-[90%] md:w-[85%] xl:w-[65%]"
        }`}>
        {/* <span
          className={`${
            showLabelError ? "flex" : "invisible"
          }  ml-8 italic font-bold text-red-500`}
        >
          {`*max: ${props.numShowLabels} club ${
            props.numShowLabels > 1 ? "labels" : "label"
          }`}
        </span> */}

        <div
          className="relative inline-block w-full"
          ref={searchBarRef}
          onBlur={handleBlur}
          onKeyDown={handleKeys}
          tabIndex={1}>
          <div
            // className={`flex flex-row items-center px-2 py-1 bg-white h-[50px] shadow-md rounded-t-xl border-[1px] ${
            className={`flex flex-row items-center px-2 py-1 bg-white ${
              props.searchBarBorderColor
            } ${props.searchBarHeight} ${props.searchBarShadow} ${
              props.searchBarTopBorderRadius
            } ${props.searchBarBorderWidth} ${
              !showSearch &&
              `${props.searchBarBottomBorderRadius} transition-all ease-linear duration-200 delay-300`
            }`}>
            {/* <style>
              {`input::placeholder {
                  font-weight: bold;
                  }`}
            </style> */}
            <div className="flex flex-row items-center justify-center mx-2 ">
              <IconSearch className="" width={20} />
              {/* {selectedClubLabels.map((label, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-center px-2 m-1 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 hover:text-gray-700 whitespace-nowrap"
                  >
                    <span>{label}</span>
                    <IconX
                      onClick={() => removeLabel(label)}
                      className="p-1 pr-0"
                      stroke={3}
                    />
                  </div>
                );
              })} */}
            </div>

            <input
              type="text"
              placeholder="Search for clubs"
              className="w-full px-1 py-1 font-semibold text-gray-700 outline-none placeholder:font-semibold"
              onFocus={handleFocus}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  props.setSearch("");
                } else {
                  props.setSearch(e.target.value);
                }
              }}
              value={props.search}
            />
            {loadingClub && (
              <svg
                className="flex-shrink-0 w-5 h-5 mr-3 animate-spin"
                viewBox="0 0 24 24">
                <svg
                  className="mr-3 -ml-1 text-red-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </svg>
            )}
            <IconX
              onClick={() => {
                props.setSearch("");
                setLabels(labels.concat(selectedClubLabels));
                setSelectedClubLabels([]);
              }}
              className="p-1 pr-0 mr-2 cursor-pointer sm:w-auto text-zinc-500 hover:text-zinc-700 shrink-0"
              stroke={3}
            />
          </div>
          <div
            className={`absolute w-full z-10 bg-white overflow-x-hidden shadow-md rounded-b-xl ${
              showSearch ? "border" : "border-none"
            } overflow-y-hidden transition-all overflow-x-hidden duration-500 ease-out transform ${
              showSearch ? "max-h-[500px]" : "max-h-0"
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            {/*<div className="p-4 border-t-0">
              <div className="flex flex-row items-center justify-start overflow-hidden">
                {labelPage > 0 && (
                  <div
                    className="flex flex-row items-center px-1 m-1 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                    onClick={() =>
                      setLabelPage((prevPage) =>
                        prevPage - 1 >= 0 ? prevPage - 1 : prevPage
                      )
                    }
                  >
                    <IconChevronLeft />
                  </div>
                )}
                {/* {labelsToDisplay &&
                  labelsToDisplay.map((label, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center px-2 m-1 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                      onClick={() => {
                        if (selectedClubLabels.length < props.numShowLabels) {
                          addLabel(label);
                          props.setSearch("");
                        } else {
                          setShowLabelError(true);
                          setTimeout(() => {
                            setShowLabelError(false);
                          }, 3000);
                        }
                      }}
                    >
                      <span>{label}</span>
                    </div>
                  ))} */}
            {/* {labelPage < maxLabelPage && RemainingLabels && (
                  <div
                    className="flex flex-row items-center px-1 m-1 text-gray-600 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setLabelPage((prevPage) =>
                        prevPage + 1 <= maxLabelPage ? prevPage + 1 : prevPage
                      );
                    }}
                  >
                    <IconChevronRight />
                  </div>
                )} 
              </div>
            </div> */}
            {/* <hr className="w-full border-gray-200 border-[1px]"></hr> */}
            <div className="p-4 border-t-0 max-h-[300px] overflow-y-auto">
              {filteredClubs &&
                filteredClubs?.map((club, index) => (
                  <div
                    key={index}
                    className={`flex flex-row items-center justify-between m-1 p-2 cursor-pointer ${
                      selectedClubIdx === index ? "bg-gray-100 rounded-lg" : ""
                    }`}
                    onClick={() => handleClick(index, club)}>
                    <div className="flex flex-row items-center justify-center overflow-hidden">
                      <div className="w-8 h-8">
                        {club.img && (
                          <Image
                            src={club.img}
                            alt={`${club.name} logo`}
                            width={32}
                            height={32}
                            loading="lazy"
                            className="inset-0 object-contain w-full h-full rounded-md"
                          />
                        )}
                      </div>

                      <p
                        key={index}
                        className="ml-2 text-sm font-medium text-zinc-700">
                        {club.name}
                      </p>
                    </div>
                    <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-2">
                      <div className="p-1 bg-gray-300 rounded-md opacity-50">
                        <IconArrowBack className="w-4 h-4 text-gray-800" />
                      </div>
                    </div>
                  </div>
                ))}

              {filteredClubs.length != 0 && (
                <div className="flex flex-row items-center justify-start gap-2 p-2 m-1 text-center">
                  <span className="hidden text-sm font-medium text-center text-zinc-700 scroll-m-2:flex">
                    Want to view more clubs?
                  </span>
                  <span className="flex text-sm font-medium text-center text-zinc-700 xs:hidden">
                    More Clubs?
                  </span>
                  <Link href="/catalog">
                    <span className="hidden text-sm font-semibold text-center text-blue-600 underline hover:text-blue-700 sm:flex">
                      Check out our catalog of clubs
                    </span>
                    <span className="flex text-sm font-semibold text-center text-blue-600 underline hover:text-blue-700 xs:hidden">
                      View Catalog
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
