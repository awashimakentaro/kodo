import {prisma} from "@/lib/prisma"
import { error } from "console"
import { NextResponse } from "next/server"
import { serialize } from "v8"

export async function POST(req:Request){
    const {postId, text, compleated} = await req.json()
    if (!postId || !text){
        return NextResponse.json({error: "missing fields"},{status:400})
    }

    const task = await prisma.task.create({
        data:{
            postId,
            text,
            compleated
        }
    })
}

