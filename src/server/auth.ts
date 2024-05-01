import supabase from "./supabse.serveraction";

export const getServerAuthSession = async () => {
  const { data } = await supabase.auth.getSession();

  return data.session;
};
