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
  profiles: Array<UserProfile>;
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
  }, [profiles.error?.message]);

  return (
    <ProfilesContext.Provider
      value={{ profiles: (profiles.data?.data as Array<UserProfile>) ?? [] }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};

export default ProfilesProvider;
