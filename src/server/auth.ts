import { createClient } from "./supabase.server";

export const getServerAuthSession = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  return data.session;
};
