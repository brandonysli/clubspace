// "use client";
// import React, { useState, useEffect } from "react";
// import { MultiSelect, TextInput } from "@mantine/core";
// import { useDebouncedValue } from "@mantine/hooks";
// import { IconSearch } from "@tabler/icons-react";
// import sortBy from "lodash/sortBy";
// import { DataTable, DataTableSortStatus } from "mantine-datatable";
// import { Club, ClubMeeting } from "@/types/club.d";

// import { Label, SpecialtyLabel } from "@/types/enums.d";
// import ClubEditor from "./ClubEditor";
// import { useSession } from "next-auth/react";

// //page size constant
// const PAGE_SIZE = 100;

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

// export default function Page() {
//   const { data: session, status } = useSession();

//   //state for page number
//   const [page, setPage] = useState(1);
//   //state for club data
//   const [clubs, setClubs] = useState<Club[]>([]);
//   //state for number of clubs (might need to edit api function instead)
//   const [clubNum, setClubNum] = useState(1755);
//   //state for query when typing to search for club by name
//   const [nameQuery, setNameQuery] = useState("");
//   //contains debounced value of name query at rate of 200ms
//   const [debouncedNameQuery] = useDebouncedValue(nameQuery, 200);
//   const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
//   const [selectedSpecialtyLabels, setSelectedSpecialtyLabels] = useState<
//     string[]
//   >([]);

//   //Sets club record to a PAGE_SIZE long list of clubs based on page number. Applies filtering as well.
//   useEffect(() => {
//     //fetches from endpoint for getting clubs, uses skip and take parameters based on page information
//     fetch(
//       `${process.env.NEXT_PUBLIC_ROOT_URL}/api/club?skip=${
//         (page - 1) * PAGE_SIZE
//       }&take=${PAGE_SIZE}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         //apply filtering based on query for name and selected labels
//         const filteredClubs = data.filter((club: Club) => {
//           //checks if club has matching labels with the selected labels list

//           const hasMatchingLabel = selectedLabels.every((label) =>
//             club.labels.some((clubLabel: string | Label) => clubLabel == label)
//           );
//           const hasMatchingSpecialtyLabel = selectedSpecialtyLabels.every(
//             (specialtyLabel) =>
//               club.specialtyLabels.some(
//                 (clubSpecialtyLabel: string | SpecialtyLabel) =>
//                   clubSpecialtyLabel.toString().replace("_", " ") ==
//                   specialtyLabel
//               )
//           );

//           //checks if club has matching strings in name to the text search query.
//           const hasMatchingNameQuery = club.name
//             .toLowerCase()
//             .includes(debouncedNameQuery.trim().toLowerCase());

//           return (
//             hasMatchingNameQuery &&
//             hasMatchingLabel &&
//             hasMatchingSpecialtyLabel
//           );
//         });
//         setClubs(filteredClubs);
//       });
//   }, [page, debouncedNameQuery, selectedLabels, selectedSpecialtyLabels]);
//   //state for sort status of table
//   const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
//     columnAccessor: "name",
//     direction: "asc",
//   });
//   //useEffect for sorting data in table
//   useEffect(() => {
//     const data = sortBy(clubs, sortStatus.columnAccessor) as Club[];
//     setClubs(sortStatus.direction === "desc" ? data.reverse() : data);
//   }, [sortStatus, clubs]);

//   return (
//     <>
//       {session?.user.role === "admin" ? (
//         <div className="flex flex-col items-center justify-center h-full">
//           <DataTable
//             height={700}
//             withBorder
//             borderRadius="md"
//             shadow="lg"
//             withColumnBorders
//             highlightOnHover
//             columns={[
//               {
//                 accessor: "name",
//                 title: "Name",
//                 width: 95,
//                 sortable: true,
//                 filter: (
//                   <TextInput
//                     label="Clubs"
//                     description="Show clubs whose names include the specified text"
//                     placeholder="Search clubs..."
//                     icon={<IconSearch size={16} />}
//                     value={nameQuery}
//                     onChange={(e) => setNameQuery(e.currentTarget.value)}
//                   />
//                 ),
//                 filtering: nameQuery !== "",
//               },
//               {
//                 accessor: "description",
//                 title: "Description",
//                 ellipsis: true,
//                 width: 100,
//               },
//               {
//                 accessor: "labels",
//                 title: "Labels",
//                 render: (record: Club) => {
//                   return (
//                     <>
//                       <div className="flex flex-wrap gap-1">
//                         {record.labels.map(
//                           (clubLabel: string | Label, index: number) => {
//                             return (
//                               <div
//                                 key={index}
//                                 className="flex items-center justify-center flex-shrink px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md"
//                               >
//                                 <span>{clubLabel.toString()}</span>
//                               </div>
//                             );
//                           }
//                         )}
//                       </div>
//                     </>
//                   );
//                 },
//                 ellipsis: false,
//                 width: 90,
//                 filter: (
//                   <MultiSelect
//                     label="Labels"
//                     description="Show all clubs with the selected labels"
//                     data={CLUB_LABELS}
//                     value={selectedLabels}
//                     placeholder="Select labels"
//                     onChange={setSelectedLabels}
//                     icon={<IconSearch size={16} />}
//                     clearable
//                     searchable
//                   />
//                 ),
//                 filtering: selectedLabels.length > 0,
//               },
//               {
//                 accessor: "specialtyLabels",
//                 title: "Specialty Labels",
//                 render: (record: Club) => {
//                   return (
//                     <>
//                       <div className="flex flex-wrap gap-1">
//                         {record.specialtyLabels.map(
//                           (
//                             specialtyLabel: string | SpecialtyLabel,
//                             index: number
//                           ) => {
//                             return (
//                               <div
//                                 key={index}
//                                 className="flex items-center justify-center flex-shrink px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md"
//                               >
//                                 <span>
//                                   {specialtyLabel.toString().replace("_", " ")}
//                                 </span>
//                               </div>
//                             );
//                           }
//                         )}
//                       </div>
//                     </>
//                   );
//                 },
//                 ellipsis: false,
//                 width: 70,
//                 filter: (
//                   <MultiSelect
//                     label="Specialty Labels"
//                     description="Show all clubs with the selected specialty labels"
//                     data={SPECIALTY_LABELS}
//                     value={selectedSpecialtyLabels}
//                     placeholder="Select specialty labels"
//                     onChange={setSelectedSpecialtyLabels}
//                     icon={<IconSearch size={16} />}
//                     clearable
//                     searchable
//                   />
//                 ),
//                 filtering: selectedSpecialtyLabels.length > 0,
//               },
//               {
//                 accessor: "clubMeetings.0.locationName",
//                 title: "Location",
//                 width: 40,
//               },

//               {
//                 accessor: "id",
//                 title: "Id",
//                 width: 10,
//                 sortable: true,
//                 textAlignment: "left",
//               },
//             ]}
//             records={clubs}
//             totalRecords={clubNum}
//             recordsPerPage={PAGE_SIZE}
//             page={page}
//             onPageChange={(p) => setPage(p)}
//             sortStatus={sortStatus}
//             onSortStatusChange={setSortStatus}
//             rowExpansion={{
//               content: ({ record, collapse }) => (
//                 <ClubEditor
//                   initialData={record}
//                   onDone={(data) => {
//                     setClubs((prevClubs) =>
//                       prevClubs.map((club) =>
//                         club.id === data.id ? data : club
//                       )
//                     );
//                     collapse();
//                   }}
//                   onCancel={collapse}
//                 />
//               ),
//             }}
//             className="w-[95%]"
//           />
//         </div>
//       ) : (
//         <div className="flex w-full h-full">
//           {" "}
//           user is not verified to view admin table
//         </div>
//       )}
//     </>
//   );
// }

export default function Page() {
  return <div></div>;
}
