import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { HomeIcon, UserIcon } from "lucide-react";

export type HeaderProps = {
  title: string;
  needSigin?: boolean;
  gamePath?: string;
};

export default function Header({ title, gamePath }: HeaderProps) {
  return (
    <div className="mb-5 flex flex-row items-center justify-between gap-3">
      <Button asChild variant={"ghost"}>
        <Link href={"/"}>
          <HomeIcon />
        </Link>
      </Button>
      <div className="flex flex-1 flex-row justify-center text-xl font-bold">
        {gamePath ? (
          <Link href={gamePath} className="text-blue-500">
            {title}
          </Link>
        ) : (
          title
        )}
      </div>
      <div>
        <Button asChild variant={"ghost"}>
          <Link href={"/profile"}>
            <UserIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
