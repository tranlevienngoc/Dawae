export const FLUSH_PREVIOUS_REQUEST = 'FLUSH_PREVIOUS_REQUEST';

export type ExpiresType = {
  exp: number;
};

export type ErrorMsg = Error | string | string[];

export enum TYPE_STATUS_AUTH {
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
}