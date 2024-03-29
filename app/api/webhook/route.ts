import { NextResponse } from "next/server";

import { wfp } from "@/lib/wayforpay";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    
  const body = await req.text();
  console.log(body);

  let data;

  data = wfp.parseAndVerifyIncomingWebhook(JSON.parse(body));
  /*
  try {
    data = wfp.parseAndVerifyIncomingWebhook(JSON.parse(body));
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }
  */  
  console.log(data);
  console.log(data?.products[0]);

  const metadata = data?.products[0].name.split(',');
  const userId = metadata[1];
  const courseId = metadata[0];

  if (data.transactionStatus === 'Approved') {
    console.log(data);
    
    if (!userId || !courseId) {
      return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
      }
    });

    
  } else {
    return new NextResponse(`Webhook Error: Unhandled event type`, { status: 200 })
  }
  const answer = wfp.prepareSignedWebhookResponse(data);
  new NextResponse(JSON.stringify(answer), { status: 200 });
  return new NextResponse(null, { status: 200 });
}