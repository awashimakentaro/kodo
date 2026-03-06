import { useCallback, useEffect, useState } from "react";
import { fetchFollowStatus, followUser, unfollowUser } from "../services/followService";

type UseFollow = {
  isFollowing: boolean;
  loading: boolean;
  error: string | null;
  check: () => Promise<void>;
  follow: () => Promise<void>;
  unfollow: () => Promise<void>;
  toggle: () => Promise<void>;
};

export const useFollow = (followerId?: string, followingId?: string): UseFollow => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    if (!followerId || !followingId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFollowStatus(followerId, followingId);
      setIsFollowing(result);
    } catch {
      setError("フォローチェック失敗した");
    } finally {
      setLoading(false);
    }
  }, [followerId, followingId]);//このfollowerIdとかが更新される度にチェックが入る　これって何度もチェック入って重くなんないんかな

  const follow = useCallback(async () => {
    if (!followerId || !followingId) return;
    setLoading(true);
    setError(null);
    try {
      await followUser(followerId, followingId);
      setIsFollowing(true);
    } catch {
      setError("フォロー失敗したあああああああああ");
    } finally {
      setLoading(false);
    }
  }, [followerId, followingId]);

  const unfollow = useCallback(async () => {
    if (!followerId || !followingId) return;
    setLoading(true);
    setError(null);
    try {
      await unfollowUser(followerId, followingId);
      setIsFollowing(false);
    } catch {
      setError("お前はフォローをはずせない");
    } finally {
      setLoading(false);
    }
  }, [followerId, followingId]);

  const toggle = useCallback(async () => {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  }, [isFollowing, follow, unfollow]);

  useEffect(() => {
    check();
  }, [check]);
  return { isFollowing, loading, error, check, follow, unfollow, toggle };
};
//calbackは別に処理を軽くするとこではなく子コンポーネントに関数を渡して無駄なサイレンだを防いだり読みやすさ、依存が明確になるくらいの理由らしいのでuseeffectだけでもパフォーマンスに影響はないらしい。