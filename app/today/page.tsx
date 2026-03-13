"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { TaskTextList } from "@/features/today/types/type";
import { getYesterdayYmd } from "@/lib/date";
import { fetchPostTasks } from "@/features/today/services/taskService";
import { fetchMyPostReflection } from "@/features/today/services/reflectionService";
import { usePrevTasks } from "@/features/today/hooks/usePrevTasks";
import { TodayHeader } from "@/features/today/components/TodayHeader";
import { UserPrevPost } from "@/features/today/components/UserPrevPost";
import { UserPrevTasks } from "@/features/today/components/UserPrevTasks";

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
          <TodayHeader />
          <UserPrevTasks tasks={tasks} />
          <UserPrevPost />

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
