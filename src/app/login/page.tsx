import Header from "@/components/Header";
import Login from "@/components/auth/login";
import Logout from "@/components/auth/logout";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Work Hard Play Harder",
};

export default async function LoginPage({
  searchParams: { redirect },
}: {
  searchParams: { redirect?: string };
}) {
  const auth = await getServerAuth();

  return (
    <main>
      <Header title="Login" />
      <section className="mt-5 flex flex-col items-center justify-center">
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
