import { NextResponse, NextRequest } from "next/server";
import { congrats } from "@/app/utils/ai";

export async function POST(request: NextRequest) {
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
