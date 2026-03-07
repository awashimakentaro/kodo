import { FaHeart, FaRegHeart } from "react-icons/fa";
import type { TimelinePost } from "../types/types";
import { useLike } from "../hooks/useLike";

type Props = {
  post: TimelinePost;
  dateLabel: string;
  userId?: string;
};

export const TimelinePostCard = ({ post, dateLabel, userId }: Props) => {
  const initialLiked = (post.likes?.length ?? 0) > 0;
  const { liked, toggle, loading } = useLike(userId, post.id, initialLiked);

  return (
    <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-sm font-bold text-slate-800">{post.user.name}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {dateLabel}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-normal leading-6 text-slate-600 whitespace-pre-wrap break-words">
        {post.reflection}{" "}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <button onClick={toggle} disabled={loading} className="inline-flex items-center gap-1">
          {liked ? (
            <FaHeart className="h-5 w-5 text-red-500" />
          ) : (
            <FaRegHeart className="h-5 w-5 text-slate-300" />
          )}
          <span className="text-slate-500 text-sm font-semibold">いいね</span>
        </button>
      </div>
    </div>
  );
};
