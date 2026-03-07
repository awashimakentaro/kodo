type Props = {
  customId: string;
  onChangeCustomId: (value: string) => void;
  onSearch: () => void;
};

export const UserSearchInput = ({ customId, onChangeCustomId, onSearch }: Props) => {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-[20px] borderborder-slate-100 bg-white px-5 py-4 shadow-sm">
      <span>🔍</span>
      <input
        type="text"
        className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        placeholder="友達をIDや名前で検索"
        value={customId}
        onChange={(e) => onChangeCustomId(e.target.value)}
      />
      <button
        className="rounded-2xl bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white"
        onClick={onSearch}
      >
        検索
      </button>
    </div>
  );
};
