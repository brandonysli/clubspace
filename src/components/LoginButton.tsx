"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { IconSearch, IconArrowBack, IconX } from "@tabler/icons-react";

import debounce from "lodash/debounce";

import { Club } from "@/types/club.d";
import { Label, SpecialtyLabel } from "@/types/enums.d";

import {
  IconLogout,
  IconHeart,
  IconHeartFilled,
  IconEdit,
} from "@tabler/icons-react";

import CornellImage from "../../public/images/cornell.png";

import {
  Modal,
  CloseButton,
  Paper,
  SegmentedControl,
  MantineProvider,
  PasswordInput,
} from "@mantine/core";

function ClubLogin() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedClubId, setSelectedClubId] = useState(1991);
  const [numShowLabels, setNumShowLabels] = useState(2);
  const [password, setPassword] = useState("");
  const handleClubLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = signIn("credentials", {
      clubId: selectedClubId,
      password: password,
      callbackUrl: `${window.location.origin}/edit/${selectedClubId}`,
    });
  };

  return (
    <div className="flex flex-col justify-center w-full h-full px-4 py-10">
      <form className="flex flex-col gap-4" onSubmit={handleClubLogin}>
        <div className="flex flex-col w-full h-auto">
          <SearchBar
            search={search}
            setSearch={setSearch}
            selectedClubId={selectedClubId}
            setSelectedClubId={setSelectedClubId}
            numShowLabels={numShowLabels}
            setNumShowLabels={setNumShowLabels}
            showSearch={false}
          />
        </div>

        <label>
          <PasswordInput
            placeholder="Password"
            withAsterisk
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            radius="md"
            className="w-full sm:w-auto"
          />
          <p
            className="mt-2 text-right text-gray-400 small-text"
            style={{ fontSize: "0.6rem" }}>
            {"Password sent to admin's emails"}
          </p>
        </label>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-red-400 rounded-lg sm:w-auto hover:bg-red-500">
          Log In
        </button>
      </form>
    </div>
  );
}

function GoogleLogin() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-10">
      <button
        className="flex items-center w-auto px-10 py-2 font-bold bg-white border-2 border-gray-300 rounded-lg text-zinc-600 hover:bg-gray-100"
        onClick={() => signIn("google")}>
        <Image src={CornellImage} alt="cornellIcon" width={24} height={24} />
        <span className="hidden ml-2 xs:flex">Log in with Cornell</span>
        <span className="flex ml-2 xs:hidden">Log in</span>
      </button>
      <p className="mt-2 text-sm font-medium text-zinc-400">
        Please use your Cornell email.
      </p>
    </div>
  );
}

type LoginProps = {
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
};

export default function Login(props: LoginProps) {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmentValue, setSegmentValue] = useState("User");
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  const router = useRouter();
  const [selectedFavorites, setSelectedFavorites] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFavoriteButtonClick = () => {
    setSelectedFavorites((prevFavorites) => {
      let newFavoriteStatus = !prevFavorites;
      let newSearchParams = new URLSearchParams();

      if (newFavoriteStatus) {
        newSearchParams.set("followed", "true");
      } else {
        newSearchParams.delete("followed");
      }

      router.push(`${props.pathname}?${newSearchParams.toString()}`);
      return newFavoriteStatus;
    });
  };

  const handleEditClubButtonClick = () => {
    router.push(`/edit/${session?.user?.clubId}`);
  };

  useEffect(() => {
    const isFollowedSet = props.searchParams.get("followed");
    setSelectedFavorites(isFollowedSet === "true");
  }, [props.searchParams]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!loginButtonRef.current?.contains(event.target as Node)) {
        if (
          loginRef.current &&
          !loginRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick, false);

    return () => {
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, []);

  return (
    <MantineProvider
      theme={{
        colors: {
          white: [
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
            "#F8F9FA",
          ],
          darkgray: [
            "#909296",
            "#909296",
            "#909296",
            "#909296",
            "#909296",
            "#909296",
            "#909296",
            "#909296",
            "#909296",
            "#909296",
          ],
        },
      }}>
      <>
        {status === "authenticated" ? (
          <div className={`relative inline-block text-left`}>
            <button
              ref={loginButtonRef}
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center flex-row justify-end w-full h-[48px] overflow-hidden border-[3px] border-red-300 rounded-full shadow`}>
              {userImage && (
                <Image
                  src={userImage}
                  alt="User avatar"
                  className="object-cover w-full h-full"
                  width={48}
                  height={48}
                />
              )}
            </button>

            {showDropdown && (
              <div
                ref={loginRef}
                className="absolute right-0 flex flex-col gap-2 px-2 py-2 mt-4 origin-top-right bg-white border rounded-lg shadow-lg border-zinc-300 ring-1 ring-black ring-opacity-5">
                <div className="flex flex-row items-center justify-center w-full gap-2 p-1">
                  <div className="w-10 overflow-hidden border-[1px] border-red-300 rounded-full shadow">
                    {userImage && (
                      <Image
                        src={userImage}
                        alt="User avatar"
                        className="w-full h-full "
                        width={40}
                        height={40}
                      />
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-bold leading-4">
                      {userName}
                    </span>
                    <span className="text-xs text-gray-500">{userEmail}</span>
                  </div>
                </div>
                <hr className="flex-grow border w-7/8 border-zinc-100" />
                <div className="flex flex-col justify-center gap-1">
                  {session?.user?.role == "admin" ||
                  session?.user?.role! == "user" ? (
                    <button
                      onClick={handleFavoriteButtonClick}
                      className="flex flex-row items-center gap-2 py-1 pl-2 text-sm text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
                      {selectedFavorites ? (
                        <IconHeartFilled style={{ color: "#FF7A7A" }} />
                      ) : (
                        <IconHeart />
                      )}
                      <span className="">Favorites</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleEditClubButtonClick}
                      className="flex flex-row items-center gap-2 py-1 pl-2 text-sm text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
                      <IconEdit />
                      <span className="">Edit Club</span>
                    </button>
                  )}

                  <button
                    className="flex flex-row items-center w-full gap-2 py-1 pl-2 text-sm text-left text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => signOut()}>
                    <IconLogout />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={openModal}
              className="flex items-center justify-center px-4 py-2 font-bold text-white h-[48px] rounded-lg bg-zinc-700">
              <span className="">Login</span>
            </button>

            <Modal
              opened={isModalOpen}
              onClose={closeModal}
              withCloseButton={false}
              size="sm"
              title={null}
              radius="lg"
              centered>
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <CloseButton onClick={closeModal} />
              </div>
              <div className="flex flex-col items-center justify-center mt-8 modalContent">
                <h2 className="mb-1 text-2xl font-bold text-black">Log In</h2>
                <p className="mb-4 text-sm font-medium text-zinc-400">
                  Hi there, please enter your details.
                </p>

                <SegmentedControl
                  radius="md"
                  value={segmentValue}
                  onChange={setSegmentValue}
                  // color="white" // Set the color of the active segment to blue
                  data={[
                    { label: "User", value: "User" },
                    { label: "Club", value: "Club" },
                  ]}
                />

                {segmentValue === "User" ? <GoogleLogin /> : <ClubLogin />}
              </div>
            </Modal>
          </>
        )}
      </>
    </MantineProvider>
  );
}

type SearchBarPropTypes = {
  search: string;
  setSearch: (search: string) => void;
  selectedClubId: number;
  setSelectedClubId: (selectedClubId: number) => void;
  numShowLabels: number;
  setNumShowLabels: (numShowLabels: number) => void;
  showSearch: boolean;
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

function SearchBar(props: SearchBarPropTypes) {
  const [loadingClub, setLoadingClub] = useState<boolean>(true);
  const [showLabelError, setShowLabelError] = useState<boolean>(false);

  const [totalLabels, setTotalLabels] = useState<number>(
    [...getStringEnumValues(Label), ...getStringEnumValues(SpecialtyLabel)]
      .length
  );
  const [clickedClub, setClickedClub] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(props.showSearch);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [labels, setLabels] = useState<(string | Label | SpecialtyLabel)[]>([
    ...getStringEnumValues(Label),
    ...getStringEnumValues(SpecialtyLabel),
  ]);
  const [labelPage, setLabelPage] = useState<number>(0);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [selectedClubIdx, setSelectedClubIdx] = useState<number>(-1);
  const [selectedClubLabels, setSelectedClubLabels] = useState<
    (string | Label | SpecialtyLabel)[]
  >([]);

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const searchBarRef = useRef<HTMLDivElement>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(props.search);
  const [debouncedLabels, setDebouncedLabels] = useState(selectedClubLabels);

  const handleFocus = () => {
    if (props.search !== "") {
      setShowSearch(true);
    }
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
    setClickedClub(true);
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
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club?${params.toString()}`
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
        if (searchTerm === "") {
          setShowSearch(false);
        } else {
          setShowSearch(true);
        }
      }, 300);

      debouncedClubFetch();
    },
    []
  ); // 200ms delay

  useEffect(() => {
    if (!clickedClub) {
      fetchClubs(debouncedSearch, debouncedLabels);
      setLoadingClub(false);
    }
  }, [debouncedSearch, debouncedLabels, fetchClubs, clickedClub]);

  return (
    <>
      <div className={`flex flex-col items-start justify-center  gap-2 w-full`}>
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
            className={`flex flex-row border-[1px] border-gray-300  items-center pl-2 pr-1 py-1 bg-white  h-[36px] rounded-t-md ${
              !showSearch &&
              `rounded-b-md transition-all ease-linear duration-200 delay-300`
            }`}>
            {/* <style>
              {`input::placeholder {
                  font-weight: bold;
                  }`}
            </style> */}
            <div className="mx-2">
              <IconSearch className="text-zinc-600" width={16} />
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
              placeholder="Your club"
              className="w-full px-1 py-1 text-sm font-semibold text-gray-700 outline-none placeholder:font-normal placeholder:text-sm "
              onFocus={handleFocus}
              onChange={(e) => {
                setClickedClub(false);
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
            <div className="rounded-lg cursor-pointer sm:w-auto text-zinc-400 hover:bg-zinc-50 shrink-0">
              <IconX
                onClick={() => {
                  props.setSearch("");
                  setLabels(labels.concat(selectedClubLabels));
                  setSelectedClubLabels([]);
                }}
                stroke={2.75}
                className="p-1"
              />
            </div>
          </div>
          <div
            className={`absolute w-full z-10 bg-white overflow-x-hidden shadow-md rounded-b-xl ${
              showSearch ? "border" : "border-none"
            } overflow-y-hidden transition-all overflow-x-hidden duration-500 ease-out transform ${
              showSearch ? "max-h-[500px]" : "max-h-0"
            }`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}>
            <div className="p-4 border-t-0 max-h-[150px] overflow-y-auto">
              {filteredClubs &&
                filteredClubs?.map((club, index) => (
                  <div
                    key={index}
                    className={`flex flex-row items-center justify-between m-1 p-2 cursor-pointer hover:bg-zinc-50 ${
                      selectedClubIdx === index ? "bg-zinc-100 rounded-lg" : ""
                    }`}
                    onClick={() => handleClick(index, club)}>
                    <div className="flex flex-row items-center justify-center overflow-hidden">
                      <div className="w-6 h-6">
                        {club.img && (
                          <Image
                            src={club.img}
                            alt={`${club.name} logo`}
                            width={24}
                            height={24}
                            loading="lazy"
                            className="inset-0 object-contain w-full h-full rounded-md"
                          />
                        )}
                      </div>

                      <p
                        key={index}
                        className="ml-2 text-xs font-medium text-zinc-700">
                        {club.name}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
