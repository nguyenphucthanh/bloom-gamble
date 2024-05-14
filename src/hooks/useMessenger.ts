import { api } from "@/trpc/react";
import { useCallback } from "react";

const useMessenger = () => {
  const mutation = api.messengerRoute.send.useMutation();

  const sendMessage = useCallback(
    async (message: string, threadId?: string | null) => {
      const result = await mutation.mutateAsync({
        message: message,
        threadId: threadId ?? "",
      });

      return result;
    },
    [],
  );

  return { sendMessage };
};

export default useMessenger;
