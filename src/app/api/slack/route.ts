import { env } from "@/env";
import { NextResponse, NextRequest } from "next/server";

const useWebHook = true;

export type SlackResponse = {
  response:
    | {
        ok: true;
        channel: string;
        ts: string;
      }
    | {
        ok: false;
        error?: string;
        warning?: string;
      };
  status: string;
};

export async function POST(request: NextRequest) {
  const token = process.env.SLACK_OAUTH_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({
      status: "failed",
      message: "SLACK not setup",
    });
  }

  const data = (await request.json()) as {
    text: string;
    thread_ts: string;
  };

  try {
    const slackResponse = await fetch(
      useWebHook ? env.SLACK_WEBHOOK : "https://slack.com/api/chat.postMessage",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: data?.text,
          channel: "work-hard-play-harder",
          thread_ts: data?.thread_ts,
        }),
      },
    );

    if (useWebHook) {
      const response: SlackResponse = {
        response: {
          ok: true,
          channel: "work-hard-play-harder",
          ts: "",
        },
        status: "ok",
      };
      return NextResponse.json({ status: "ok", response });
    } else {
      const response = (await slackResponse.json()) as SlackResponse;

      return NextResponse.json({ status: "ok", response });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cannot post message";
    NextResponse.json({
      status: "error",
      message: msg,
    });
  }
}
