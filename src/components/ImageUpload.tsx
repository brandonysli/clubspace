"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconCameraFilled, IconPencil } from "@tabler/icons-react";
import Image from "next/image";
//takes in size in bytes for limitation
type ImageUploadPropTypes = {
  imageUrl: string | null;
  setImageUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUpload(props: ImageUploadPropTypes) {
  //creates ref object that holds a reference to an <input> element
  const fileInputRef = useRef<HTMLInputElement>(null);

  //function is called when anywhere within the div or the image is clicked
  const handleSelectImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //returns early and stops event from triggering more than once per click if event does not start from div element
    if (e.target !== e.currentTarget) {
      e.stopPropagation();
      return;
    }
    if (fileInputRef.current) {
      //triggers click event on input element => will open file selection dialog
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="relative cursor-pointer">
        <div
          className={`w-[100px] h-[100px] border rounded-2xl flex justify-center items-center ${
            props.imageUrl && props.imageUrl != "" ? "" : "bg-[#D0DDFF]"
          }`}
          onClick={handleSelectImageClick}
        >
          {props.imageUrl ? (
            <Image
              src={props.imageUrl}
              alt="Selected image"
              onClick={handleSelectImageClick}
              className="w-full h-full object-cover cursor-pointer border rounded-2xl"
              width={100}
              height={100}
            />
          ) : (
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <IconCameraFilled className="w-[60px] h-[50px] text-[#628EFF]" />
            </label>
          )}
          <input
            type="file"
            id="file-input"
            className=" hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={props.setImageUrl}
          />
          <div className="absolute -bottom-2 -right-2 lg:hidden">
            <div className="rounded-full bg-white w-[37px] h-[37px] flex justify-center items-center">
              <div className="bg-[#D0DDFF] rounded-full w-[30px] h-[30px] flex justify-center items-center">
                <IconPencil
                  className="w-[20px] h-[20px] text-[#628EFF] ml-[0.5px]"
                  style={{ strokeWidth: "2.5px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
