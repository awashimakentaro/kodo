import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'console';

export async function POST(req: Request){
    try{
        const {followerId, followingId} = await req.json()

        if ( !followerId || !followingId){  return NextResponse.json({ error: "missing fields"}, {status: 400})}

        if (followerId === followingId){return NextResponse.json({error: "自分自身はフォローできないよ"}, {status: 400});
        }
        const follow = await prisma.follow.create({
            data: { followerId, followingId},
        });

        return NextResponse.json({follow});
    }catch(err){
        if (err instanceof PrismaClientKnownRequestError && err.code === "P2002"){
            return NextResponse.json({error: "すでにフォローしてるよ"}, {status: 409});
        }
        return NextResponse.json({ error: "server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const followerId = searchParams.get("followerId");
    const followingId = searchParams.get("followingId");

    if (!followerId || !followingId){return NextResponse.json({error: "missing field"}, {status: 400})}

    const follow = await prisma.follow.findUnique({
        where:{
            followerId_followingId:{ followerId, followingId }
        }
    });

    return NextResponse.json({ isFollowing: !!follow }) //もしもfollowが存在するならtrue !!followとはboolean 
}

export async function DELETE(req:Request) {
    
    const { followerId, followingId} = await req.json();
    if (!followerId || !followingId) {    return NextResponse.json({ error: "missing fields" }, { status:400 });}

    try{
        await prisma.follow.delete({
        where: {
            followerId_followingId: { followerId, followingId}
            },
        })
    }catch(err){
        if (err instanceof PrismaClientKnownRequestError && err.code ==="P2025") {
                return NextResponse.json({ error: "not following" }, { status: 404 });
            }
    }
    

    return NextResponse.json({ok: true})

}

