"use client";
import { IconHeartFilled } from "@tabler/icons-react";

type FollowButtonProps = {
  userId?: string;
  clubId: number;
  liked: boolean;
  setLiked: (liked: boolean) => void;
};

import { signIn } from "next-auth/react";

export default function FollowButton(props: FollowButtonProps) {
  const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (!props.userId) {
        signIn("google", { redirect: false });
      } else if (!props.liked) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/user/${props.userId}/follow`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clubId: props.clubId,
            }),
          }
        );
        const data = await response.json();
        if (data.status === "Success" && data.following === true) {
          props.setLiked(!props.liked);
        }
      } else if (props.liked) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}/api/user/${props.userId}/follow/${props.clubId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          props.setLiked(false);
        }
      } else {
        console.error("User not logged in");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleFollow}>
      <div
        className={`cursor-pointer flex flex-row justify-center items-center p-[8px] rounded-xl ${
          !props.liked
            ? "text-gray-400 bg-gray-200 hover:bg-red-200 hover:text-red-400"
            : "text-red-400 bg-red-200"
        }`}>
        <div>
          <IconHeartFilled size={16} />
        </div>
      </div>
    </button>
  );
}
