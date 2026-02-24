"use client";

import React, { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider';


export default function today() {

  const {user} = useAuth();
  const [prevTasks, setPrevTasks ] = useState<string[]>([])

  useEffect(()=>{
    if (!user?.id) return;




    const d = new Date();
    d.setDate(d.getDate() -1);//ここで前日の日付数値を設定
    const ymd = d.toLocaleDateString("en-CA")//en-CAとはロケール指定　2026-02-20のような形式のこと



    

    fetch(`/api/post?userId=${user.id}&targetDate=${ymd}`)
    .then((res) => res.json()) //then()とは、前の処理が終わったら次はこれを実行するという関数 resとはfetchにより帰ってきたapiの　return NextResponse.json({post})また、return NextResponse.json({post})とはjsonではなくresponseオブジェクトのためres.json()とすることで初めてjsonに変換される　res → まだ「箱」　
    .then((data) => {
      const tasks = data?.post?.tasks?.map((t: {text: string}) => t.text) ?? [];//data?.post?.tasks?とはdata / post / tasks が存在する時だけ進む .map((t) => t.text) tasks の各要素から text だけ抜き出す　(t) => t.text は アロー関数で、t は 引数（ここでは tasks の1要素）t.text を 返す という意味
      setPrevTasks(tasks)
    });
  },[user?.id])

  return (
    <div>
      <h1>today</h1>
      <h2>昨日のタスク</h2>
      <ul>
        {prevTasks.map((t, i)=>(
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>

  )
}

