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

      if (!error) {
        // Link user profile to user
        //
        const userId = data?.user?.id;
        const userEmail = data.user?.email;

        if (userId && userEmail) {
          // Link profile
          const findProfile = await supabase
            .from("UserProfile")
            .select("*")
            .eq("email", userEmail)
            .maybeSingle();

          if (findProfile.data?.id) {
            await supabase
              .from("UserProfile")
              .update({
                user_id: userId,
              })
              .eq("id", findProfile.data?.id);
          } else {
            // Create profile
            //
            const name =
              (data?.user?.user_metadata?.name as string) ||
              userEmail?.split("@")[0];
            await supabase.from("UserProfile").insert({
              user_id: userId,
              email: userEmail,
              name,
              firstName: name,
            });
          }
        }
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
