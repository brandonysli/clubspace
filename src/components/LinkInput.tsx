"use client";
import React, { useState, useEffect } from "react";

type LinkInputPropTypes = {
  prefix: string;
  link: string;
  setLink: (link: string) => void;
  placeholder?: string;
};

//checks if input is a valid url
function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

export default function LinkInput(props: LinkInputPropTypes) {
  const { prefix, link, setLink, placeholder } = props;
  //state for local input that will be displayed
  const [localTextInput, setLocalTextInput] = useState<string>(link);

  useEffect(() => {
    setLocalTextInput(link);
  }, [link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalTextInput(newValue);
    setLink(newValue);
  };
  return (
    <>
      <div className="relative">
        <div
          className={`flex items-center border-2 border-[#D9D9D9] rounded-lg gap-2 focus-within:border-[#9D9D9D] ${
            !isValidUrl(localTextInput) && localTextInput != ""
              ? "border-[#FF6B6B] focus-within:border-[#FF6B6B]"
              : ""
          }`}>
          <div
            className={`px-4 py-2 border-r-2 border-[#D9D9D9] focus-within:border-[#9D9D9D] ${
              !isValidUrl(localTextInput) && localTextInput != ""
                ? "border-[#FF6B6B] focus-within:border-[#FF6B6B]"
                : ""
            }`}>
            <span
              className={`text-sm/[20px] font-medium text-[#ADADAD] ${
                !isValidUrl(localTextInput) && localTextInput != ""
                  ? "text-[#FF6B6B]"
                  : ""
              }`}>
              {prefix}
            </span>
          </div>
          <div className="w-full pr-4">
            <input
              type="text"
              value={localTextInput}
              // onChange={(e) => {
              //   setLocalTextInput(e.target.value);
              // }}
              onChange={handleChange}
              placeholder={placeholder}
              className="h-full w-full focus:outline-none placeholder:text-[#ADADAD] placeholder:text-sm/[20px] placeholder:font-medium text-sm/[20px] font-medium"
            />
          </div>
        </div>
        {!isValidUrl(localTextInput) && localTextInput != "" ? (
          <span className="absolute top-11 text-[#FF6B6B] text-xs/[20px] font-medium">
            Invalid URL
          </span>
        ) : (
          false
        )}
      </div>
    </>
  );
}
