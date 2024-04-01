import { NextResponse } from "next/server";
import * as crypto from 'crypto';
import { wfp } from "@/lib/wayforpay";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    
  const body = await req.text();
  
  const object = JSON.parse(body);

  let data = object
  //validation response
  const forHash = [
    data.merchantAccount,
    data.orderReference,
    data.amount,
    data.currency,
    data.authCode,
    data.cardPan,
    data.transactionStatus,
    data.reasonCode,
    ].join(';');
    const expectedMerchantSignature = crypto
        .createHmac('md5', process.env.WAY_FOR_PAY_SECRET!)
        .update(forHash)
        .digest('hex');
    if (expectedMerchantSignature !== data.merchantSignature) {
        throw new Error('Corrupted webhook received. Webhook signature is not authentic.');
    }

  const metadata = data?.products[0].name.split(',');
  const userId = metadata[1];
  const courseId = metadata[0];

  if (data.transactionStatus === 'Approved') {
    
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


  const answer = {
    orderReference: data.orderReference,
    status: 'accept',
    time: Date.now(),
    signature: '',
  };
  const forHashString = [answer.orderReference, answer.status, answer.time].join(';');
  const hash = crypto.createHmac('md5', process.env.WAY_FOR_PAY_SECRET!).update(forHashString).digest('hex');
  answer.signature = hash;
  
  new NextResponse(JSON.stringify(answer), { status: 200 });
  return new NextResponse(null, { status: 200 });
}