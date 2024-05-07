import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { createClient } from "@/server/supabase.server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") ?? "/";
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = decodeURIComponent(redirectTo);

  if (code) {
    const supabase = createClient();
    try {
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);

      console.log(data, error);

      if (!error) {
        return NextResponse.redirect(redirectUrl);
      }
    } catch (ex) {
      console.error(ex);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect("/login");
}
