import useMessenger from "@/hooks/useMessenger";
import { useCallback } from "react";

export type SendMessageToSlackProps = {
  message: string;
  title?: string;
};

const SendMessageToSlack = ({ message, title }: SendMessageToSlackProps) => {
  const { sendMessage } = useMessenger();
  const send = useCallback(() => {
    sendMessage(message);
  }, [message, sendMessage]);

  return (
    <button
      className="col-span-2 mt-5 inline-flex w-full justify-center gap-2 rounded bg-blue-500 p-3 text-center font-bold text-white"
      onClick={send}
    >
      {title ?? "Post Result To Slack"}
    </button>
  );
};

export default SendMessageToSlack;
