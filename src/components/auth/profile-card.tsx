import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type ProfileCardProps = {
  user?: User;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  if (!user) {
    return null;
  }

  const email: string = user?.email ?? "";
  const name: string = user?.user_metadata?.name ?? "";

  const shortName = email.slice(0, 1) || name.slice(0, 1) || "--";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative h-20 bg-gradient-to-br from-red-700 to-violet-700">
        <Avatar className="absolute left-6 top-8 h-24 w-24">
          <AvatarImage src="/meow.jpeg" />
          <AvatarFallback>{shortName}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="pt-16">
        <CardTitle>{user?.user_metadata?.name}</CardTitle>
        <CardDescription>{user?.email}</CardDescription>
      </CardContent>
    </Card>
  );
}
