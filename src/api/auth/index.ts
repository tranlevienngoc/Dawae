import { MainNetworkAccess } from '@/access';
import { UserResponse } from '@/constants/model';

export const authorizationTwitter = async (): Promise<string> => {
  const res = await MainNetworkAccess.Get(`/authorization-twitter?is_dawae=true`);
  return res?.data;
};


export const getInfoTwitter = async (payload: {
  oauthToken: string,
  oauthVerifier: string,
}): Promise<{
  email: string,
  screen_name: string,
  picture: string,
  id: string,
  name: string,
}> => {
  const res = await MainNetworkAccess.Post('/get-info-twitter', {
    data: {
      ...payload,
      is_dawae: true,
    },
  });
  return res?.data;
};

export const getMe = async (): Promise<UserResponse> => {
  const res = await MainNetworkAccess.Get(`/me`);

  return res?.data;
};
