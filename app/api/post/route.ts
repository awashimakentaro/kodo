import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const { userId, reflection, targetDate } = await req.json();

        if (!userId || !reflection) {
            return NextResponse.json({error: "missing fields"},{status:400})
        }

        const date = targetDate ? new Date(targetDate) : new Date() //もしもtargetDateがあればDate(targeDate) をいれ、なければnew Date()　あとで編集機能などの実装もあるかも
        //const ymd = new Date().toLocaleDateString("en-CA"); このDate()はUSTだから日付での制約が通らなかった

        console.log(date)

        const post = await prisma.post.create({
            data: {
                userId,
                reflection,
                targetDate: date,
                //targetDate: ymd,
            }
        })

        return NextResponse.json({ post })
    
    } catch (err){
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" ){
            return NextResponse.json(
                {error: "1日記事投稿は一個までですよ"},
                {status:409}
            )
        }
        return NextResponse.json({ error: "server error" }, { status: 500 })
    }

}
//         string id PK
//         string userId FK
//         date targetDate "記録対象の日"
//         text reflection "今日の振り返り本文"
//         datetime createdAt "投稿した時間"
//         datetime updatedAt "最後に編集された時間"