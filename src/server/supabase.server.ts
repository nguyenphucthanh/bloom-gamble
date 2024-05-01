import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

const cookieStore = cookies();
const supabase = createServerComponentClient<Database>({
  cookies: () => cookieStore,
});

export default supabase;
