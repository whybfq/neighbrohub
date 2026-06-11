/**
 * 作业端 API（邻选·作业 · worker-mini-program）
 *
 * 模块：骑手登录/注册、入库 WMS、分拣、抢单配送。
 * 自配规则：order.customerId === workerUser.consumerUserId 且 order.selfDelivery
 *           → 抢单 fee=0，消费者端已免配送费。
 */
import { Router } from 'express';
import { sendFail, sendOk } from '../common/response.js';
import { DELIVERY_BUSINESS, calcCourierFee } from '../config/delivery.js';
import { pickDetail } from '../data/seed.js';
import { store } from '../store/index.js';
import {
  ensureWorkerCourierActive,
  getConsumerUserId,
  getWorkerConsumerLink,
  linkWorkerToConsumer,
} from '../utils/auth.js';
import { advanceOrderTrack } from '../utils/orderTrack.js';

const router = Router();

/** 为抢单池条目附加 isOwnOrder、展示用 fee 与提示文案 */
function enrichPoolItem(task: any) {
  const order = store.orders.find((o: any) => o.orderNo === task.orderNo);
  const linkId = getWorkerConsumerLink();
  const isOwnOrder = !!(order && linkId && order.customerId === linkId);
  return {
    ...task,
    isOwnOrder,
    selfDeliveryHint: isOwnOrder ? '自配单 · 已免配送费' : undefined,
    fee: calcCourierFee(isOwnOrder),
  };
}

router.post('/worker/login', (req, res) => {
  const { consumerUserId, nickname, phone } = req.body || {};
  if (consumerUserId) {
    linkWorkerToConsumer(String(consumerUserId));
  } else if (phone && phone === store.user.phone) {
    linkWorkerToConsumer(store.user.id);
  }
  if (nickname) store.workerUser.nickname = nickname;
  if (phone) store.workerUser.phone = phone;
  ensureWorkerCourierActive();
  store.workerUser.openRegistered = true;
  sendOk(res, {
    token: `worker_${Date.now()}`,
    user: store.workerUser,
    deliveryRules: DELIVERY_BUSINESS,
  });
});

/** 开放注册：MVP 即时激活 courierStatus，写入 couriers 列表 */
router.post('/worker/register', (req, res) => {
  const { nickname, phone, consumerUserId } = req.body || {};
  if (nickname) store.workerUser.nickname = nickname;
  if (phone) store.workerUser.phone = phone;
  if (consumerUserId) {
    linkWorkerToConsumer(String(consumerUserId));
  } else {
    const cid = getConsumerUserId(req);
    if (cid) linkWorkerToConsumer(cid);
    else if (phone && phone === store.user.phone) linkWorkerToConsumer(store.user.id);
  }
  ensureWorkerCourierActive();
  store.workerUser.openRegistered = true;
  sendOk(res, {
    user: store.workerUser,
    message: '骑手注册成功，可上线接单。自配自己的订单不收配送费。',
    deliveryRules: DELIVERY_BUSINESS,
  });
});

router.get('/worker/profile', (_req, res) => {
  sendOk(res, {
    ...store.workerUser,
    deliveryRules: DELIVERY_BUSINESS,
  });
});

router.get('/worker/dashboard', (_req, res) => {
  sendOk(res, {
    todayInbound: 28,
    todayPick: 45,
    todayDelivery: 18,
    todayEarnings: 90,
    pendingPick: store.pickTasks.length,
    pendingDelivery: store.deliveryPool.length,
    holdingCount: store.holdingCount,
    maxHold: 100,
    courierRegistered: store.workerUser.courierStatus === 'active',
  });
});

router.put('/worker/online', (req, res) => {
  if (store.workerUser.courierStatus !== 'active') {
    return sendFail(res, '请先注册成为骑手', 403);
  }
  store.workerOnline = req.body?.online !== false;
  sendOk(res, { online: store.workerOnline });
});

router.get('/wms/inbound/recent', (_req, res) => {
  sendOk(res, store.inboundRecords);
});

router.post('/wms/inbound', (req, res) => {
  const body = req.body || {};
  const qty = body.qty ?? body.quantity ?? 1;
  const rec = {
    id: `IB${Date.now()}`,
    category: body.category || '未分类',
    brand: body.brand || '-',
    spec: body.spec || '-',
    skuName: body.name || body.skuName || '未知商品',
    name: body.name || body.skuName || '未知商品',
    qty,
    location: body.location || 'A-001',
    operator: store.workerUser.nickname,
    time: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };
  store.inboundRecords.unshift(rec);
  sendOk(res, rec);
});

router.get('/wms/pick/tasks', (_req, res) => {
  sendOk(res, store.pickTasks);
});

router.get('/wms/pick/tasks/:id', (req, res) => {
  const task = store.pickTasks.find((t: any) => t.id === req.params.id);
  if (!task) return sendFail(res, '分拣任务不存在', 404);
  const order = store.orders.find((o: any) => o.orderNo === task.orderNo);
  const items = order?.items?.length
    ? order.items.map((it: any, idx: number) => ({
        skuId: it.skuId || `SKU${idx}`,
        name: `${it.productName || it.name || '商品'} ×${it.quantity || 1}`,
        location: idx % 2 === 0 ? 'A-012' : 'B-003',
        zone: idx % 2 === 0 ? 'normal' : 'cold',
        picked: false,
      }))
    : pickDetail.items;
  sendOk(res, {
    taskId: task.id,
    orderNo: task.orderNo,
    address: task.address,
    zoneId: task.zoneId,
    items,
  });
});

router.post('/wms/pick/tasks/:id/complete', (req, res) => {
  const task = store.pickTasks.find((t: any) => t.id === req.params.id);
  if (task) {
    store.pickTasks = store.pickTasks.filter((t: any) => t.id !== req.params.id);
    const order = store.orders.find((o: any) => o.orderNo === task.orderNo);
    if (order) {
      order.status = 'packed';
      advanceOrderTrack(order.id, 'packed', { status: 'packed' });
    }
    const linkId = getWorkerConsumerLink();
    const isOwnOrder = !!(order && linkId && order.customerId === linkId);
    store.deliveryPool.unshift({
      id: `DT${Date.now()}`,
      orderNo: task.orderNo,
      address: task.address,
      zoneId: task.zoneId,
      itemCount: task.itemCount,
      fee: calcCourierFee(false),
      waitingMinutes: 0,
      ...(order ? { customerId: order.customerId, orderId: order.id } : {}),
    } as any);
  }
  sendOk(res, { pickupCode: `PICK:${req.params.id}`, orderStatus: 'packed' });
});

router.get('/delivery/pool', (_req, res) => {
  sendOk(res, {
    online: store.workerOnline,
    list: store.deliveryPool.map(enrichPoolItem),
    holdingCount: store.holdingCount,
    maxHold: 100,
    consumerUserId: getWorkerConsumerLink(),
    deliveryRules: DELIVERY_BUSINESS,
  });
});

router.get('/delivery/active', (_req, res) => {
  const active = store.activeDelivery;
  if (!active) return sendOk(res, null);
  const order = store.orders.find((o: any) => o.orderNo === active.orderNo);
  sendOk(res, {
    ...active,
    orderId: order?.id,
    isSelfDelivery: !!(active as any).isSelfDelivery,
  });
});

/** 抢单：自配单须下单时勾选 selfDelivery；更新订单与追踪时间轴 */
router.post('/delivery/tasks/:id/grab', (req, res) => {
  if (store.workerUser.courierStatus !== 'active') {
    return sendFail(res, '请先注册成为骑手', 403);
  }
  if (!store.workerOnline) return sendFail(res, '请先上线');
  if (store.holdingCount >= 100) return sendFail(res, '已达持单上限');
  const idx = store.deliveryPool.findIndex((d: any) => d.id === req.params.id);
  if (idx < 0) return sendFail(res, '订单不存在或已被抢');
  if (store.activeDelivery) return sendFail(res, '请先完成当前配送订单');
  const [task] = store.deliveryPool.splice(idx, 1);
  const order = store.orders.find((o: any) => o.orderNo === task.orderNo);
  const linkId = getWorkerConsumerLink();
  const isOwnOrder = !!(order && linkId && order.customerId === linkId);

  if (isOwnOrder) {
    if (!order.selfDelivery) {
      return sendFail(res, '该订单未选择自配送，无法接自己的单');
    }
  }

  store.activeDelivery = {
    ...task,
    status: 'delivering',
    signCode: order?.signCode || String(Math.floor(100000 + Math.random() * 900000)),
    isSelfDelivery: isOwnOrder,
    fee: calcCourierFee(isOwnOrder),
  } as any;
  store.holdingCount += 1;
  if (order) {
    order.status = 'delivering';
    order.courier = {
      name: store.workerUser.nickname,
      phone: store.workerUser.phone,
      selfDelivery: isOwnOrder,
    } as any;
    advanceOrderTrack(order.id, 'delivering', {
      status: 'delivering',
      courier: order.courier,
    });
    if (store.orderTracks[order.id]) {
      (store.orderTracks[order.id] as any).courier = order.courier;
    }
  }
  sendOk(res, {
    success: true,
    isSelfDelivery: isOwnOrder,
    message: isOwnOrder ? '自配单抢单成功，配送费已免除' : '抢单成功',
  });
});

/** 送达：必须输入正确 6 位签收码（与订单 signCode 一致） */
router.post('/delivery/tasks/:id/deliver', (req, res) => {
  const { signCode } = req.body || {};
  if (!store.activeDelivery) return sendFail(res, '无进行中的配送任务', 400);
  if (!signCode) return sendFail(res, '请输入签收码');
  if (store.activeDelivery.signCode !== signCode) {
    return sendFail(res, '签收码错误');
  }
  const order = store.orders.find((o: any) => o.orderNo === store.activeDelivery?.orderNo);
  if (order) {
    order.status = 'delivered';
    advanceOrderTrack(order.id, 'delivered', { status: 'delivered' });
  }
  store.holdingCount = Math.max(0, store.holdingCount - 1);
  store.activeDelivery = null;
  sendOk(res, { success: true });
});

export default router;
