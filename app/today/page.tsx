"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Task } from "@prisma/client";
import { TaskTextList } from "@/features/today/types/type";
import { getYesterdayYmd } from "@/lib/date";

export default function today() {
  const { user } = useAuth();
  const [prevTasks, setPrevTasks] = useState<TaskTextList>([]);
  const [prevPost, setPrevPost] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const ymd = getYesterdayYmd()

  useEffect(() => {
    if (!user?.id) return;

    const targetDate = selectDate || ymd;

    fetch(`/api/post?userId=${user.id}&targetDate=${ymd}`)
      .then((res) => res.json()) //then()とは、前の処理が終わったら次はこれを実行するという関数 resとはfetchにより帰ってきたapiの　return NextResponse.json({post})また、return NextResponse.json({post})とはjsonではなくresponseオブジェクトのためres.json()とすることで初めてjsonに変換される　res → まだ「箱」
      .then((data) => {
        const tasks = data?.post?.tasks?.map((t: Task) => t.text) ?? []; //data?.post?.tasks?とはdata / post / tasks が存在する時だけ進む .map((t) => t.text) tasks の各要素から text だけ抜き出す　(t) => t.text は アロー関数で、t は 引数（ここでは tasks の1要素）t.text を 返す という意味
        setPrevTasks(tasks);
      });

    fetch(`api/my-post?userId=${user.id}&targetDate=${targetDate}`)
      .then((res) => res.json())
      .then((data) => setPrevPost(data?.post?.reflection ?? ""));
  }, [user?.id, selectDate]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6 ">
        <div className="px-5 pb-10 pt-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-wide text-slate-800">今日の目標</h1>
            <p className="text-sm font-medium text-slate-400">一歩ずつ、着実に。</p>
          </div>

          <div className="rounded-[32px] border border-slate-100 bg-white px-6 py-10">
            {prevTasks.length === 0 ? (
              <div className="text-center text-sm text-slate-400">
                今日の目標はまだ設定されていません。
              </div>
            ) : (
              <ul className="space-y-3">
                {prevTasks.map((t, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-slate-500">
              日付を選択して過去の投稿を確認しよう
            </label>
            <input
              type="date"
              value={selectDate}
              onChange={(e) => setSelectDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-100 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none"
            />
          </div>
          <div className="mt-6 rounded-[32px] border border-slate-100 bg-white px-6 py-8">
            {prevPost ? (
              <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words">
                {prevPost}
              </p>
            ) : (
              <p className="text-center text-sm text-slate-400">この日の投稿はないよ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
