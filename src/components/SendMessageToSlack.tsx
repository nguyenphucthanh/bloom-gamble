"use client";
import useMessenger from "@/hooks/useMessenger";
import { LoaderCircle } from "lucide-react";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SendMessageToSlackProps = {
  message: string;
  title?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const SendMessageToSlack = ({
  className,
  message,
  title,
  ...props
}: SendMessageToSlackProps) => {
  const { sendMessage } = useMessenger();
  const [isPending, startTransition] = useTransition();
  const send = useCallback(() => {
    startTransition(async () => {
      await sendMessage(message);
    });
  }, [message, sendMessage]);

  return (
    <Button
      {...props}
      className={cn("inline-flex gap-2", className)}
      onClick={send}
      disabled={isPending}
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : null}
      {title ?? "Post Result To Slack"}
    </Button>
  );
};

export default SendMessageToSlack;
