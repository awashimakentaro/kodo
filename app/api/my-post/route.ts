import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request){
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const targetDate = searchParams.get("targetDate")

    if (!userId || !targetDate){ return NextResponse.json({error: "missing params"}, { status: 400})}

    const date = new Date(targetDate)

    const post = await prisma.post.findUnique({
        where: {
            userId_targetDate:{
                userId,
                targetDate:date
            },
        },
    })
    return NextResponse.json({post})
} 