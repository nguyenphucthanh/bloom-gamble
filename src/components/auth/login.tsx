"use client";

import React from "react";

import supabase from "@/server/supabase.client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { env } from "@/env";

export type LoginProps = {
  redirectTo?: string;
};

export default function Login({ redirectTo }: LoginProps) {
  return (
    <>
      <Auth
        supabaseClient={supabase}
        providers={["slack"]}
        redirectTo={`${env.NEXT_PUBLIC_SITE_URL}/auth/v1/callback`}
        queryParams={{
          redirectTo: redirectTo ?? "",
        }}
        providerScopes={{
          slack: "profile email openid",
        }}
        onlyThirdPartyProviders={true}
        appearance={{ theme: ThemeSupa }}
      />
    </>
  );
}
