import Header from "@/components/Header";
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
    <main>
      <Header title="Login" />
      <section className="flex flex-col items-center justify-center">
        {auth?.user ? (
          <>
            <div className="p-3 font-bold">Hello {auth?.user?.email}!</div>
            <Logout path="/" />
          </>
        ) : (
          <Login redirectTo={redirect} />
        )}
      </section>
    </main>
  );
}
