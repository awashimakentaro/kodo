import { error } from "console";
import { useState } from "react";
import { likePost, unlikePost } from "../services/likeService";

type UseLike = {
  liked: boolean;
  loading: boolean;
  error: string | null;
  like: () => Promise<void>;
  unlike: () => Promise<void>;
  toggle: () => Promise<void>;
};

export const useLike = (userId?: string, postId?: string, initialLiked = false): UseLike => {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const like = async () => {
    if (!userId || !postId) return;
    setLoading(true);
    setError(null);
    try {
      await likePost(userId, postId);
      setLiked(true);
    } catch {
      setError("いいねに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const unlike = async () => {
    if (!userId || !postId) return;
    setLoading(true);
    setError(null);
    try {
      await unlikePost(userId, postId);
      setLiked(false);
    } catch {
      setError("いいね解除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async () => {
    if (liked) {
      await unlike();
    } else {
      await like();
    }
  };

  return { liked, loading, error, like, unlike, toggle };
};
