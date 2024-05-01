import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  const res = {
    ab: 1,
  };

  return NextResponse.json({ data: res });
}

export async function POST(request: NextRequest) {
  const token = process.env.SLACK_OAUTH_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({
      status: "failed",
      message: "SLACK not setup",
    });
  }

  const data = await request.json();
  try {
    const slackResponse = await fetch(
      "https://slack.com/api/chat.postMessage",
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

    const response = await slackResponse.json();

    return NextResponse.json({ status: "ok", response });
  } catch (err) {
    NextResponse.json({
      status: "error",
      message: (err as unknown as Error)?.message,
    });
  }
}
