import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { RAZORPAY } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const { uid, email } = await req.json().catch(() => ({}));

  const keyId = process.env.RAZORPAY_LIVE_KEY;
  const keySecret = process.env.RAZORPAY_SECRET_KEY;
  const planId = process.env.RAZORPAY_PLAN_ID;

  if (!keyId || !keySecret || !planId) {
    return NextResponse.json(
      { error: "Missing Razorpay configuration" },
      { status: 500 },
    );
  }

  const instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const result = await instance.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
    total_count: RAZORPAY.subscriptionTotalCount,
    notes: {
      uid: uid ?? "",
      email: email ?? "",
      source: "jarvista-web",
    },
  });

  return NextResponse.json(result);
}
