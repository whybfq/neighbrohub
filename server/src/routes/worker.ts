import { Router } from 'express';
import { sendFail, sendOk } from '../common/response.js';
import { pickDetail } from '../data/seed.js';
import { store } from '../store/index.js';

const router = Router();

router.post('/worker/login', (_req, res) => {
  sendOk(res, { token: `worker_${Date.now()}`, user: store.workerUser });
});

router.get('/worker/profile', (_req, res) => {
  sendOk(res, store.workerUser);
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
  });
});

router.put('/worker/online', (req, res) => {
  store.workerOnline = req.body?.online !== false;
  sendOk(res, { online: store.workerOnline });
});

router.get('/wms/inbound/recent', (_req, res) => {
  sendOk(res, store.inboundRecords);
});

router.post('/wms/inbound', (req, res) => {
  const rec = {
    id: `IB${Date.now()}`,
    skuName: req.body?.name || '未知商品',
    qty: req.body?.qty || 1,
    location: req.body?.location || 'A-001',
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
  sendOk(res, { ...pickDetail, taskId: req.params.id });
});

router.post('/wms/pick/tasks/:id/complete', (req, res) => {
  const task = store.pickTasks.find((t: any) => t.id === req.params.id);
  if (task) {
    store.pickTasks = store.pickTasks.filter((t: any) => t.id !== req.params.id);
    const order = store.orders.find((o: any) => o.orderNo === task.orderNo);
    if (order) order.status = 'packed';
    store.deliveryPool.unshift({
      id: `DT${Date.now()}`,
      orderNo: task.orderNo,
      address: task.address,
      zoneId: task.zoneId,
      itemCount: task.itemCount,
      fee: 5,
      waitingMinutes: 0,
    });
  }
  sendOk(res, { pickupCode: `PICK:${req.params.id}`, orderStatus: 'packed' });
});

router.get('/delivery/pool', (_req, res) => {
  sendOk(res, {
    online: store.workerOnline,
    list: store.deliveryPool,
    holdingCount: store.holdingCount,
    maxHold: 100,
  });
});

router.get('/delivery/active', (_req, res) => {
  sendOk(res, store.activeDelivery);
});

router.post('/delivery/tasks/:id/grab', (req, res) => {
  if (!store.workerOnline) return sendFail(res, '请先上线');
  if (store.holdingCount >= 100) return sendFail(res, '已达持单上限');
  const idx = store.deliveryPool.findIndex((d: any) => d.id === req.params.id);
  if (idx >= 0) {
    const [task] = store.deliveryPool.splice(idx, 1);
    store.activeDelivery = { ...task, status: 'delivering', signCode: String(Math.floor(100000 + Math.random() * 900000)) };
    store.holdingCount += 1;
    const order = store.orders.find((o: any) => o.orderNo === task.orderNo);
    if (order) order.status = 'delivering';
  }
  sendOk(res, { success: true });
});

router.post('/delivery/tasks/:id/deliver', (req, res) => {
  const { signCode } = req.body || {};
  if (store.activeDelivery?.signCode && signCode && signCode !== store.activeDelivery.signCode) {
    return sendFail(res, '签收码错误');
  }
  const order = store.orders.find((o: any) => o.orderNo === store.activeDelivery?.orderNo);
  if (order) order.status = 'delivered';
  store.holdingCount = Math.max(0, store.holdingCount - 1);
  store.activeDelivery = null;
  sendOk(res, { success: true });
});

export default router;
