import { createClient } from "@/server/supabase.server";
import { redirect } from "next/navigation";

export const getServerAuth = async (pathName?: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data?.user) {
    return redirect(`/login?redirect=${encodeURIComponent(pathName ?? "")}`);
  }

  return {
    user: data.user,
  };
};
