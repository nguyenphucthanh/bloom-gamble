import React from "react";

import { Button } from "../ui/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export type LogoutProps = {
  path: string;
};

export default async function Logout({ path }: LogoutProps) {
  const handleSignOut = async () => {
    "use server";
    try {
      await api.user.signOut.mutate();
    } catch (error) {
      console.error(error);
    }
    revalidatePath(path);
    redirect(path);
  };

  return (
    <form action={handleSignOut}>
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
