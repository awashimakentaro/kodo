import { fetchUserByCustomId } from "../services/userService";
import { UserSummary } from "./../types/types";
import { useState } from "react";

type UseUserSearch = {
  user: UserSummary | null;
  notFound: string | null;
  loading: boolean;
  error: string | null;
  search: (customId: string) => Promise<void>;
};

export const useUserSearch = (): UseUserSearch => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (customId: string) => {
    if (!customId) return;
    setLoading(true);
    setError(null);
    setNotFound(null);

    try {
      const result = await fetchUserByCustomId(customId);
      if (!result) {
        setUser(null);
        setNotFound("このユーザーはいないよ");
        return;
      }
      setUser(result);
    } catch {
      setError("ユーザー検索が失敗してるぜ")
    }finally{
        setLoading(false)
    }
  };
  return { user, notFound, loading, error, search };
};
//今回はusecallbackを使わないように書いてみた