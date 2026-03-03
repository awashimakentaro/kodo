import { UserSummary } from './../types/types';

export const fetchUserByCustomId = async (customId: string): Promise<UserSummary | null> => {
  const res = await fetch(`/api/users?customId=${encodeURIComponent(customId)}`);
  const data = await res.json();
  return data.user ?? null;
};
