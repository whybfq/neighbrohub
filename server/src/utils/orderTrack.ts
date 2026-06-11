import { store } from '../store/index.js';

function nowStr() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/** 推进配送追踪时间轴（timeline 自上而下：delivered → delivering → packed/picking → paid） */
export function advanceOrderTrack(
  orderId: string,
  step: 'paid' | 'picking' | 'packed' | 'delivering' | 'delivered',
  extra?: { status?: string; courier?: object | null }
) {
  const track = store.orderTracks[orderId] as any;
  if (!track) return;

  const stepRank: Record<string, number> = {
    paid: 0,
    picking: 1,
    packed: 2,
    delivering: 3,
    delivered: 4,
  };
  const time = nowStr();

  if (extra?.status) track.status = extra.status;
  if (extra?.courier !== undefined) track.courier = extra.courier;

  const tl = track.timeline as any[];
  if (!tl?.length) return;

  const resolveTargetStep = (s: string) => {
    if (s === 'packed' && !tl.some((t) => t.step === 'packed')) return 'picking';
    return s;
  };
  const resolvedStep = resolveTargetStep(step);
  const resolvedRank = stepRank[resolvedStep];
  if (resolvedRank === undefined) return;

  tl.forEach((t) => {
    const rank = stepRank[t.step];
    if (rank === undefined) return;
    if (rank < resolvedRank) {
      t.done = true;
      t.current = false;
      if (!t.time) t.time = time;
    } else if (rank === resolvedRank) {
      t.done = true;
      t.current = true;
      t.time = time;
    } else {
      t.done = false;
      t.current = false;
    }
  });
}

export function findOrderIdByOrderNo(orderNo: string): string | null {
  const order = store.orders.find((o: any) => o.orderNo === orderNo);
  return order?.id || null;
}
