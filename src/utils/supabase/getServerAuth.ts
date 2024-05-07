import { createClient } from "@/server/supabase.server";
import { User } from "@supabase/supabase-js";

export const getServerAuth = async (): Promise<{
  error?: string;
  user?: User | null;
}> => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error ?? !data?.user) {
    return {
      error: error?.message ?? "User not found",
      user: null,
    };
  }

  return {
    user: data.user,
  };
};
