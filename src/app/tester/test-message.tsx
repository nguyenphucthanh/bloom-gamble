"use client";
import { Button } from "@/components/ui/button";
import useMessenger from "@/hooks/useMessenger";
import { LoaderCircle } from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";

export default function TestMessage() {
  const { sendMessage } = useMessenger();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState("");

  const test = useCallback(() => {
    startTransition(async () => {
      const result = await sendMessage("test");
      setResponse(JSON.stringify(result));
    });
  }, [sendMessage]);
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Test Message</h1>
      <Button disabled={isPending} onClick={test}>
        {isPending ? <LoaderCircle className="animate-spin" /> : null}
        Click me
      </Button>
      {response && (
        <code className="text-wrap break-all bg-slate-100 p-2">
          <pre className="text-wrap break-all">{response}</pre>
        </code>
      )}
    </div>
  );
}
