"use client";
import React, { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import ImageDropzone from "@/components/ImageDropzone";
import LinkInput from "@/components/LinkInput";
import TextInput from "@/components/TextInput";
import { useSession } from "next-auth/react";

import { Club, ClubMeeting, ClubData, ClubMeetingData } from "@/types/club";
import MeetingForm from "@/components/MeetingForm";
import { Meeting, MeetingDay, MeetingTime } from "@/types/meeting";
import { MultiSelect, Select, Textarea } from "@mantine/core";
import { IconX, IconPlus, IconLoader2, IconCheck } from "@tabler/icons-react";
import { Group, Category, Attributes } from "@/types/enums.d";

import ClubPage from "../../catalog/[id]/ClubPage";
import { info } from "console";

//checks if input is a valid url
function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

function isEmailValid(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function hasInvalidCharacters(name: string): boolean {
  const invalidCharactersRegex = /[^a-zA-Z0-9\s]/; // Matches any non-alphanumeric characters excluding spaces
  return invalidCharactersRegex.test(name);
}

type ClubType = {
  club: Club;
  meetings: Meeting[];
};

export default function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();

  const [club, setClub] = useState<Club | null>(null);

  const [initClub, setInitClub] = useState<Club | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>(
    club?.clubMeetings ?? [{}]
  );
  const [meetingsPreview, setMeetingsPreview] = useState<ClubMeetingData[]>([]);

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const [imageError, setImageError] = useState<boolean>(false);

  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [validPreview, setValidPreview] = useState<boolean>(true);

  const [meetingError, setMeetingError] = useState<boolean>(false);

  useEffect(() => {
    // Make sure club always has a numeric id
    if (club && typeof club.id === "number") {
      let newClubMeetings: ClubMeetingData[] = []; // Array to hold new meetings

      meetings.forEach((meeting) => {
        if (
          (meeting.time?.hour && meeting.time?.minute) ||
          meeting.location ||
          meeting.day
        ) {
          let newMeeting: ClubMeetingData = {
            day: meeting.day ?? undefined,
            startTime:
              meeting.time?.hour &&
              (meeting.time?.minute || meeting.time?.minute == 0)
                ? `${meeting.time?.hour}:${
                    meeting.time?.minute < 10
                      ? `0${meeting.time?.minute}`
                      : meeting.time?.minute!.toString()
                  }${meeting.time?.meridiem?.toUpperCase()}`
                : undefined,
            locationName: meeting.location ?? undefined,
            clubId: club.id,
          };
          newClubMeetings.push(newMeeting); // Add new meeting to array
        }
      });

      setMeetingsPreview(newClubMeetings);
    }
  }, [meetings, club]);

  //fetches club data from api based on page param id and sets the corresponding states to the data when page is mounted
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/${params.id}`)
      .then((res) => res.json())
      .then((data: Club) => {
        if (data) {
          setClub(data);
          // applying deep copy of club object
          setInitClub(JSON.parse(JSON.stringify(data)));

          setMeetings([
            {},
            ...data.clubMeetings.map((meeting: ClubMeeting) => {
              const match = meeting.startTime?.match(
                /^(\d{1,2}):(\d{2})([AaPp][Mm])$/
              );
              const hours = match && match[1] ? parseInt(match![1]) : undefined;
              const minutes =
                match && match[2] ? parseInt(match![2]) : undefined;
              const meridian =
                match && match[3] ? match![3].toLowerCase() : undefined;

              return {
                day: meeting.day as MeetingDay,
                time: {
                  hour: hours,
                  minute: minutes,
                  meridiem: meridian,
                } as MeetingTime,
                location: meeting.locationName,
              };
            }),
          ]);
        } else {
          return;
        }
      });
  }, [saved, params.id]);

  //sets imageurl to new image url when image file is uploaded
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //gets first file from list of selected files
    const imageFile = e.target.files && e.target.files[0];
    if (imageFile) {
      if (imageFile.size > 5000000) {
        setImageError(true);
        setTimeout(() => {
          setImageError(false);
        }, 4000);

        return;
      }
      //if file is found, create a FileReader Object
      const reader = new FileReader();
      //read contents of file as data url
      reader.readAsDataURL(imageFile);
      //when file loads, sets imageURL state to data url that was read previously
      reader.onload = () => {
        setClub({ ...club, img: reader.result as string } as Club);
      };
      // clears the file input value to prevent caching of the selected file
      e.target.value = "";
    }
  };

  const infoIsValid = (): boolean => {
    if (
      !club?.img ||
      club?.name == "" ||
      hasInvalidCharacters(club?.name) ||
      club?.email == null ||
      club?.email == "" ||
      !isEmailValid(club?.email) ||
      (club?.website != null &&
        club?.website != "" &&
        !isValidUrl(club?.website)) ||
      (club?.instagram != null &&
        club?.instagram != "" &&
        !isValidUrl(club?.instagram)) ||
      (club?.facebook != null &&
        club?.facebook != "" &&
        !isValidUrl(club?.facebook)) ||
      (club?.discord != null &&
        club?.discord != "" &&
        !isValidUrl(club?.discord)) ||
      (club?.campusGroupLink != null &&
        club?.campusGroupLink != "" &&
        !isValidUrl(club?.campusGroupLink)) ||
      club?.description.length < 20 ||
      club?.group == undefined
    ) {
      return false;
    }
    return true;
  };
  /**functions for handling meetings:**/

  //adds empty meeting to beginning of meetings array only if all fields of previous meeting are filled
  const addMeeting = (index: number) => {
    if (
      meetings[index].day ||
      (meetings[index].time?.hour &&
        (meetings[index].time?.minute || meetings[index].time?.minute == 0)) ||
      meetings[index].location
    ) {
      setMeetings([{}, ...meetings]);
    } else {
      setMeetingError(true);
      setTimeout(() => {
        setMeetingError(false);
      }, 4000);
    }
  };
  //removes meeting from meetings array
  const removeMeeting = (index: number) => {
    setMeetings(meetings.filter((_, i) => i !== index));
  };
  //sets meeting at index to new meeting in meetings array
  const setMeeting = (index: number, newMeeting: Meeting) => {
    setMeetings(
      meetings.map((meeting, i) => (i === index ? newMeeting : meeting))
    );
  };

  /** Button handler functions: */

  // on preview, preview club inputs
  const handlePreview = () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      if (infoIsValid()) {
        setShowPreview(true);
        setValidPreview(true);
      } else {
        setValidPreview(false);
      }
    }
  };

  useEffect(() => {
    if (infoIsValid()) {
      setValidPreview(true);
    } else {
      setValidPreview(false);
    }
  }, [club, infoIsValid]);

  //on cancel, resets all states to original club data
  const handleCancel = () => {
    if (club) {
      setClub(initClub);

      if (meetings) {
        setMeetings([
          {},
          ...club.clubMeetings.map((meeting: ClubMeeting) => {
            const match = meeting.startTime?.match(
              /^(\d{1,2}):(\d{2})([AaPp][Mm])$/
            );
            const hours = parseInt(match![1]);
            const minutes = parseInt(match![2]);
            const meridian = match![3].toLowerCase();

            return {
              day: meeting.day as MeetingDay,
              time: {
                hour: hours,
                minute: minutes,
                meridiem: meridian,
              } as MeetingTime,
              location: meeting.locationName,
            };
          }),
        ]);
      }
    }
  };
  //on save, sends new club data to server route to update club
  const handleSave = async () => {
    if (!infoIsValid() || !club) {
      return;
    } else {
      setSaveLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            img: club.img,
            name: club.name,
            website: club.website != "" ? club.website : undefined,
            email: club.email != "" ? club.email : undefined,
            group: club.group as Group,
            categories: club.categories as Category[],
            attributes: club.attributes as Attributes[],
            description: club.description,
            instagram: club.instagram != "" ? club.instagram : undefined,
            facebook: club.facebook != "" ? club.facebook : undefined,
            discord: club.discord != "" ? club.discord : undefined,
            campusGroupLink:
              club.campusGroupLink != "" ? club.campusGroupLink : undefined,
          } as ClubData),
        }
      );
      let meetingRes;
      if (meetings.length > 1) {
        meetingRes = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/meeting`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              meetings: meetings.slice(1).map((meeting) => {
                return {
                  day: meeting.day,
                  startTime: `${meeting.time?.hour}:${
                    meeting.time?.minute! < 10
                      ? `0${meeting.time?.minute}`
                      : meeting.time?.minute!.toString()
                  }${meeting.time?.meridiem?.toUpperCase()}`,
                  locationName: meeting.location,
                } as ClubMeeting;
              }),
              id: params.id,
            }),
          }
        );
      } else {
        meetingRes = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/meeting`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              meetings: [] as ClubMeeting[],
              id: params.id,
            }),
          }
        );
      }
      if (
        res.ok &&
        (meetings.length > 1 && meetingRes != undefined ? meetingRes.ok : true)
      ) {
        // console.log(
        //   "clubData:",
        //   res.json(),
        //   "meetingData:",
        //   meetingRes?.json()
        // );
      } else {
        // console.error(
        //   "Error: ",
        //   res.statusText,
        //   "MeetingError: ",
        //   meetingRes?.statusText
        // );
      }
      setSaved(!saved);
      setTimeout(() => {
        setSaveLoading(false);
      }, 500);
    }
  };
  return (
    <>
      {session?.user?.role === "admin" || session?.user?.role == "club" ? (
        <div className=" sm:px-[54px] w-full h-auto pb-8">
          <div className=" pt-4 sm:pt-[68px] px-10 sm:px-[62px] pb-[54px] h-full sm:border border-[#E4E4E7] rounded-2xl flex flex-col gap-9">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 sm:items-center sm:justify-between sm:flex-row sm:gap-0">
                <div className="flex flex-col gap-2">
                  <span className="text-2xl/[20px] font-bold text-[#272831]">
                    Club Profile
                  </span>
                  <span className="text-sm/[20px] font-semibold text-[#9F9F9F]">
                    Update your club photo and details here.
                  </span>
                </div>
                <div className="flex items-center gap-4 sm:gap-3">
                  <button onClick={handlePreview}>
                    <div
                      className={`border-2 border-[#E4E4E7] rounded-[10px] py-1.5 px-4 lg:px-4 sm:px-2 drop-shadow-[2px_2px_20px_rgba(0,0,0,0.20)] hover:border-[#9D9D9D] ${
                        validPreview
                          ? ""
                          : "border-[#FF6B6B] hover:border-[#FF6B6B]"
                      }`}
                    >
                      <span className=" text-[#646464] text-sm/[20px] font-medium">
                        {showPreview ? "Edit" : "Preview"}
                      </span>
                    </div>
                  </button>
                  <button onClick={handleCancel}>
                    <div className="rounded-[10px] py-1.5 px-4 lg:px-4 sm:px-3 bg-[#646464] drop-shadow-[2px_2px_20px_rgba(0,0,0,0.20)] hover:bg-[#9D9D9D]">
                      <span className=" text-white text-sm/[20px] font-medium">
                        Cancel
                      </span>
                    </div>
                  </button>
                  <button onClick={handleSave}>
                    <div className="rounded-[10px] py-2 px-5 sm:px-3 lg:px-5 bg-[#FF7A7A] drop-shadow-[2px_2px_20px_rgba(0,0,0,0.20)] hover:bg-red-500 flex gap-2 items-center focus:outline-none">
                      <div
                        className={`animate-spin text-white ${
                          saveLoading ? "" : "hidden"
                        }`}
                      >
                        <IconLoader2 stroke={3} width={18} />
                      </div>
                      <span className=" text-white text-sm/[20px] font-medium">
                        Save
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-[#F3F3F3] h-[2px]">
                <hr />
              </div>
            </div>

            {club && !showPreview ? (
              <>
                <div className="flex flex-col gap-9 sm:gap-9 lg:gap-16 h-[35%]">
                  <div className="flex flex-col h-full gap-5 lg:flex-row lg:gap-20">
                    <div className="flex flex-col lg:w-[36%]">
                      <span className="text-sm/[20px] font-bold text-[#272831]">
                        Club Logo
                      </span>
                      <span className="text-sm/[20px] font-medium text-[#9F9F9F]">
                        Update your club logo and then choose where you want to
                        display it.
                      </span>
                    </div>
                    <div className="flex sm:gap-2 lg:gap-4 xl:gap-10 items-center md:items-start w-[60%] h-full">
                      <div className="">
                        <ImageUpload
                          imageUrl={club?.img ?? null}
                          setImageUrl={handleImageFileChange}
                        />
                      </div>
                      <div className="hidden md:block md:w-[60%] md:h-full ">
                        <ImageDropzone
                          club={club}
                          handleImageUrl={handleImageFileChange}
                          setClub={setClub}
                          size={5000000}
                          imageError={imageError}
                          setImageError={setImageError}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F3F3F3] h-[2px]">
                    <hr />
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4 lg:flex-row sm:gap-5 lg:gap-20">
                    <div className="flex flex-col gap-0.5 lg:w-[36%]">
                      <span className="text-[#272831] text-sm/[20px] font-bold">
                        Club Name
                      </span>
                      <span className="text-[#9F9F9F] text-sm/[20px] font-medium">
                        This will be displayed on your club page.
                      </span>
                    </div>
                    <div className="flex flex-col gap-5 lg:w-[46%]">
                      <div>{club.name}</div>

                      <div>
                        <TextInput
                          text={club.email ?? ""}
                          setText={(newEmail) =>
                            setClub({ ...club, email: newEmail })
                          }
                          placeholder={"Email"}
                        />
                      </div>

                      <div>
                        <LinkInput
                          link={club.website ?? ""}
                          setLink={(newWebsite) =>
                            setClub({ ...club, website: newWebsite })
                          }
                          prefix={"Website"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F3F3F3] h-[2px]">
                    <hr />
                  </div>
                </div>
                <div className="flex flex-col gap-9">
                  <div className="flex flex-col gap-4 lg:flex-row sm:gap-5 lg:gap-20">
                    <div className="flex flex-col gap-0.5 lg:w-[36%]">
                      <span className="text-[#272831] text-sm/[20px] font-bold">
                        Description
                      </span>
                      <span className="text-[#9F9F9F] text-sm/[20px] font-medium">
                        A quick summary of your club.
                      </span>
                    </div>
                    <div className="lg:w-[46%] flex flex-col">
                      <Textarea
                        placeholder="Description"
                        autosize
                        size="sm"
                        value={club.description}
                        onChange={(e) =>
                          setClub({
                            ...club,
                            description: e.currentTarget.value,
                          })
                        }
                        styles={{
                          input: {
                            borderRadius: "9px",
                            borderWidth: "2px",
                            borderColor:
                              club.description != "" &&
                              club.description.length >= 20
                                ? "#D9D9D9"
                                : "#FF6B6B",
                            ":focus-within": {
                              borderColor: "#9D9D9D",
                            },
                            "::placeholder": {
                              color: "#9D9D9D",
                              fontSize: "15px",
                              fontWeight: 500,
                            },
                          },
                        }}
                      />
                      {club.description == "" ||
                      club.description.length < 20 ? (
                        <span className="text-[#FF6B6B] text-xs/[20px] font-medium">
                          Required field
                        </span>
                      ) : (
                        false
                      )}
                    </div>
                  </div>
                  <div className="bg-[#F3F3F3] h-[2px]">
                    <hr />
                  </div>
                </div>
                <div className="flex flex-col gap-9">
                  <div className="flex flex-col gap-4 lg:flex-row sm:gap-5 lg:gap-20">
                    <div className="flex flex-col gap-0.5 lg:w-[36%]">
                      <span className="text-[#272831] text-sm/[20px] font-bold">
                        Social Profiles
                      </span>
                      <span className="text-[#9F9F9F] text-sm/[20px] font-medium">
                        Include your other platforms your club offers on.
                      </span>
                    </div>
                    <div className="flex flex-col lg:w-[46%] gap-5">
                      <div>
                        <LinkInput
                          prefix={"instagram"}
                          link={club.instagram ?? ""}
                          setLink={(newInstagram) =>
                            setClub({ ...club, instagram: newInstagram })
                          }
                        />
                      </div>
                      <div>
                        <LinkInput
                          prefix={"facebook"}
                          link={club.facebook ?? ""}
                          setLink={(newFacebook) =>
                            setClub({ ...club, facebook: newFacebook })
                          }
                        />
                      </div>
                      <div>
                        <LinkInput
                          prefix={"campusgroups"}
                          link={club.campusGroupLink ?? ""}
                          setLink={(newCG) =>
                            setClub({ ...club, campusGroupLink: newCG })
                          }
                        />
                      </div>
                      <div>
                        <LinkInput
                          prefix={"discord"}
                          link={club.discord ?? ""}
                          setLink={(newDiscord) =>
                            setClub({ ...club, discord: newDiscord })
                          }
                        />
                      </div>
                      {/* <div>
                    <LinkInput
                      prefix={"other"}
                      link={miscLink}
                      setLink={setMiscLink}
                    />
                  </div> */}
                    </div>
                  </div>
                  <div className="bg-[#F3F3F3] h-[2px]">
                    <hr />
                  </div>
                </div>
                <div className="flex flex-col gap-9">
                  <div className="flex flex-col gap-4 lg:flex-row sm:gap-5 lg:gap-20">
                    <div className="flex flex-col gap-0.5 lg:w-[36%]">
                      <span className="text-[#272831] text-sm/[20px] font-bold">
                        Tags
                      </span>
                      <span className="text-[#9F9F9F] text-sm/[20px] font-medium">
                        Labels that best represent your club.
                      </span>
                    </div>
                    <div className="sm:w-full lg:w-[46%] flex flex-col gap-5">
                      <div className="flex flex-col">
                        <Select
                          data={Object.values(Group)
                            .filter((value) => isNaN(Number(value)))
                            .sort((a, b) => a.localeCompare(b))}
                          value={club.group}
                          placeholder="Group"
                          onChange={(value) =>
                            setClub({ ...club, group: value as Group })
                          }
                          searchable
                          clearable
                          dropdownPosition="bottom"
                          styles={{
                            input: {
                              borderRadius: "9px",
                              borderWidth: "2px",
                              borderColor:
                                club.group == undefined ? "#FF6B6B" : "#D9D9D9",
                              ":focus-within": {
                                borderColor: "#9D9D9D",
                              },
                            },
                          }}
                        />
                        {club.group == undefined ? (
                          <span className="text-[#FF6B6B] text-xs/[20px] font-medium">
                            Required field
                          </span>
                        ) : (
                          false
                        )}
                      </div>
                      <div className="flex flex-col">
                        <MultiSelect
                          data={Object.values(Category)
                            .filter((value) => isNaN(Number(value)))
                            .sort((a, b) => a.localeCompare(b))}
                          value={club.categories}
                          placeholder="Categories"
                          onChange={(value) => {
                            const sortedValue = value
                              .slice()
                              .sort((a, b) => a.localeCompare(b));
                            if (value.length <= 3) {
                              setClub({
                                ...club,
                                categories: sortedValue as Category[],
                              });
                            }
                          }}
                          searchable
                          clearable
                          dropdownPosition="bottom"
                          styles={{
                            input: {
                              borderRadius: "9px",
                              borderWidth: "2px",
                              borderColor: "#D9D9D9",
                              ":focus-within": {
                                borderColor: "#9D9D9D",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F3F3F3] h-[2px]">
                    <hr />
                  </div>
                </div>
                <div className="flex flex-col gap-9">
                  <div className="flex flex-col gap-4 lg:flex-row sm:gap-5 lg:gap-20">
                    <div className="flex flex-col gap-0.5 lg:w-[36%]">
                      <span className="text-[#272831] text-sm/[20px] font-bold">
                        Attributes
                      </span>
                      <span className="text-[#9F9F9F] text-sm/[20px] font-medium">
                        Select all that applies to your club.
                      </span>
                    </div>
                    <div className="sm:w-full lg:w-[46%] flex flex-col">
                      <MultiSelect
                        data={Object.values(Attributes)
                          .filter((value) => isNaN(Number(value)))
                          .sort((a, b) => a.localeCompare(b))}
                        value={club.attributes}
                        placeholder="Attributes"
                        onChange={(value) => {
                          const sortedValue = value
                            .slice()
                            .sort((a, b) => a.localeCompare(b));
                          setClub({
                            ...club,
                            attributes: sortedValue as Attributes[],
                          });
                        }}
                        searchable
                        clearable
                        dropdownPosition="bottom"
                        styles={{
                          input: {
                            borderRadius: "9px",
                            borderWidth: "2px",
                            borderColor: "#D9D9D9",
                            ":focus-within": {
                              borderColor: "#9D9D9D",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-[#F3F3F3] h-[2px]">
                    <hr />
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:flex-row sm:gap-5 lg:gap-20">
                  <div className="flex flex-col gap-0.5 w-[36%]">
                    <span className="text-[#272831] text-sm/[20px] font-bold">
                      Meetings
                    </span>
                    <span className="text-[#9F9F9F] text-sm/[20px] font-medium">
                      When and where?
                    </span>
                  </div>
                  <div className="lg:w-[46%]">
                    <div className="flex flex-col gap-5">
                      {meetings
                        .slice(0)
                        .reverse()
                        .map((meeting: Meeting, index: number) => {
                          return (
                            <div key={index} className="flex flex-col">
                              <div
                                key={index}
                                className="flex flex-row items-center w-full gap-2"
                              >
                                <MeetingForm
                                  id={index}
                                  meeting={meeting}
                                  setMeeting={(newMeeting: Meeting) =>
                                    setMeeting(
                                      Math.abs(index - (meetings.length - 1)),
                                      newMeeting
                                    )
                                  }
                                  isEmpty={index == meetings.length - 1}
                                />
                                {index != meetings.length - 1 ? (
                                  <button
                                    onClick={() =>
                                      removeMeeting(
                                        Math.abs(index - (meetings.length - 1))
                                      )
                                    }
                                    className="flex items-center justify-center w-6 h-6 p-1 text-red-400 rounded-lg bg-zinc-100"
                                  >
                                    <IconX stroke={3} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      addMeeting(
                                        Math.abs(index - (meetings.length - 1))
                                      )
                                    }
                                    className="flex items-center justify-center w-6 h-6 p-1 text-[#9D9D9D] rounded-lg bg-zinc-100"
                                  >
                                    <IconPlus stroke={3} />
                                  </button>
                                )}
                              </div>
                              {index == meetings.length - 1 && meetingError ? (
                                <span className="text-[#FF6B6B] text-xs/[20px] font-medium">
                                  Invalid Meeting
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <ClubPage club={club} meetingsPreview={meetingsPreview} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-semibold text-zinc-600">
              User is not verified to edit club
            </span>
            <span className="text-xl font-bold text-zinc-700">
              Please log in with club account to edit club.
            </span>
          </div>
        </div>
      )}
    </>
  );
}
