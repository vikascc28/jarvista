import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  } = body || {};

  if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing verification payload" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Missing Razorpay secret" }, { status: 500 });
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");

  const verified = expectedSignature === razorpay_signature;
  return NextResponse.json({ verified });
}
