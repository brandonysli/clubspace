"use client";

import { useState, useEffect } from "react";
import { Group, Category, Attributes } from "@/types/enums.d";

//Icon images from Tabler Icons
import {
  IconArrowUp,
  IconArrowDown,
  IconAdjustmentsHorizontal,
  IconX,
  IconChevronUp,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";

const MAX_CATEGORY_LABELS = 5;
const MAX_SPECIAL_LABELS = 3;
const MAX_GROUP_LABELS = 1;

import { useRouter } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";

type FilterComponentProps = {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  showFilter?: boolean;
  setShowFilter?: (showFilter: boolean) => void;
  userId?: string;
};

type SortTypes =
  | "alphabetical_asc"
  | "alphabetical_desc"
  | "latest_asc"
  | "latest_desc";

export default function FilterComponent(props: FilterComponentProps) {
  const router = useRouter();

  // states
  const [GroupOpen, setGroupOpen] = useState(false);
  const [CategoriesOpen, setCategoriesOpen] = useState(false);
  const [AttributesOpen, setAttributesOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [favoritesOpen, setFavoriteOpen] = useState(false);
  const [selectedgroup, setSelectedGroup] = useState<string>(
    props.searchParams.get("group") ?? ""
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    props.searchParams.get("categories")?.split(",") ?? []
  );
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(
    props.searchParams.get("attributes")?.split(",") ?? []
  );

  //vars
  const group = Object.values(Group).filter(
    (value) => typeof value === "string"
  );
  const categories = Object.values(Category).filter(
    (value) => typeof value === "string"
  );
  const attributes = Object.values(Attributes).filter(
    (value) => typeof value === "string"
  );
  const totalCategoriess = group.length + categories.length;
  const [selectedSort, setSelectedSort] = useState<SortTypes | null>(
    (props.searchParams.get("sort") as SortTypes) ?? null
  );
  const [selectedLiked, setSelectedLiked] = useState(false);

  //handlers
  const handleFavoriteButtonClick = () => {
    setSelectedLiked((prevLiked) => {
      let newLikedStatus = !prevLiked;
      let newSearchParams = new URLSearchParams();

      if (newLikedStatus) {
        newSearchParams.set("followed", "true");
      } else {
        newSearchParams.delete("followed");
      }

      // Clear labels when the favorite button is clicked
      setSelectedGroup("");
      setSelectedCategories([]);

      router.push(`${props.pathname}?${newSearchParams.toString()}`);
      return newLikedStatus;
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((l) => l !== category);
      } else if (prev.length < MAX_SPECIAL_LABELS) {
        return [...prev, category];
      } else {
        return prev;
      }
    });
    setSelectedLiked(false);
  };

  const handleGroupClick = (group: string) => {
    setSelectedGroup((prevGroup) => {
      if (prevGroup === group) {
        return "";
      } else {
        return group;
      }
    });
  };

  const handleAttributeClick = (attribute: string) => {
    setSelectedAttributes((prev) => {
      if (prev.includes(attribute)) {
        return prev.filter((a) => a !== attribute);
      } else {
        return [...prev, attribute];
      }
    });
  };

  // Whenever the sort by is selected
  const handleSortClick = (sortType: "alphabetical" | "latest" | "none") => {
    if (sortType === "none") {
      setSelectedSort(null);
    } else {
      setSelectedSort((prevSort) => {
        if (prevSort === null) {
          return `${sortType}_asc` as const;
        } else if (prevSort === `${sortType}_asc`) {
          return `${sortType}_desc` as const;
        } else if (prevSort === `${sortType}_desc`) {
          return null;
        } else {
          return `${sortType}_asc` as const;
        }
      });
    }
  };

  // const handleFavoriteButtonClick = () => {
  //   setSelectedLiked((prevLiked) => {
  //     let newLikedStatus = !prevLiked;
  //     let newSearchParams = new URLSearchParams(props.searchParams.toString());
  //     if (newLikedStatus) {
  //       newSearchParams.set("followed", "true");
  //     } else {
  //       newSearchParams.delete("followed");
  //     }
  //     router.push(`${props.pathname}?${newSearchParams.toString()}`);
  //     return newLikedStatus;
  //   });
  // };

  // const cleargroup = () => {
  //   setSelectedGroup([]);
  // };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const clearGroup = () => {
    setSelectedGroup("");
  };

  const clearAttributes = () => {
    setSelectedAttributes([]);
  };

  const clearFavorite = () => {
    setSelectedLiked(false);
  };

  const clearAllFilterLabels = () => {
    clearCategories();
    clearGroup();
    clearAttributes();
    clearFavorite();
    handleSortClick("none");
  };

  //useEffect to set new params
  useEffect(() => {
    let newsearchParams = new URLSearchParams(props.searchParams.toString());

    if (selectedCategories && selectedCategories.length > 0) {
      newsearchParams.set(
        "categories",
        selectedCategories
          .map((category) => encodeURIComponent(category))
          .join(",")
      );
    } else {
      newsearchParams.delete("categories");
    }

    if (selectedgroup) {
      console.log(selectedgroup);
      newsearchParams.set("group", encodeURIComponent(selectedgroup));
    } else {
      newsearchParams.delete("group");
    }

    if (selectedAttributes && selectedAttributes.length > 0) {
      newsearchParams.set(
        "attributes",
        selectedAttributes
          .map((attribute) => encodeURIComponent(attribute))
          .join(",")
      );
    } else {
      newsearchParams.delete("attributes");
    }

    if (selectedSort) {
      newsearchParams.set("sort", selectedSort);
    } else {
      newsearchParams.delete("sort");
    }

    if (selectedLiked) {
      newsearchParams.set("followed", "true");
    } else {
      newsearchParams.delete("followed");
      // TODO: Here
      // if (selectedgroup && selectedgroup.length > 0) {
      //   newsearchParams.set("labels", selectedgroup.join(","));
      // }
      if (selectedCategories && selectedCategories.length > 0) {
        newsearchParams.set("categories", selectedCategories.join(","));
      }
    }
    router.replace(`${props.pathname}?${newsearchParams.toString()}`);
  }, [
    selectedgroup,
    selectedCategories,
    selectedAttributes,
    selectedSort,
    selectedLiked,
    props.pathname,
    router,
    props.searchParams,
  ]);

  // following hook
  useEffect(() => {
    const isFollowedSet = props.searchParams.get("followed");
    setSelectedLiked(isFollowedSet === "true");
  }, [props.searchParams]);

  return (
    <div className="flex flex-row justify-center w-full items-strech min-h-[250px] lg:max-h-[calc(100vh-260px)] px-4 mb-8 overflow-y-auto scrollBackgroundTransparent">
      <div className="flex flex-col">
        {/* Filter Section */}
        <section>
          {/* First Row of the Filter Section with icon/Filters/ClearButton */}
          <section className="w-full pb-3">
            <div className="flex flex-row items-center justify-between w-full">
              {props.showFilter && (
                <div className="flex flex-row justify-start xl:hidden text-zinc-400 hover:text-zinc-700">
                  <button
                    onClick={() => {
                      if (props.setShowFilter) {
                        props.setShowFilter(!props.showFilter);
                      }
                    }}>
                    <IconX stroke={2.5} />
                  </button>
                </div>
              )}
              <div className="flex flex-row items-center justify-center gap">
                <IconAdjustmentsHorizontal
                  style={{ height: "18px" }}></IconAdjustmentsHorizontal>

                <span className="ml-1 font-semibold">Filters</span>
              </div>
              <button
                className="px-2 py-1 text-sm font-semibold rounded-lg"
                style={{
                  backgroundColor: "#F8F8F8",
                  color: "#FF4F4F",
                }}
                onClick={clearAllFilterLabels}>
                Clear all
              </button>
            </div>
          </section>

          {/* 1st Gray line */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#E4E4E4",
            }}
            className="w-full"></div>

          {/* Sort By Section  */}
          <section className="pb-3 mt-5 w-[280px]">
            <div className="flex flex-row items-center">
              <span className="ml-[28px] font-semibold">Sort By </span>
              <div className="flex items-center ml-auto">
                <button
                  className="mr-3 text-xs"
                  style={{ color: "#9D9D9D" }}
                  onClick={() => handleSortClick("none")}>
                  Clear
                </button>
                <button onClick={() => setSortByOpen(!sortByOpen)}>
                  {sortByOpen ? <IconChevronUp /> : <IconChevronDown />}
                </button>
              </div>
            </div>

            {/* Dropdown for the Sort By labels */}
            {sortByOpen && (
              <div className="mt-2 bg-white rounded-md max-h-[200px] overflow-auto scrollBackgroundTransparent px-4">
                {/* Alphabetical section */}
                <section className="mt-3">
                  <div
                    className={`flex justify-between items-center mt-1 px-4 py-2 h-8 cursor-pointer text-sm ${
                      selectedSort && selectedSort.includes("alphabetical")
                        ? "bg-gray-100"
                        : ""
                    } hover:bg-gray-100 rounded-md`}
                    onClick={() => handleSortClick("alphabetical")}>
                    <div className="flex flex-row items-center">
                      <span
                        className={`${selectedSort ? "text-gray-600" : ""}`}>
                        Alphabetical
                      </span>
                    </div>
                    {selectedSort == "alphabetical_asc" && (
                      <IconArrowUp style={{ width: "20px" }} />
                    )}
                    {selectedSort == "alphabetical_desc" && (
                      <IconArrowDown style={{ width: "20px" }} />
                    )}
                  </div>
                </section>

                {/* Latest Update section */}

                <div
                  className={`flex justify-between items-center mt-1 px-4 py-2 h-8 cursor-pointer text-sm ${
                    selectedSort && selectedSort.includes("latest")
                      ? "bg-gray-100"
                      : ""
                  } hover:bg-gray-100 rounded-md`}
                  onClick={() => handleSortClick("latest")}>
                  <div className="flex flex-row items-center">
                    <span className={`${selectedSort ? "text-gray-600" : ""}`}>
                      Latest Update
                    </span>
                  </div>
                  {selectedSort == "latest_asc" && (
                    <IconArrowUp style={{ width: "20px" }} />
                  )}
                  {selectedSort == "latest_desc" && (
                    <IconArrowDown style={{ width: "20px" }} />
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 3rd Gray line */}
          <div
            className="ml-auto"
            style={{
              height: "1px",
              backgroundColor: "#E4E4E4",
            }}></div>

          {/* Group Section*/}
          <section className="pb-3 mt-5 w-[280px]">
            <div className="flex flex-row items-center">
              <span className="ml-[28px] font-semibold">Group</span>

              <div className="ml-2 text-xs" style={{ color: "#9D9D9D" }}>
                {selectedgroup ? 1 : 0}/{MAX_GROUP_LABELS}
              </div>

              <div className="flex items-center ml-auto">
                <button
                  className="mr-3 text-xs"
                  style={{ color: "#9D9D9D" }}
                  onClick={clearGroup}>
                  Clear
                </button>
                <button onClick={() => setGroupOpen(!GroupOpen)}>
                  {GroupOpen ? <IconChevronUp /> : <IconChevronDown />}
                </button>
              </div>
            </div>

            {GroupOpen && (
              <div className="mt-4 bg-white rounded-md max-h-[150px] overflow-auto scrollBackgroundTransparent px-4">
                {group
                  .sort((a: string | Group, b: string | Group) =>
                    a.toString().localeCompare(b.toString())
                  )
                  .map((group: string | Group) => (
                    <div
                      className={`relative flex justify-between items-center mt-1 px-4 py-2 h-8 cursor-pointer text-sm ${
                        selectedgroup === group.toString() ? "bg-gray-100" : ""
                      } hover:bg-gray-100 rounded-md`}
                      key={group}
                      onClick={() => handleGroupClick(group.toString())}>
                      {group.toString().replace("_", " ")}
                      {selectedgroup.includes(group.toString()) && (
                        <IconCheck style={{ width: "20px" }} />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* 3rd Gray line */}
          <div
            className="ml-auto"
            style={{
              height: "1px",
              backgroundColor: "#E4E4E4",
            }}></div>

          {/* 4th Row of the Filter Section with Categories/MAX_LABELS/ClearButton/dropdown*/}
          <section className="pb-3 mt-5 w-[280px]">
            <div className="flex flex-row items-center">
              <span className="ml-[28px] font-semibold">Categories</span>

              <div className="ml-2 text-xs" style={{ color: "#9D9D9D" }}>
                {selectedCategories.length}/{MAX_SPECIAL_LABELS}
              </div>

              <div className="flex items-center ml-auto">
                <button
                  className="mr-3 text-xs"
                  style={{ color: "#9D9D9D" }}
                  onClick={clearCategories}>
                  Clear
                </button>
                <button onClick={() => setCategoriesOpen(!CategoriesOpen)}>
                  {CategoriesOpen ? <IconChevronUp /> : <IconChevronDown />}
                </button>
              </div>
            </div>

            {/* Dropdown for the categories */}
            {CategoriesOpen && (
              <div className="mt-4 bg-white rounded-md max-h-[150px] overflow-auto scrollBackgroundTransparent px-4">
                {categories
                  .sort((a: string | Category, b: string | Category) =>
                    a.toString().localeCompare(b.toString())
                  )
                  .map((category: string | Category) => (
                    <div
                      className={`relative flex justify-between items-center mt-1 px-4 py-2 h-8 cursor-pointer text-sm ${
                        selectedCategories.includes(category.toString())
                          ? "bg-gray-100"
                          : ""
                      } hover:bg-gray-100 rounded-md`}
                      key={category}
                      onClick={() => handleCategoryClick(category.toString())}>
                      {category.toString().replace("_", " ")}
                      {selectedCategories.includes(category.toString()) && (
                        <IconCheck style={{ width: "20px" }} />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>

          {/* Attribute Section */}
          <div
            className="ml-auto"
            style={{
              height: "1px",
              backgroundColor: "#E4E4E4",
            }}></div>

          {/* 4th Row of the Filter Section with Categories/MAX_LABELS/ClearButton/dropdown*/}
          <section className="pb-3 mt-5 w-[280px]">
            <div className="flex flex-row items-center">
              <span className="ml-[28px] font-semibold">Attributes</span>

              <div className="ml-2 text-xs" style={{ color: "#9D9D9D" }}>
                {selectedAttributes.length}/-
              </div>

              <div className="flex items-center ml-auto">
                <button
                  className="mr-3 text-xs"
                  style={{ color: "#9D9D9D" }}
                  onClick={clearAttributes}>
                  Clear
                </button>
                <button onClick={() => setAttributesOpen(!AttributesOpen)}>
                  {AttributesOpen ? <IconChevronUp /> : <IconChevronDown />}
                </button>
              </div>
            </div>

            {/* Dropdown for the categories */}
            {AttributesOpen && (
              <div className="mt-4 bg-white rounded-md max-h-[150px] overflow-auto scrollBackgroundTransparent px-4">
                {attributes
                  .sort((a: string | Attributes, b: string | Attributes) =>
                    a.toString().localeCompare(b.toString())
                  )
                  .map((attribute: string | Attributes) => (
                    <div
                      className={`relative flex justify-between items-center mt-1 px-4 py-2 h-8 cursor-pointer text-sm ${
                        selectedAttributes.includes(attribute.toString())
                          ? "bg-gray-100"
                          : ""
                      } hover:bg-gray-100 rounded-md`}
                      key={attribute}
                      onClick={() =>
                        handleAttributeClick(attribute.toString())
                      }>
                      {attribute.toString().replace("_", " ")}
                      {selectedAttributes.includes(attribute.toString()) && (
                        <IconCheck style={{ width: "20px" }} />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>

          {props.userId && (
            <>
              <div
                className="ml-auto"
                style={{
                  height: "1px",
                  backgroundColor: "#E4E4E4",
                }}></div>

              <section className="pb-3 mt-5 w-[280px]">
                <div className="flex flex-row items-center">
                  <span className="ml-[28px] font-semibold">Favorites</span>

                  <div className="flex items-center ml-auto">
                    <button
                      className="mr-3 text-xs"
                      style={{ color: "#9D9D9D" }}
                      onClick={clearFavorite}>
                      Clear
                    </button>
                    <button onClick={() => setFavoriteOpen(!favoritesOpen)}>
                      {favoritesOpen ? <IconChevronUp /> : <IconChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Dropdown for the favorite button */}
                {favoritesOpen && (
                  <div className="mt-4 bg-white rounded-md max-h-[150px] overflow-auto scrollBackgroundTransparent px-4">
                    <button
                      className={`flex justify-between items-center px-4 py-2 w-full h-8 cursor-pointer text-sm rounded-md ${
                        selectedLiked ? "bg-gray-100" : ""
                      } hover:bg-gray-100`}
                      onClick={handleFavoriteButtonClick}>
                      <span
                        className={`${selectedLiked ? "text-gray-600" : ""}`}>
                        Liked
                      </span>
                      {selectedLiked && <IconCheck style={{ width: "20px" }} />}
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
