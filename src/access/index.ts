import { NEXT_PUBLIC_URL_API } from '../config/index';
import { NetworkLayer } from '../utils/networkLayer';

export const MainNetworkAccess = new NetworkLayer({
  profile: 'app-data-layer',
  axiosRequestConfig: {
    withCredentials: false,
    baseURL: NEXT_PUBLIC_URL_API,
  },
});
  