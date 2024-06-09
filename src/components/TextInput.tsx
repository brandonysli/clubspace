"use client";
import React, { useState, useEffect } from "react";

type TextInputPropTypes = {
  text: string;
  setText: (newText: string) => void;
  placeholder?: string;
};

function isEmailValid(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function hasInvalidCharacters(name: string): boolean {
  const invalidCharactersRegex = /[^a-zA-Z0-9\s]/; // Matches any non-alphanumeric characters excluding spaces
  return invalidCharactersRegex.test(name);
}

export default function TextInput(props: TextInputPropTypes) {
  const { text, setText, placeholder } = props;
  const [localTextInput, setLocalTextInput] = useState<string>(text);

  useEffect(() => {
    setLocalTextInput(text);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalTextInput(newValue);
    setText(newValue);
  };
  return (
    <>
      <div className="relative">
        <div
          className={`flex items-center border-2 border-[#D9D9D9] rounded-lg gap-2 focus-within:border-[#9D9D9D] ${
            (!isEmailValid(localTextInput) &&
              placeholder == "Email" &&
              localTextInput != "") ||
            (placeholder == "Name" &&
              hasInvalidCharacters(localTextInput) &&
              localTextInput != "") ||
            ((placeholder == "Name" || placeholder == "Email") &&
              localTextInput == "")
              ? "border-[#FF6B6B] focus-within:border-[#FF6B6B]"
              : ""
          }`}>
          <div className="w-full px-4 py-2">
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
        {placeholder == "Email" &&
        !isEmailValid(localTextInput) &&
        localTextInput != "" ? (
          <span className="absolute top-11 text-[#FF6B6B] text-xs/[20px] font-medium">
            Invalid email
          </span>
        ) : (
          false
        )}
        {placeholder == "Name" &&
        hasInvalidCharacters(localTextInput) &&
        localTextInput != "" ? (
          <span className="absolute top-11 text-[#FF6B6B] text-xs/[20px] font-medium">
            Invalid characters
          </span>
        ) : (
          false
        )}
        {(placeholder == "Name" || placeholder == "Email") &&
        localTextInput == "" ? (
          <span className="absolute top-11 text-[#FF6B6B] text-xs/[20px] font-medium">
            Required field
          </span>
        ) : (
          false
        )}
      </div>
    </>
  );
}
