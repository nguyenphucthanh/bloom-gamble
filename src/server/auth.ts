import { createClient } from "./supabase.server";

export const getServerAuthSession = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();

  return data.session;
};
