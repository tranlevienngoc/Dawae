/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosRequestConfig,
  CancelToken,
  CancelTokenSource,
  Method,
} from 'axios';
import axios from 'axios';

import { FLUSH_PREVIOUS_REQUEST } from '../constants/index';

type AnyAsyncFunction = any;

type Regulator = {
  id: string;
  tokenSource: CancelTokenSource;
  revoke: (cancelFirst?: string) => void;
  cancel: (message: string) => CancelToken;
  debouncedRequest: (
    accessor: NetworkLayer,
    method: AnyAsyncFunction
  ) => AnyAsyncFunction;
};

type DataAccessParams = {
  profile: string;
  axiosRequestConfig?: AxiosRequestConfig<any>;
};

export class NetworkLayer {
  private _profile: string;

  private _manner: any;

  private _defaultHeaders: Record<string, string> | undefined = {};

  _cache: { [index: string]: any } = {};

  private static RegulatorMap: Record<string, Regulator> = {};

  static INSTANCE: { [index: string]: NetworkLayer } = {};

  constructor({ profile, axiosRequestConfig }: DataAccessParams) {
    this._profile = profile;

    if (!NetworkLayer.INSTANCE[profile]) {
      NetworkLayer.INSTANCE[profile] = this;
    }
    this._manner = axios.create({
      ...axiosRequestConfig,
    });

    NetworkLayer.INSTANCE[profile] = this;
    // return NetworkLayer.INSTANCE[profile];
  }

  get profile() {
    return this._profile;
  }

  get manner() {
    return this._manner;
  }

  set manner(manner) {
    this._manner = manner;
  }

  get defaultHeaders() {
    return this._defaultHeaders;
  }

  set defaultHeaders(headers) {
    this._defaultHeaders = headers;
  }

  // setHeaders = (overrideHeaders: { [key: string]: any }) => {
  //   for (key in overrideHeaders) {
  //     if (Object.prototype.hasOwnProperty.call(overrideHeaders, key)) {
  //       this.manner.defaults.headers.common[key] =
  //         Object.prototype.hasOwnProperty.call(overrideHeaders, key);
  //     }
  //   }
  // };

  get DataLayerProfile() {
    return NetworkLayer.INSTANCE[this.profile];
  }

  // eslint-disable-next-line class-methods-use-this
  getRegulator(syncId: string) {
    if (NetworkLayer.RegulatorMap[syncId] === undefined) {
      NetworkLayer.RegulatorMap[syncId] = {
        id: syncId,
        tokenSource: axios.CancelToken.source(),
        revoke(cancelFirst) {
          if (cancelFirst !== undefined) this.tokenSource.cancel(cancelFirst);
          this.tokenSource = axios.CancelToken.source();
        },
        cancel(message) {
          this.tokenSource.cancel(message);

          return this.tokenSource.token;
        },
        debouncedRequest(accessor: NetworkLayer, method: AnyAsyncFunction) {
          return async (
            url: string,
            args?: AxiosRequestConfig
          ): Promise<any> => {
            try {
              this.revoke(`${FLUSH_PREVIOUS_REQUEST} with key ${this.id}`);
              return method.bind(accessor)(url, {
                cancelToken: this.tokenSource.token,
                ...args,
              });
            } catch (e) {
              console.error('🚀 ~ NetworkLayer ~ debouncedRequest ~ e', e);
              throw e;
            }
          };
        },
      };
    }
    return NetworkLayer.RegulatorMap[syncId];
  }

  debounce(syncId: string) {
    const Regulator = this.getRegulator(syncId);

    return {
      Get: Regulator.debouncedRequest(this, this.Get),
      Post: Regulator.debouncedRequest(this, this.Post),
      Update: Regulator.debouncedRequest(this, this.Update),
      Replace: Regulator.debouncedRequest(this, this.Replace),
      Delete: Regulator.debouncedRequest(this, this.Delete),
    };
  }

  _request(
    method: Method,
    axiosRequestConfig: Omit<AxiosRequestConfig<any>, 'method'>
  ) {
    const {
      // headers = { 'Accept-Encoding': 'gzip,deflate,compress' },
      headers = {},
      ...restRequestConfig
    } = axiosRequestConfig;

    return this.manner({
      // End custom config
      timeout: 30000,
      validateStatus(status: number) {
        return (status >= 200 && status < 300) || status === 416; // default
      },
      method,
      headers: {
        ...headers,
        ...this.defaultHeaders,
      },
      ...restRequestConfig,
    });
  }

  Cache(url: string) {
    if (!this._cache[url]) {
      this._cache[url] = this.Get(url);
    }

    return this._cache[url];
  }

  Get(url: string, opts?: AxiosRequestConfig<any>) {
    return this._request('get', { url, ...opts });
  }

  Post(url: string, opts?: AxiosRequestConfig<any>) {
    return this._request('post', { url, ...opts });
  }

  Update(url: string, opts?: AxiosRequestConfig<any>) {
    return this._request('patch', { url, ...opts });
  }

  Replace(url: string, opts?: AxiosRequestConfig<any>) {
    return this._request('put', { url, ...opts });
  }

  Delete(url: string, opts?: AxiosRequestConfig<any>) {
    return this._request('delete', { url, ...opts });
  }
}
