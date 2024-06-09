// "use client";
// import React, { useState, useEffect } from "react";
// import { MultiSelect, TextInput, Textarea } from "@mantine/core";
// import { Club, ClubMeeting, Day } from "@/types/club.d";
// import { IconSearch, IconArrowBackUp, IconCheck } from "@tabler/icons-react";

// //type for club editor. initialData for club data at row being expanded, onDone function to update visual data, onCancel function for collapsing
// type ClubEditorPropType = {
//   initialData: Club;
//   onDone: (data: Club) => void;
//   onCancel: () => void;
// };

// //Array for Club Labels
// const CLUB_LABELS = [
//   "Academic",
//   "Professional",
//   "Creative",
//   "Consulting",
//   "Dance",
//   "Sports",
//   "Entrepreneurship",
//   "Cultural",
//   "Sustainability",
//   "Gaming",
//   "Technology",
//   "Wellness",
//   "Language",
//   "Media",
//   "Music",
//   "Volunteer",
//   "Political",
//   "Religious",
//   "Science",
//   "Research",
//   "Social",
//   "Networking",
// ];

// const SPECIALTY_LABELS = [
//   "Project Team",
//   "Greek Life",
//   "Competition",
//   "Application",
//   "Interview",
//   "Audition",
// ];

// const SPECIALTY_LABELS_UNDERSCORE = [
//   "Project_Team",
//   "Greek_Life",
//   "Competition",
//   "Application",
//   "Interview",
//   "Audition",
// ];

// const DAY_ENUMS: Day[] = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
// export default function ClubEditor({
//   initialData,
//   onDone,
//   onCancel,
// }: ClubEditorPropType) {
//   //state for club name
//   const [name, setName] = useState<string>(initialData.name);
//   //state for club description
//   const [description, setDescription] = useState<string>(
//     initialData.description
//   );
//   //state for club website
//   const [website, setWebsite] = useState<string>(
//     initialData.website != null ? initialData.website : ""
//   );

//   const [password, setPassword] = useState<string>(
//     initialData.password != null ? initialData.password : ""
//   );

//   const [imageUrl, setImageUrl] = useState<string>(
//     initialData.img != null ? initialData.img : ""
//   );

//   const [instagram, setInstagram] = useState<string>(
//     initialData.instagram != null ? initialData.instagram : ""
//   );
//   const [facebook, setFacebook] = useState<string>(
//     initialData.facebook != null ? initialData.facebook : ""
//   );
//   const [discord, setDiscord] = useState<string>(
//     initialData.discord != null ? initialData.discord : ""
//   );

//   const [campusGroupLink, setCampusGroupLink] = useState<string>(
//     initialData.campusGroupLink != null ? initialData.campusGroupLink : ""
//   );

//   // state for selected group
//   const [group, setGroup] = useState<string>(initialData.group);

//   //state for selected categories
//   const [categories, setCategories] = useState<string[]>(
//     initialData.categories
//   );

//   //state for selected attributes
//   const [attributes, setAttributes] = useState<string[]>(
//     initialData.attributes.map((specialtyLabel: string) =>
//       specialtyLabel.replace("_", " ")
//     )
//   );

//   //state for club location
//   const [location, setLocation] = useState<string>(
//     initialData.clubMeetings.length == 0
//       ? ""
//       : initialData.clubMeetings[0].locationName != null
//       ? initialData.clubMeetings[0].locationName
//       : ""
//   );

//   //state for club meeting times
//   const [meetingTimes, setMeetingTimes] = useState<string>(
//     initialData.clubMeetings.length == 0
//       ? ""
//       : initialData.clubMeetings
//           .map(
//             (clubMeeting: ClubMeeting) =>
//               `${clubMeeting.day} ${clubMeeting.startTime}-${
//                 clubMeeting.endTime ? clubMeeting.endTime : "TBD"
//               }`
//           )
//           .join(", ")
//   );

//   async function updateClub() {
//     const updatedData = {
//       ...initialData,
//       name: name.trim(),
//       description: description.trim(),
//       website: website.trim(),
//       password: password.trim(),
//       instagram: instagram.trim(),
//       facebook: facebook.trim(),
//       discord: discord.trim(),
//       campusGroupLink: campusGroupLink.trim(),
//       img: imageUrl.trim(),
//       group: group,
//       categories: SPECIALTY_LABELS_UNDERSCORE.filter((category) =>
//         categories.includes(category.replace("_", " "))
//       ),
//     };

//     await fetch(
//       `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/` + initialData.id,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedData),
//       }
//     )
//       .then((response) => {
//         if (response.ok) {
//           // Request was successful, you can handle the response here if needed
//           console.log("PUT request successful");
//           onDone(updatedData as Club);
//           return response.json();
//         } else {
//           throw new Error("Error updating club");
//         }
//       })
//       .then((data) => {
//         console.log("Response data:", data);
//       })
//       .catch((error) => {
//         // Request failed, handle the error here
//         console.error("Error updating club:", error);
//       });
//   }

//   async function updateClubMeetings() {
//     const meetingTimesList = meetingTimes.split(", ");
//     const clubMeetingDataList: ClubMeeting[] =
//       initialData.clubMeetings.length != 0
//         ? initialData.clubMeetings.map(
//             (clubMeeting: ClubMeeting, index: number) =>
//               ({
//                 id: clubMeeting.id,
//                 clubId: clubMeeting.clubId,
//                 locationName: location,
//                 address: clubMeeting.address,
//                 latitude: clubMeeting.latitude,
//                 longitude: clubMeeting.longitude,
//                 startTime: meetingTimesList[index].split(" ")[1].split("-")[0],
//                 endTime: meetingTimesList[index].split(" ")[1].split("-")[1],
//                 day: DAY_ENUMS.find(
//                   (day) => day == meetingTimesList[index].split(" ")[0]
//                 ),
//                 createdAt: clubMeeting.createdAt,
//                 modifiedAt: clubMeeting.modifiedAt,
//                 deletedAt: clubMeeting.deletedAt,
//               } as ClubMeeting)
//           )
//         : meetingTimesList.map((meetingTime: string) => {
//             const timeSplit = meetingTime.split(" ");
//             let startTime: string | undefined = undefined;
//             let endTime: string | undefined = undefined;
//             let day: string | undefined = undefined;

//             if (timeSplit.length >= 2) {
//               const timeRange = timeSplit[1].split("-");
//               if (timeRange.length >= 2) {
//                 startTime = timeRange[0];
//                 endTime = timeRange[1];
//               }

//               day = DAY_ENUMS.find((day) => day === timeSplit[0]);
//             }

//             return {
//               clubId: initialData.id,
//               locationName: location,
//               startTime: startTime,
//               endTime: endTime,
//               day: day,
//             } as ClubMeeting;
//           });

//     const updateClubMeetingsData = {
//       clubMeetings: clubMeetingDataList,
//     };
//     await fetch(
//       `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club/${initialData.id}/clubmeetings`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updateClubMeetingsData),
//       }
//     )
//       .then((response) => {
//         if (response.ok) {
//           // Request was successful, you can handle the response here if needed
//           console.log("PUT request successful");
//           return response.json();
//         } else {
//           throw new Error("Error updating club meetings");
//         }
//       })
//       .then((data) => {
//         console.log("Response data:", data);
//       })
//       .catch((error) => {
//         // Request failed, handle the error here
//         console.error("Error updating club meetings:", error);
//       });
//   }
//   return (
//     <>
//       <div className="p-4 bg-gray-100">
//         <div className="flex flex-col gap-4">
//           <div className="flex gap-4">
//             <div className=" w-[33%]">
//               <TextInput
//                 label="Name"
//                 size="xs"
//                 value={name}
//                 onChange={(e) => setName(e.currentTarget.value)}
//               />
//             </div>
//             <div className="w-[33%]">
//               <TextInput
//                 label="Website"
//                 size="xs"
//                 value={website}
//                 onChange={(e) => setWebsite(e.currentTarget.value)}
//               />
//             </div>
//             <div className="w-[33%]">
//               <TextInput
//                 label="Password"
//                 size="xs"
//                 value={password}
//                 onChange={(e) => setPassword(e.currentTarget.value)}
//               />
//             </div>
//           </div>
//           <div>
//             <Textarea
//               label="Description"
//               autosize
//               size="xs"
//               value={description}
//               onChange={(e) => setDescription(e.currentTarget.value)}
//             />
//           </div>
//           <div className="flex gap-4">
//             <div className="w-[50%]">
//               <MultiSelect
//                 label="Labels"
//                 data={CLUB_LABELS}
//                 value={group}
//                 placeholder="select labels"
//                 onChange={setLabels}
//                 icon={<IconSearch size={16} />}
//                 searchable
//                 clearable
//                 dropdownPosition="bottom"
//               />
//             </div>
//             <div className="w-[50%]">
//               <MultiSelect
//                 label="Specialty Labels"
//                 data={SPECIALTY_LABELS}
//                 value={categories}
//                 placeholder="select specialty labels"
//                 onChange={setCategories}
//                 icon={<IconSearch size={16} />}
//                 searchable
//                 clearable
//                 dropdownPosition="bottom"
//               />
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-[35%]">
//               <TextInput
//                 label="Location"
//                 size="xs"
//                 value={location}
//                 onChange={(e) => setLocation(e.currentTarget.value)}
//               />
//             </div>
//             <div className="w-[65%]">
//               <TextInput
//                 label="Meeting Times"
//                 size="xs"
//                 value={meetingTimes}
//                 onChange={(e) => setMeetingTimes(e.currentTarget.value)}
//               />
//             </div>
//           </div>
//           <div className="flex gap-4">
//             <div className=" w-[25%]">
//               <TextInput
//                 label="Instagram"
//                 size="xs"
//                 value={instagram}
//                 onChange={(e) => setInstagram(e.currentTarget.value)}
//               />
//             </div>
//             <div className="w-[25%]">
//               <TextInput
//                 label="Facebook"
//                 size="xs"
//                 value={facebook}
//                 onChange={(e) => setFacebook(e.currentTarget.value)}
//               />
//             </div>
//             <div className="w-[25%]">
//               <TextInput
//                 label="Discord"
//                 size="xs"
//                 value={discord}
//                 onChange={(e) => setDiscord(e.currentTarget.value)}
//               />
//             </div>
//             <div className="w-[25%]">
//               <TextInput
//                 label="Campus Group Link"
//                 size="xs"
//                 value={campusGroupLink}
//                 onChange={(e) => setCampusGroupLink(e.currentTarget.value)}
//               />
//             </div>
//           </div>
//           <div className="flex gap-4">
//             <div className="w-[50%]">
//               <TextInput
//                 label="Image URL"
//                 size="xs"
//                 value={imageUrl}
//                 onChange={(e) => setImageUrl(e.currentTarget.value)}
//               />
//             </div>
//           </div>
//           <div className="flex justify-center gap-4 mt-4">
//             <button onClick={onCancel}>
//               <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md">
//                 <IconArrowBackUp size={18} />
//                 <span className="font-semibold ">Cancel</span>
//               </div>
//             </button>
//             <button
//               onClick={() => {
//                 updateClubMeetings();
//                 updateClub();
//               }}>
//               <div className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 rounded-md">
//                 <IconCheck size={18} />
//                 <span className="font-semibold">Save</span>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
