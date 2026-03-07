"use client";

import { useState} from "react";
import { useAuth } from "./providers/AuthProvider";
import { getYesterdayYmd, formatDateJP } from "@/features/timeline/lib/date";

import { TimelineHeader } from "@/features/timeline/components/TimelineHeader";
import { UserSearchInput } from "@/features/timeline/components/UserSearchInput";
import { UserSearchResult } from "@/features/timeline/components/UserSearchResult";
import { TimelinePostCard } from "@/features/timeline/components/TimelinePostCard";
import { EmptyTimeline } from "@/features/timeline/components/EmptyTimeline";
import { useTimeline } from "@/features/timeline/hooks/useTimeline";
import { useUserSearch } from "@/features/timeline/hooks/useUserSearch";
import { useFollow } from "@/features/timeline/hooks/useFollow";

export default function Home() {
  const [customId, setCustomId] = useState("");
  const [followMsg, setFollowMsg] = useState<string | null>(null);
  const ymd = getYesterdayYmd();
  const dateLabel = formatDateJP(ymd);
  const { user } = useAuth();

  const { posts, loading: timelineLoading, error: timelineError } = useTimeline(user?.id, ymd);
  const {
    user: foundUser,
    notFound,
    loading: searchLoading,
    error: searchError,
    search,
  } = useUserSearch();
  const {
    isFollowing,
    loading: followLoading,
    error: followError,
    toggle: toggleFollow,
  } = useFollow(user?.id, foundUser?.id);

  const serchId = async () => {
    setFollowMsg(null);
    await search(customId);
  };

  const handleToggleFollow = async () => {//この関数でフォロー、解除　をする wasfollowingは過去のフォローの状態を保ち、togglefollow()で状態が切り替わる
    const wasFollowing = isFollowing;
    await toggleFollow();
    setFollowMsg(wasFollowing ? "フォロー解除しました" : "フォローしました");
  };

  const notFoundMessage = notFound ?? searchError;//notFoundがあればそれを使い、なければserchErrorを使う　　？？
  const followMessage = followMsg ?? followError;

  return (
    <div className="min-h-screen bg-white">
       <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6">
          <TimelineHeader />

          <UserSearchInput
            customId={customId}
            onChangeCustomId={setCustomId}
            onSearch={serchId}
          />

          <UserSearchResult
            notFound={notFoundMessage}
            foundUser={foundUser}
            isFollowing={isFollowing}
            followMsg={followMessage}
            onToggleFollow={handleToggleFollow}
          />

          <section className="space-y-6">
            {posts.length === 0 ? (
            <EmptyTimeline />
          ) : (
              posts.map((p) => (
                <TimelinePostCard
                  key={p.id}
                  post={p}
                  dateLabel={dateLabel}
                  userId={user?.id}
                />
              ))
            )}
          </section>
        </div>
    </div>
  );
}
