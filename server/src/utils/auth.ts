import { store } from '../store/index.js';

/** 从 Authorization 解析 MVP 用户标识（内存演示） */
export function getBearerToken(req: { headers: Record<string, string | string[] | undefined> }): string {
  const raw = req.headers.authorization || req.headers.Authorization || '';
  const s = Array.isArray(raw) ? raw[0] : raw;
  return s.replace(/^Bearer\s+/i, '').trim();
}

export function getConsumerUserId(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const token = getBearerToken(req);
  if (token.startsWith('consumer_')) return store.user.id;
  const link = req.headers['x-consumer-user-id'] || req.headers['X-Consumer-User-Id'];
  if (link) return Array.isArray(link) ? link[0] : String(link);
  return null;
}

export function getWorkerConsumerLink(): string | null {
  return store.workerUser.consumerUserId || null;
}

export function ensureWorkerCourierActive() {
  if (store.workerUser.courierStatus !== 'active') {
    store.workerUser.courierStatus = 'active';
    const roles = new Set([...(store.workerUser.roles || []), 'delivery']);
    store.workerUser.roles = [...roles];
  }
  const exists = store.couriers.some((c: any) => c.id === store.workerUser.id);
  if (!exists) {
    store.couriers.unshift({
      id: store.workerUser.id,
      name: store.workerUser.nickname,
      phone: store.workerUser.phone,
      roles: store.workerUser.roles,
      status: 'active',
      holdingCount: 0,
      todayDelivery: 0,
      appliedAt: new Date().toISOString().slice(0, 10),
      openRegister: true,
    } as any);
  }
}

export function linkWorkerToConsumer(consumerUserId: string) {
  store.workerUser.consumerUserId = consumerUserId;
  ensureWorkerCourierActive();
}
