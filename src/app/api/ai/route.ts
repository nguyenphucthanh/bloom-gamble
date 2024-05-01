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

  const data = await request.json();

  try {
    const result = await congrats(data.names, data.winnerName);

    return NextResponse.json({ status: "ok", message: result });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Cannot get chatgpt message",
    });
  }
}
