import { useEffect, useState } from "react";
import type { TimelinePost } from "../types/types";
import { fetchTimelinePosts } from "../services/timelineService";

type UseTimeline = {
  posts: TimelinePost[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;

  //     - loading: boolean
  //     データ取得中かどうか。例: スピナー表示、ボタン無効化、二重送信防止。
  //   - error: string
  //     失敗した理由をUIに出すため。例: 「取得に失敗しました」表示。
  //   - reload: () => Promise<void>
  //     再取得のため。例: 「再読み込み」ボタン、リトライ。
};

export const useTimeline = (userId?: string, targetDate?: string): UseTimeline => {
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!userId || !targetDate) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTimelinePosts(userId, targetDate);
      setPosts(data);
    } catch (e) {
      setError("タイムラインの取得失敗したお");
    } finally {
      setLoading(false);
    }
  }; //この関数綺麗すぎだろ
  useEffect(() => {
    load();
  }, [userId, targetDate]);
  return { posts, loading, error, reload: load };
};
