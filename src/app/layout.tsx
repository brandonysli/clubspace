import "./globals.css";
import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RootStyleRegistry from "./emotion";

export const metadata = {
  title: "clubspace",
  description: "clubs @ cornell",
};

import { NextAuthProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      ></meta>
      <body className="flex flex-col h-screen">
        <RootStyleRegistry>
          <NextAuthProvider>
            <div className="relative flex flex-col justify-between w-full h-full overflow-x-hidden">
              <Navbar />

              <div className="h-screen overflow-x-hidden overflow-y-auto mt-[88px]">
                {children}
              </div>
            </div>
          </NextAuthProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
