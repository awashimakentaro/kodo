import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";
import { serialize } from "v8";

export async function POST(req:Request){
    const {id, email, customId, name } = await req.json();

    if (!id || !email || !customId || !name){
        return NextResponse.json({error: "missing fields 何かしらの値が不足しているお"},{status: 400});//400はクライアントが悪いって意味
    }

    const user = await prisma.user.upsert({
        where:{id}, //これはprisuma.___.upsert の___今回だとuseテーブルであり　where idはuserてーぶるのidのことを指す
        update: {customId, name},
        create: {id ,email, customId, name},
    });
    return NextResponse.json({user})
}

export async function GET(req: Request){

    const {searchParams} = new URL(req.url); 
    const customId = searchParams.get("customId");

    if (!customId) { return NextResponse.json({error: "missing customId"}, { status: 400})}

    const user = await prisma.user.findUnique({
        where: {customId},
        select: {id: true, customId: true, name: true,},
    })

    return NextResponse.json({user})
} 
