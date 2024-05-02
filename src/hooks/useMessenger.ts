import { useCallback } from "react";

export type SlackResponse = {
  response: {
    ok: boolean;
    channel: string;
    ts: string;
  };
  status: string;
};
const useMessenger = () => {
  const sendMessage = useCallback(
    async (message: string, thread_ts?: string | null) => {
      const result = await fetch("/api/slack", {
        method: "POST",
        body: JSON.stringify({ text: message, thread_ts }),
      });
      const response = (await result.json()) as SlackResponse;
      return response;
    },
    [],
  );

  return { sendMessage };
};

export default useMessenger;
