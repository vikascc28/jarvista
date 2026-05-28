import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const { subId } = await req.json().catch(() => ({}));

  if (!subId || typeof subId !== "string") {
    return NextResponse.json({ error: "subId is required" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_LIVE_KEY;
  const keySecret = process.env.RAZORPAY_SECRET_KEY;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Missing Razorpay configuration" }, { status: 500 });
  }

  const instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const result = await instance.subscriptions.cancel(subId, false);
  return NextResponse.json(result);
}
