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
    <div className="flex flex-row items-center gap-3">
      <Button asChild variant={"outline"}>
        <Link href={"/"}>
          <HomeIcon />
        </Link>
      </Button>
      <div className="flex-1 text-xl font-bold">
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
