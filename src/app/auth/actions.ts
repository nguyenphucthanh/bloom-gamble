"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

type SignOutState = boolean | null;

export const handleSignOut = async (
  _previousState: SignOutState,
  formData: FormData,
) => {
  const path = formData.get("path")?.toString();
  await api.user.signOut.mutate();
  if (path) {
    revalidatePath(path);
    redirect(path);
  }

  return true;
};
