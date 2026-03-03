export const fetchFollowStatus = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  const res = await fetch(`/api/follow?followerId=${followerId}&followingId=${followingId}`);
  const data = await res.json();
  return !!data.isFollowing;
};

export const followUser = async (followerId: string, followingId: string) => {
  await fetch("/api/follow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId, followingId }),
  });
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  await fetch("/api/follow", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId, followingId }),
  });
};
