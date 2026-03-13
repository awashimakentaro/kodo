type prevTasksProps = {
  tasks: string[];
  emptyMessage?: string;
};

export const UserPrevTasks = ({
  tasks,
  emptyMessage = "今日の目標はまだ設定されていません。",
}: prevTasksProps) => {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-white px-6 py-10">
      {tasks.length === 0 ? (
        <div className="text-center text-sm text-slate-400">{emptyMessage}</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t, i) => (
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
  );
};
