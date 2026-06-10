import type { Response } from 'express';

export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export function ok<T>(data: T, message = 'ok'): ApiResult<T> {
  return { code: 0, message, data };
}

export function fail(message: string, code = 1): ApiResult<null> {
  return { code, message, data: null };
}

export function sendOk<T>(res: Response, data: T, message = 'ok') {
  res.json(ok(data, message));
}

export function sendFail(res: Response, message: string, status = 400, code = 1) {
  res.status(status).json(fail(message, code));
}
