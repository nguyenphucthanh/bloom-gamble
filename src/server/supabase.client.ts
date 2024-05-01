import { env } from "@/env";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient<Database>({
  supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export default supabase;
