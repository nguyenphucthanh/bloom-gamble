import ProfileCard from "@/components/auth/profile-card";
import { getServerAuth } from "@/utils/supabase/getServerAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfileLayout({
  children,
  points,
}: {
  children: React.ReactNode;
  points: React.ReactNode;
}) {
  const auth = await getServerAuth();

  if (!auth.user) {
    return redirect("/login");
  }
  return (
    <main>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside>
          <ProfileCard user={auth.user} />
        </aside>
        <main className="md:col-span-3">
          {children}
          {points}
        </main>
      </div>
    </main>
  );
}
