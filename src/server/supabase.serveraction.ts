import type { Database } from "@/lib/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function createClient() {
  const supabase = createServerActionClient<Database>({
    cookies,
  });

  return supabase;
}
