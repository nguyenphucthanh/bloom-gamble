import { HomeIcon } from "@radix-ui/react-icons";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import React from "react";
import Login from "./auth/login";
import Logout from "./auth/logout";
import { Button } from "./ui/button";

export type HeaderProps = {
  title: string;
  session?: Session | null;
  needSigin?: boolean;
  gamePath?: string;
};

export default function Header({
  title,
  session,
  needSigin,
  gamePath,
}: HeaderProps) {
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
      {needSigin !== false ? (
        <>
          {session?.user ? (
            <Logout path="/game-bau-cua" />
          ) : (
            <Login redirectTo="/auth/callback" />
          )}
        </>
      ) : null}
    </div>
  );
}
