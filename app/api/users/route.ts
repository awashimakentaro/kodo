import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

