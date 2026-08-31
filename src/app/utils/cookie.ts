import { CookieOptions, Request, Response } from "express";

const setCookie = (
  res: Response,
  key: string,
  value: string,
  options: CookieOptions
) => {
  (res as any).cookie(key, value, options);
};

const getCookie = (req: Request, key: string) => {
  return (req as any).cookies ? (req as any).cookies[key] : undefined;
};

const clearCookie = (res: Response, key: string, options: CookieOptions) => {
  (res as any).clearCookie(key, options);
};

export const CookieUtils = {
  setCookie,
  getCookie,
  clearCookie,
};
