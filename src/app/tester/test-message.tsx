"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useMessenger from "@/hooks/useMessenger";
import { LoaderCircle } from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";

export default function TestMessage() {
  const { sendMessage } = useMessenger();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("test");

  const test = useCallback(() => {
    startTransition(async () => {
      const result = await sendMessage(message);
      setResponse(JSON.stringify(result));
    });
  }, [sendMessage, message]);
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Test Message</h1>
      <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button
        disabled={isPending || !message}
        onClick={test}
        className="inline-flex gap-2"
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : null}
        Send Message
      </Button>
      {response && (
        <code className="text-wrap break-all bg-slate-100 p-2">
          <pre className="text-wrap break-all">{response}</pre>
        </code>
      )}
    </div>
  );
}
