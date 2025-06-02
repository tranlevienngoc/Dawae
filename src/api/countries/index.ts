import { MainNetworkAccess } from '@/access';

export interface LeaderboardResponse {
  code: string;
  name: string;
  total_clicks: number;
  pps: number;
}
export interface ClickResponse {
  created_at: string;
  id: number;
  user_id: number | null;
  clicks: number;
  country_code: string;
}

export const getLeaderboard = async (): Promise<LeaderboardResponse[]> => {
  const res = await MainNetworkAccess.Get(`/leaderboard`);

  return res?.data;
};

export const clickUgandanNuckle = async (countryCode: string, clickCount: number): Promise<ClickResponse> => {
  const res = await MainNetworkAccess.Post(`/click`, {
    data: {
      country_code: countryCode,
      click_count: clickCount
    }
  });

  return res?.data;
};
