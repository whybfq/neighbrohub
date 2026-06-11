/**
 * 统一 JSON 响应格式，与三端 request 封装约定一致。
 *
 * 成功: { code: 0, message: 'ok', data: T }
 * 失败: { code: 1, message: '...', data: null } + HTTP 4xx/5xx
 */
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
