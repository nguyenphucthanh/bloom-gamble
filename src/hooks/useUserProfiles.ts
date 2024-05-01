import { ProfilesContext } from "@/components/ProfilesProvider";
import { useToast } from "@/components/ui/use-toast";
import { useContext } from "react";

const useProfiles = () => {
  const { toast } = useToast();
  try {
    const context = useContext(ProfilesContext);
    return context.profiles;
  } catch {
    toast({
      title: "Error",
      description: "Please wrap your component in ProfilesProvider",
      variant: "destructive",
    });
  }
};

export default useProfiles;
