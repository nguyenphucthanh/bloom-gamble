import { env } from "@/env";
import { Database } from "@/lib/database.types";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
    },
  },
);

export default supabase;
