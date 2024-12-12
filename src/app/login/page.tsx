import Login from "@/components/auth/login";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { Metadata } from "next";
import React from "react";
import { redirect as goTo } from "next/navigation";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Login",
  description: "Work Hard Play Harder",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirect = (await searchParams).redirect;
  const auth = await getServerAuth();

  if (auth.user?.id) {
    return goTo("/profile");
  }

  return (
    <main>
      <section className="flex flex-col items-center justify-center">
        <Login redirectTo={redirect} />
      </section>
    </main>
  );
}
