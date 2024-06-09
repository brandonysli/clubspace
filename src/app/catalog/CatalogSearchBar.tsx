"use client";
import { useState, useEffect } from "react";
import { useRouter, ReadonlyURLSearchParams } from "next/navigation";
import { IconX, IconSearch } from "@tabler/icons-react";

type CatalogSearchBarProps = {
  initialSearch: string;
  setSearchInput: (value: string) => void;
  searching: boolean;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
};

export default function CatalogSearchBar(props: CatalogSearchBarProps) {
  const router = useRouter();

  //states
  const [localSearchInput, setLocalSearchInput] = useState<string>(
    props.initialSearch
  );

  const { setSearchInput, pathname, searchParams } = props;

  //search hook
  useEffect(() => {
    let newsearchParams = new URLSearchParams(searchParams.toString());
    const handler = setTimeout(() => {
      setSearchInput(localSearchInput);
      if (localSearchInput && localSearchInput.length > 0) {
        newsearchParams.set("search", localSearchInput);
      } else {
        newsearchParams.delete("search");
      }
      router.replace(`${pathname}?${newsearchParams.toString()}`, {
        shallow: true,
      });
    }, 1000); // debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchInput, setSearchInput, router, pathname, searchParams]);

  return (
    <div className="flex flex-row items-center justify-center px-2 py-1 xl:bg-zinc-100 bg-zinc-200 h-[35px] rounded-xl w-full">
      <div className="flex flex-row items-center justify-center mx-1 my-2">
        <IconSearch className="mx-2" width={16} height={16} />
      </div>

      <input
        type="text"
        placeholder="Search for clubs"
        className="z-20 w-full px-1 py-1 text-sm font-semibold outline-none text-zinc-800 placeholder:font-semibold xl:bg-zinc-100 bg-zinc-200 placeholder:text-sm"
        value={localSearchInput}
        onChange={(e) => {
          setLocalSearchInput(e.target.value);
        }}
      />
      {props.searching && (
        <svg
          className="flex-shrink-0 w-4 h-4 mr-2 animate-spin"
          viewBox="0 0 16 16">
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
      <button
        onClick={() => {
          setLocalSearchInput("");
        }}>
        <IconX
          className="p-1 pr-0 mr-2 cursor-pointer sm:w-auto text-zinc-500 hover:text-zinc-700 shrink-0"
          stroke={3}
        />
      </button>
    </div>
  );
}
