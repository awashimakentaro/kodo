"use client";
import { useAuth } from "../providers/AuthProvider";
import { getYesterdayYmd } from "@/lib/date";
import { usePrevTasks } from "@/features/today/hooks/usePrevTasks";
import { TodayHeader } from "@/features/today/components/TodayHeader";
import { UserPrevPost } from "@/features/today/components/UserPrevPost";
import { UserPrevTasks } from "@/features/today/components/UserPrevTasks";

export default function today() {
  const { user } = useAuth();
  const ymd = getYesterdayYmd();

  const { tasks, isLoading: tasksLoading } = usePrevTasks(user?.id, ymd);
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6 ">
        <div className="px-5 pb-10 pt-6">
          <TodayHeader />
          <UserPrevTasks tasks={tasks} />
          <UserPrevPost userId={user?.id} defaultDate={ymd} />
        </div>
      </div>
    </div>
  );
}
