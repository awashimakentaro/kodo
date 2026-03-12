"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { TaskTextList } from "@/features/today/types/type";
import { getYesterdayYmd } from "@/lib/date";
import { fetchPostTasks } from "@/features/today/services/taskService";
import { fetchMyPostReflection } from "@/features/today/services/reflectionService";
import { usePrevTasks } from "@/features/today/hooks/usePrevTasks";

export default function today() {
  const { user } = useAuth();
  const [prevTasks, setPrevTasks] = useState<TaskTextList>([]);
  const [prevPost, setPrevPost] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const ymd = getYesterdayYmd();

  const { tasks, isLoading: tasksLoading } = usePrevTasks(user?.id, ymd);

  useEffect(() => {
    if (!user?.id) return;

    const targetDate = selectDate || ymd;

    fetchPostTasks(user.id, ymd).then(setPrevTasks);
    fetchMyPostReflection(user.id, targetDate).then(setPrevPost);
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
