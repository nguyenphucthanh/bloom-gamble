"use client";
import React from "react";

import { Button } from "../ui/button";
import { handleSignOut } from "@/app/auth/actions";
import { RefreshCwIcon } from "lucide-react";
import { useFormState } from "react-dom";

export type LogoutProps = {
  path: string;
};

export default function Logout({ path }: LogoutProps) {
  const [_, action, isPending] = useFormState(handleSignOut, null);
  return (
    <form action={action}>
      <input type="hidden" name="path" value={path} />
      <Button type="submit" disabled={isPending}>
        {isPending && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
        Sign Out
      </Button>
    </form>
  );
}
