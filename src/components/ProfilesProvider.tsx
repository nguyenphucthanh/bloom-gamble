"use client";

import { api } from "@/trpc/react";
import { createContext, useEffect } from "react";
import { useToast } from "./ui/use-toast";

export type UserProfile = {
  id: string;
  user_id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
};

export const ProfilesContext = createContext<{
  profiles: UserProfile[];
}>({
  profiles: [],
});

const ProfilesProvider = ({ children }: React.PropsWithChildren) => {
  const profiles = api.userProfile.profiles.useQuery();
  const { toast } = useToast();

  useEffect(() => {
    if (profiles.error?.message) {
      toast({
        title: "Error",
        description: profiles.error.message,
        variant: "destructive",
      });
    }
  }, [profiles.error?.message, toast]);

  return (
    <ProfilesContext.Provider
      value={{ profiles: (profiles.data?.data as UserProfile[]) ?? [] }}
    >
      {profiles.isLoading ? (
        <div className="my-5 flex flex-col items-stretch gap-3">
          <div className="h-3 rounded bg-slate-100"></div>
          <div className="h-3 rounded bg-slate-100"></div>
          <div className="h-3 rounded bg-slate-100"></div>
          <div className="h-3 rounded bg-slate-100"></div>
        </div>
      ) : (
        children
      )}
    </ProfilesContext.Provider>
  );
};

export default ProfilesProvider;
