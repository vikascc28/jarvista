import { NextRequest } from "next/server";
import Razorpay from "razorpay";


export async function POST() {
  return new Response(null, { status: 204 }); // No Content
}

// export async function POST(req: NextRequest) {

//     const { subId } = await req.json();

//     const instance = new Razorpay({
//         key_id: process.env.RAZORPAY_LIVE_KEY,
//         key_secret: process.env.RAZORPAY_SECRET_KEY,
//     })

//     const result = await instance.subscriptions.cancel(subId);

//     return result;

// }