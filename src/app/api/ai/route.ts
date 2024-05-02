import { NextResponse, NextRequest } from "next/server";
import { congrats } from "@/utils/ai";

export async function POST(request: NextRequest) {
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    return NextResponse.json({
      status: "failed",
      message: "OPEN AI not setup",
    });
  }

  const data = (await request.json()) as {
    names: string[];
    winnerName: string;
  };

  try {
    const result = await congrats(data.names, data.winnerName);

    return NextResponse.json({ status: "ok", message: result });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Cannot get chatgpt message";
    return NextResponse.json({
      status: "error",
      message: msg,
    });
  }
}
