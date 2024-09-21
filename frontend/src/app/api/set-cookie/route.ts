// app/api/set-cookie/route.js
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Cookie set" });
  const body = await req.json();
  const { token } = body;
  response.cookies.set("token", token, {
    maxAge: 60 * 60 * 48,
    httpOnly: false,
    path: "/",
  });

  return response;
}
