import { MainNetworkAccess } from '@/access';

export interface UserLeaderboardResponse {
  id: string;
  user_name: string;
  avatar: string;
  twitter_id: string;
  clicks: number;
  country_code: string;
}

export const getUserLeaderboard = async (): Promise<UserLeaderboardResponse[]> => {
  const res = await MainNetworkAccess.Get(`/users/leaderboard`);

  return res?.data;
};
