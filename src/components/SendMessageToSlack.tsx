import useMessenger from "@/hooks/useMessenger";
import { LoaderCircle } from "lucide-react";
import { useCallback, useTransition } from "react";

export type SendMessageToSlackProps = {
  message: string;
  title?: string;
};

const SendMessageToSlack = ({ message, title }: SendMessageToSlackProps) => {
  const { sendMessage } = useMessenger();
  const [isPending, startTransition] = useTransition();
  const send = useCallback(() => {
    startTransition(async () => {
      await sendMessage(message);
    });
  }, [message, sendMessage]);

  return (
    <button
      className="col-span-2 mt-5 inline-flex w-full justify-center gap-2 rounded bg-blue-500 p-3 text-center font-bold text-white"
      onClick={send}
      disabled={isPending}
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : null}
      {title ?? "Post Result To Slack"}
    </button>
  );
};

export default SendMessageToSlack;
