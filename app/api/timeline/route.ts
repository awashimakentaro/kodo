import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const targetDate = searchParams.get("targetDate")

    if (!userId || !targetDate){ return NextResponse.json({error: "missing params"}, { status: 400})}

    const date = new Date(targetDate)

    const follows: { followingId: string}[] = await prisma.follow.findMany({
        where: { followerId: userId},
        select: {followingId: true},
    })

    const followingIds = follows.map((f) => f.followingId) //パラメーター 'f' の型は暗黙的に 'any' になります。とエラーが出たのでfollowsの型指定を行うと: { followingId: string}[]　という形になる

    const posts = await prisma.post.findMany({
        where: {
            userId: {in: followingIds},
            targetDate: date,
        },
        select:{
            id:true,
            reflection: true,
            targetDate: true,
            user: { select: {id:true,name: true, customId: true }}//apiの返答に投稿ユーザーの情報を加えるための設定
        },
        orderBy:{ createdAt: "desc"}
    })
    return NextResponse.json({posts})
} 