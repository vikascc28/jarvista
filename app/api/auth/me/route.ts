import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "jarvista_session_token";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: "Bearer " + token },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
