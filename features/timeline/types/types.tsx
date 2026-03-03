export type TimelinePost = {
    id: string;
    reflection: string;
    targetDate: string;
    user: { id: string; name: string; customId: string };
    likes?: { id: string }[];
  };