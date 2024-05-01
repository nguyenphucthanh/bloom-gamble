"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import supabase from "@/server/supabase.client";

export type LoginProps = {
  redirectTo?: string;
};

export default function Login({ redirectTo }: LoginProps) {
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "slack",
      options: {
        redirectTo: `${location.origin}/${redirectTo}`,
        scopes: "openid email profile",
      },
    });
    router.refresh();
  };

  return <Button onClick={handleSignIn}>Sign in with Slack</Button>;
}
