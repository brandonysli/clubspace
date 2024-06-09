"use client";
import { useState } from "react";
import Image from "next/image";

type BlurImageProps = {
  image: string;
  width: number;
  height: number;
};

export default function BlurImage(props: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="w-full overflow-hidden bg-gray-200 rounded-lg">
      <Image
        alt=""
        src={props.image}
        loading="lazy"
        width={props.width}
        height={props.height}
        className={`
                duration-500 ease-in-out group-hover:opacity-75 rounded-lg aspect-square
                ${
                  isLoading
                    ? "scale-110 blur-2xl grayscale"
                    : "scale-100 blur-0 "
                })`}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}
