"use client";
import React, { useState, useRef } from "react";
import { IconCloudUpload, IconExclamationMark } from "@tabler/icons-react";
import { set } from "lodash";
import { Club } from "@/types/club";

//reminder to add error handling for invalid size or file type

type ImageDropzonePropTypes = {
  handleImageUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  club: Club | null;
  setClub: React.Dispatch<React.SetStateAction<Club | null>>;
  size: number;
  imageError: boolean;
  setImageError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ImageDropzone(props: ImageDropzonePropTypes) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const handleSelectImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //returns early and stops event from triggering more than once per click if event does not start from div element
    if (e.target !== e.currentTarget) {
      e.stopPropagation();
      return;
    }
    if (!isDragActive && fileInputRef.current) {
      //triggers click event on input element => will open file selection dialog
      fileInputRef.current.click();
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageFile = e.dataTransfer.files[0];
    if (imageFile) {
      if (imageFile.size > props.size) {
        props.setImageError(true);
        setTimeout(() => {
          props.setImageError(false);
        }, 4000);
        return;
      }
      //if file is found, create a FileReader Object
      const reader = new FileReader();
      //read contents of file as data url
      reader.readAsDataURL(imageFile);
      //when file loads, sets imageURL state to data url that was read previously
      reader.onload = () => {
        props.setClub(
          props.club ? { ...props.club, img: reader.result as string } : null
        );
      };
    }
    setIsDragActive(false);
  };
  const handleDragLeave = () => {
    setIsDragActive(false);
  };
  return (
    <>
      <div
        className={`flex flex-col gap-4 items-center justify-center px-3 py-4 border-2 rounded-lg w-full h-full cursor-pointer hover:border-[#9D9D9D] ${
          props.imageError ? "border-[#FF6B6B] hover:border-[#FF6B6B]" : ""
        }`}
        onClick={handleSelectImageClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          className="hidden "
          ref={fileInputRef}
          accept="image/*"
          onChange={props.handleImageUrl}
        />
        <div
          className={`rounded-full bg-[#D9D9D9] p-0.5 w-[12%] aspect-square flex items-center justify-center ${
            props.imageError ? "bg-[#FF6B6B] text-white" : ""
          }`}
        >
          {props.imageError ? (
            <IconExclamationMark stroke={3} />
          ) : (
            <IconCloudUpload />
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-1">
          {props.imageError ? (
            <span className="text-sm/[20px] font-bold">
              Image exceeds max size
            </span>
          ) : (
            <div className="flex gap-1">
              <span className="text-sm font-medium text-black underline underline-offset-2">
                Click to upload
              </span>
              <span className="text-sm/[20px] font-medium text-[#9F9F9F]">
                or drag and drop
              </span>
            </div>
          )}
          <span className="text-sm/[20px] font-medium text-[#9F9F9F]">
            JPG, PNG, SVG, Webp (max 5 mb)
          </span>
        </div>
      </div>
    </>
  );
}
