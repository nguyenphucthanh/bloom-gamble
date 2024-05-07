"use client";

import React, { useCallback, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import supabase from "@/server/supabase.client";
import { LoaderCircle } from "lucide-react";

export type LoginProps = {
  redirectTo?: string;
};

export default function Login({ redirectTo }: LoginProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignIn = useCallback(() => {
    startTransition(async () => {
      await supabase.auth.signInWithOAuth({
        provider: "slack",
        options: {
          redirectTo: `${location.origin}/auth/v1/callback?redirectTo=${redirectTo}`,
          scopes: "openid email profile",
        },
      });
      router.refresh();
    });
  }, [router, redirectTo]);

  return (
    <Button
      onClick={handleSignIn}
      disabled={isPending}
      className="inline-flex gap-2"
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : ""}
      Sign in with Slack
    </Button>
  );
}
