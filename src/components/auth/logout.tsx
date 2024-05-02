import React from "react";

import { Button } from "../ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export type LogoutProps = {
  path: string;
};

export default function Logout({ path }: LogoutProps) {
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-misused-promises
  const handleSignOut = async () => {
    "use server";
    api.user.signOut.mutate().catch((error) => {
      console.error(error);
    });
    revalidatePath(path);
    redirect(path);
  };

  return (
    <form action={handleSignOut}>
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
