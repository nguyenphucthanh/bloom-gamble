import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export type HeaderProps = {
  title: string;
  needSigin?: boolean;
  gamePath?: string;
};

export default function Header({ title, gamePath }: HeaderProps) {
  return (
    <div className="mb-5 flex flex-row items-center justify-between gap-3">
      <Button asChild variant={"outline"}>
        <Link href={"/"}>
          <HomeIcon />
        </Link>
      </Button>
      <div className="flex flex-1 flex-row justify-end text-xl font-bold">
        {gamePath ? (
          <Link href={gamePath} className="text-blue-500">
            {title}
          </Link>
        ) : (
          title
        )}
      </div>
    </div>
  );
}
