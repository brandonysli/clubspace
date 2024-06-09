import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";

export default function Logo() {
  return (
    <a
      href="/"
      className="flex flex-row items-center justify-center gap-1 px-2 cursor-pointer hover:bg-gray-100 rounded-xl">
      <Image
        alt="clubspace logo"
        src={LogoImage}
        height={54}
        width={54}
        className="flex-shrink-0 aspect-square"
      />

      <span className="hidden text-3xl font-bold sm:flex">clubspace</span>
    </a>
  );
}
