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

export async function GET(req:Request){//前日のtasksの情報等を取得する
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const targetDate = searchParams.get("targetDate")

    if (!userId || !targetDate){ return NextResponse.json({error: "migging params"}, {status: 400})    }

    const date = new Date(targetDate)

    const post = await prisma.post.findUnique({
        where: {
            userId_targetDate: {// @@unique([userId, targetDate]) とprismaに定義した場合tsではuserId_targetDateという形でここに入力する.Prisma が userId_targetDateというキーを自動生成します
                userId,
                targetDate: date,
            },
        },
        include:{ tasks: true}
    });
    return NextResponse.json({post})
    // {
    //     "post": {
    //       "id": "post-uuid",
    //       "userId": "user-uuid",
    //       "targetDate": "2026-02-19",
    //       "reflection": "今日の振り返り本文",
    //       "createdAt": "2026-02-19T14:35:20.584Z",
    //       "updatedAt": "2026-02-19T14:35:20.584Z",
    //       "tasks": [
    //         { "id": "task-uuid-1", "postId": "post-uuid", "text": "朝ラン" },
    //         { "id": "task-uuid-2", "postId": "post-uuid", "text": "勉強" }
    //       ]
    //     }
    //   }みたいなjsonが取得できる。あくまでここで取得してるのはtasksのjsonではなくpostの情報+それに関連するtasksの情報
}
//         string id PK
//         string userId FK
//         date targetDate "記録対象の日"
//         text reflection "今日の振り返り本文"
//         datetime createdAt "投稿した時間"
//         datetime updatedAt "最後に編集された時間"

