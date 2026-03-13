import { fetchMyPostReflection } from "@/features/today/services/reflectionService";
import useSWR from "swr";

export const usePrevPost = (userId?: string, targetDate?: string) => {
  const shouldFetch = Boolean(userId && targetDate);
  const { data, error, isValidating, isLoading } = useSWR<string>(
    shouldFetch ? ["prevPost", userId, targetDate] : null,
    () => fetchMyPostReflection(userId!, targetDate!),
  );
  return {
    reflection: data ?? "",
    isLoading,
    isValidating,
    isError: Boolean(error),
  };
};
