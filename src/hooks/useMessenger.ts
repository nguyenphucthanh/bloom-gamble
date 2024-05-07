import { useCallback } from "react";

export type SlackResponse = {
  response: {
    ok: true;
    channel: string;
    ts: string;
  } | {
    ok: false;
    error? : string;
    warning?: string;
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
