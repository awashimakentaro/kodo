import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
    try {
        const {userId, postId} = await req.json()

        if (!userId || !postId) {return NextResponse.json({ error: "missing fields" }, { status: 400 });}

        const like = await prisma.like.create({
            data: {userId, postId}
        })

        return NextResponse.json({like})

    }catch(err){
        if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
            return NextResponse.json({ error: "already liked" }, { status: 409 });
          }
          return NextResponse.json({ error: "server error" }, { status: 500 });

    }
    
}

export async function DELETE(req: Request){
    const {userId, postId} = await req.json()

    if (!userId || !postId) {
        return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    await prisma.like.deleteMany({
        where:{ userId, postId },
    })
    return NextResponse.json({ok: true})
}