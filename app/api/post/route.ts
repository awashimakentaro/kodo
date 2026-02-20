import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        const { userId, reflection, targetDate,tasks } = await req.json();

        const taskTexts = Array.isArray(tasks) ? tasks.map((t: string) => t.trim()).filter(Boolean) : []; //Array.isArray(tasks)でtasksが配列かどうかを判定し配列からtrim()で空白のものを削除tems = ["朝ラン", "  ", "  勉強  "]　をtasks = ["朝ラン", "勉強"]にできる

        if (!userId || !reflection) {
            return NextResponse.json({error: "missing fields"},{status:400})
        }

        const date = targetDate ? new Date(targetDate) : new Date() //もしもtargetDateがあればDate(targeDate) をいれ、なければnew Date()　あとで編集機能などの実装もあるかも
        //const ymd = new Date().toLocaleDateString("en-CA"); このDate()はUSTだから日付での制約が通らなかった


        const post = await prisma.post.create({
            data: {
                userId,
                reflection,
                targetDate: date,

                //tasksはmemo知一緒のタイミングで保存されて欲しいのでここに本来tasks.tsですべき処理を行う
                tasks:{//このtasks:{}とはPostテーブルと関連しているTaskテーブルに同時に作成できる。この段階でpostIdがはいる
                    create: taskTexts.map(text => ({text})),//Prismaの create は オブジェクト配列を要求するので["朝ラン", "勉強"]→ [{text:"朝ラン"}, {text:"勉強"}]　でDBように整える
                },
                //targetDate: ymd,
            },
            include: {tasks: true},
        })

        return NextResponse.json({ post })
    
    } catch (err){ //errはprisma.post.create(...)が失敗した時にerrが入る
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" ){//err.code　codeを使えばprismaが付与したエラー番号を判定できる
            return NextResponse.json({error: "投稿は1日1個まで"},{status:409})
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