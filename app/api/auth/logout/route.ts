import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json(
    { status: "success" },
    { status: 200 }
  );
  response.cookies.delete("session_token");
  return response;
}