import type { Database } from "@/lib/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerActionClient<Database>({
  cookies,
});

export default supabase;
