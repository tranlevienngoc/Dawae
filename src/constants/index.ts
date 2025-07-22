export const FLUSH_PREVIOUS_REQUEST = 'FLUSH_PREVIOUS_REQUEST';

export const FONT_FAMILY = `Poppins, system-ui, "Segoe UI", Helvetica, Arial, sans-serif`;

export const FONT_FAMILY_REGULAR = `Poppins Regular`;

export const FONT_FAMILY_SEMIBOLD = `Poppins SemiBold`;

export const FONT_FAMILY_BOLD = `Poppins Bold`;

export const FONT_FAMILY_RUBIK = `Rubik`;
export const REGEX_URL =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

export const THRESHOLD = 1.1;


export type ExpiresType = {
  exp: number;
};

export type ErrorMsg = Error | string | string[];

export enum TYPE_STATUS_AUTH {
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
}