type TodayHeaderProps = {
  title?: string;
  subtitle?: string;
};

export const TodayHeader = ({
  title = "今日の目標",
  subtitle = "一歩ずつ、着実に。",
}: TodayHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-wide text-slate-800">{title}</h1>
      <p className="text-sm font-medium text-slate-400">{subtitle}</p>
    </div>
  );
};
