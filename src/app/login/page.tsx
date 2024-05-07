import Login from "@/components/auth/login";
import Logout from "@/components/auth/logout";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import React from "react";

export default async function LoginPage({
  searchParams: { redirect },
}: {
  searchParams: { redirect?: string };
}) {
  const auth = await getServerAuth();

  return (
    <section className="flex items-center justify-center">
      {auth?.user ? (
        <div>
          <div className="p-3 font-bold">Hello {auth?.user?.email}!</div>
          <Logout path="/" />
        </div>
      ) : (
        <Login redirectTo={redirect} />
      )}
    </section>
  );
}
