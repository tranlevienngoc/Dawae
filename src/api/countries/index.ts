import { MainNetworkAccess } from '@/access';

export interface LeaderboardResponse {
  code: string;
  name: string;
  total_clicks: number;
}
export const getLeaderboard = async (): Promise<LeaderboardResponse[]> => {
  const res = await MainNetworkAccess.Get(`/leaderboard`);

  return res?.data;
};
