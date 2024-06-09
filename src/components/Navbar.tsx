"use client";

import { IconSearch } from "@tabler/icons-react";
import Logo from "./Logo";

import "../styles/interestForm.css";
import InterestFormComponent from "./InterestForm";
import Login from "./LoginButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <>
      <div className="fixed top-0 left-0 z-30 flex flex-row items-center justify-between w-full p-4 ml-2 bg-white right-2 bg-opacity-90">
        <div className="flex flex-row items-center justify-start ">
          <Logo />
        </div>

        <div className="z-30 flex flex-row items-center justify-end gap-4 px-2">
          <Link
            href="/catalog"
            className="flex items-center justify-center w-12 h-12 p-2 border-2 hover:bg-zinc-100 rounded-xl border-zinc-400">
            <IconSearch stroke={3} />
          </Link>
          <div className="hidden sm:flex">
            <InterestFormComponent
              email={session?.user?.email ? session?.user.email : ""}
            />
          </div>

          <div className="flex items-center justify-center text-center rounded-full">
            <Login searchParams={searchParams} pathname={pathname} />
          </div>
        </div>
      </div>
    </>
  );
}
