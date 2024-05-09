import { env } from "@/env";
import { NextResponse, NextRequest } from "next/server";

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
  const useWebHook = env.SLACK_USE_WEBHOOK;

  try {
    const url =
      useWebHook && env.SLACK_WEBHOOK
        ? env.SLACK_WEBHOOK
        : token
          ? "https://slack.com/api/chat.postMessage"
          : "";

    if (!url) {
      return NextResponse.json({
        status: "error",
        message: "No webhook or slack bot setup",
      });
    }
    const data = (await request.json()) as {
      text: string;
      thread_ts: string;
    };

    const slackResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        ...(useWebHook
          ? {}
          : {
              Authorization: `Bearer ${token}`,
            }),
      },
      body: JSON.stringify({
        text: data?.text,
        ...(useWebHook
          ? {}
          : {
              channel: "work-hard-play-harder",
              thread_ts: data?.thread_ts,
            }),
      }),
    });

    console.log(useWebHook);
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
