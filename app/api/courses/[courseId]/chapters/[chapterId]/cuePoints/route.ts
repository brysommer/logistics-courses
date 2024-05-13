import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { 
    courseId: string,
    chapterId: string,
   }
  }
) {
  try {
    const { userId } = auth();
    const { time, value } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const cuePoint = await db.cuePoint.create({
      data: {
        time,
        chapterId: params.chapterId,
        value,
      }
    });
    console.log(cuePoint)

    return NextResponse.json(cuePoint);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}