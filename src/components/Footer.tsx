import Image from "next/image";
import WebdevImage from "@/assets/images/webdev.png";

import { IconBrandLinkedin, IconBrandInstagram } from "@tabler/icons-react";

export default function Footer() {
  return (
    <>
                           
      <div className="flex flex-col items-start justify-start w-full gap-3 px-12 mx-12 sm:my-6 sm:mx-0 sm:items-center sm:justify-center sm:flex-row">
        <div className="flex flex-row items-center justify-start gap-3 ">
          <a
            className="flex p-2 bg-blue-100 rounded-md hover:bg-blue-200"
            href="https://www.linkedin.com/company/cornellclubspace/about/"
            target="_blank">
            <IconBrandLinkedin className="text-blue-600" stroke={2.5} />
          </a>
          <a
            className="flex p-2 bg-pink-100 rounded-md hover:bg-pink-200"
            href="https://instagram.com/cornellclubspace?igshid=MmIzYWVlNDQ5Yg=="
            target="_blank">
            <IconBrandInstagram className="text-pink-600" stroke={2.5} />
          </a>
          <a
            className="flex items-center justify-center flex-shrink-0 p-2 text-red-500 bg-red-100 rounded-md hover:bg-red-200"
            href="https://www.instagram.com/cornell_webdev/"
            target="_blank">
            <Image
              src={WebdevImage}
              alt="webdev logo"
              width={24}
              height={24}
              className="pt-1 aspect-square "></Image>
          </a>
        </div>
        <div className="flex flex-row items-center justify-start w-full h-full ml-0 sm:ml-8">
          <span className="text-zinc-700 text-lg font-bold w-[200px]">
            clubspace <span>&#169;</span> 2023
          </span>
        </div>
             
      </div>
    </>
  );
}
