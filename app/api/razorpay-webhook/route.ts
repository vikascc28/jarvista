import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { PLAN_LIMITS } from "@/lib/constants";
import { createHmac } from "node:crypto";
import { Id } from "@/convex/_generated/dataModel";

function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret || !verifyWebhookSignature(raw, signature, secret)) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = JSON.parse(raw);
  const event = payload?.event as string | undefined;
  const notes = payload?.payload?.subscription?.entity?.notes;
  const subscriptionId = payload?.payload?.subscription?.entity?.id;

  if (event === "subscription.charged" && notes?.uid && subscriptionId) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const client = new ConvexHttpClient(convexUrl);
      await client.mutation(api.users.applyProPlanFromWebhook, {
        uid: notes.uid as Id<"users">,
        orderId: subscriptionId,
      });
    }
  }

  return new Response(
    JSON.stringify({ ok: true, creditsSyncedTo: PLAN_LIMITS.proCredits }),
    { headers: { "Content-Type": "application/json" } },
  );
}
