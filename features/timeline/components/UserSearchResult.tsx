import type { UserSummary } from "../types/types";

type Props = {
  notFound: string | null;
  foundUser: UserSummary | null;
  isFollowing: boolean;
  followMsg: string | null;
  onToggleFollow: () => void;
};

export const UserSearchResult = ({
  notFound,
  foundUser,
  isFollowing,
  followMsg,
  onToggleFollow,
}: Props) => {
  return (
    <>
      {notFound && (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
          {notFound}
        </div>
      )}

      {foundUser && (
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-800">{foundUser.name}</div>
              <div className="text-xs text-slate-400">@{foundUser.customId}</div>
            </div>
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                isFollowing ? "bg-slate-100 text-slate-600" : "bg-emerald-500 text-white"
              }`}
              onClick={onToggleFollow}
            >
              {isFollowing ? "解除" : "フォロー"}
            </button>
          </div>
          {followMsg && <div className="mt-2 text-xs text-slate-400">{followMsg}</div>}
        </div>
      )}
    </>
  );
};
