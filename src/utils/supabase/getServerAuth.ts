import { createClient } from "@/server/supabase.server";
import { UserProfile } from "@prisma/client";
import { User } from "@supabase/supabase-js";

export const getServerAuth = async (): Promise<{
  error?: string;
  user?: User | null;
  profile?: UserProfile | null;
}> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data?.user) {
    return {
      error: error?.message ?? "User not found",
      user: null,
    };
  }

  const profile = await supabase
    .from("UserProfile")
    .select()
    .eq("user_id", data.user.id)
    .single();

  return {
    user: data.user,
    profile: profile.data,
  };
};
