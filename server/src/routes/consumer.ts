import { Router } from 'express';
import { sendFail, sendOk } from '../common/response.js';
import { genSignCode, nextOrderNo, store } from '../store/index.js';

const router = Router();

router.get('/health', (_req, res) => {
  sendOk(res, { status: 'up', service: 'neighbrohub-api', version: '0.1.0' });
});

// ---------- 社区 ----------
router.get('/community/info', (_req, res) => {
  sendOk(res, store.community);
});

router.get('/community/current', (_req, res) => {
  sendOk(res, store.community);
});

// ---------- 用户 ----------
router.post('/user/login', (_req, res) => {
  sendOk(res, { token: `consumer_${Date.now()}`, user: store.user });
});

router.get('/user/info', (_req, res) => {
  sendOk(res, store.user);
});

router.post('/user/bind-community', (req, res) => {
  const { fullAddress, zoneId, zoneName, buildingName, unit, room, contactName } = req.body || {};
  if (fullAddress) {
    store.addresses.forEach((a: any) => { a.isDefault = false; });
    store.addresses.unshift({
      id: `A${Date.now()}`,
      name: contactName || store.user.nickname,
      phone: store.user.phone,
      address: fullAddress,
      zone: zoneName,
      zoneId,
      buildingName,
      unit,
      room,
      isDefault: true,
    } as any);
  }
  if (zoneId && zoneName) {
    store.user.zone = { id: zoneId, name: zoneName };
  }
  if (buildingName) {
    store.user.building = { id: `B-${buildingName}`, name: buildingName, unit: unit || '' };
  }
  sendOk(res, { success: true });
});

// ---------- 地址 ----------
router.get('/address/list', (_req, res) => {
  sendOk(res, store.addresses);
});

router.post('/address/add', (req, res) => {
  const data = req.body || {};
  if (data.isDefault !== false) {
    store.addresses.forEach((a: any) => { a.isDefault = false; });
  }
  const addr = { ...data, id: data.id || `A${Date.now()}` };
  store.addresses.unshift(addr);
  sendOk(res, addr);
});

router.put('/address/:id', (req, res) => {
  const { id } = req.params;
  if (req.body?.isDefault) {
    store.addresses.forEach((a: any) => { a.isDefault = a.id === id; });
    sendOk(res, store.addresses);
    return;
  }
  const idx = store.addresses.findIndex((a: any) => a.id === id);
  if (idx < 0) return sendFail(res, '地址不存在', 404);
  store.addresses[idx] = { ...store.addresses[idx], ...req.body };
  sendOk(res, store.addresses[idx]);
});

router.delete('/address/:id', (req, res) => {
  store.addresses = store.addresses.filter((a: any) => a.id !== req.params.id);
  if (store.addresses.length && !store.addresses.some((a: any) => a.isDefault)) {
    store.addresses[0].isDefault = true;
  }
  sendOk(res, store.addresses);
});

// ---------- 商品 ----------
router.get('/products/categories', (_req, res) => {
  sendOk(res, store.categories);
});

router.get('/products/list', (req, res) => {
  let list = store.products.filter((p: any) => p.status !== 'off');
  const categoryId = req.query.categoryId;
  if (categoryId !== undefined && categoryId !== '') {
    list = list.filter((p: any) => String(p.categoryId) === String(categoryId));
  }
  sendOk(res, list);
});

router.get('/products/detail/:id', (req, res) => {
  const p = store.products.find((x: any) => x.id === req.params.id);
  if (!p) return sendFail(res, '商品不存在', 404);
  sendOk(res, p);
});

router.get('/products/flash-sale', (_req, res) => {
  sendOk(res, store.products.slice(0, 2).map((p: any) => ({ ...p, flashPrice: p.price * 0.85 })));
});

// ---------- 购物车（MVP 内存） ----------
router.get('/cart/list', (_req, res) => {
  sendOk(res, store.cart);
});

router.post('/cart/add', (req, res) => {
  const { productId, skuId, quantity = 1 } = req.body || {};
  const product = store.products.find((p: any) => p.id === productId);
  const sku = product?.skus?.find((s: any) => s.id === skuId);
  if (!product || !sku) return sendFail(res, '商品不存在');
  const exist = store.cart.find((c: any) => c.skuId === skuId);
  if (exist) {
    exist.quantity += quantity;
  } else {
    store.cart.push({
      id: `C${Date.now()}`,
      productId,
      skuId,
      productName: product.name,
      productIcon: product.productIcon || product.coverImage,
      skuName: sku.name,
      price: sku.price,
      quantity,
      stock: sku.stock,
      checked: true,
    });
  }
  sendOk(res, { success: true });
});

// ---------- 订单 ----------
router.get('/orders/list', (req, res) => {
  let list = [...store.orders];
  if (req.query.status) {
    list = list.filter((o: any) => o.status === req.query.status);
  }
  sendOk(res, list);
});

router.get('/orders/detail/:id', (req, res) => {
  const o = store.orders.find((x: any) => x.id === req.params.id);
  if (!o) return sendFail(res, '订单不存在', 404);
  sendOk(res, o);
});

router.get('/orders/track/:id', (req, res) => {
  const track = store.orderTracks[req.params.id];
  if (!track) return sendFail(res, '追踪信息不存在', 404);
  sendOk(res, track);
});

router.post('/orders/create', (req, res) => {
  const { items = [], addressId, remark } = req.body || {};
  const address = store.addresses.find((a: any) => a.id === addressId);
  if (!address) return sendFail(res, '请选择收货地址');

  let amount = 0;
  const orderItems = items.map((it: any) => {
    const product = store.products.find((p: any) => p.id === it.productId);
    const sku = product?.skus?.find((s: any) => s.id === it.skuId);
    const price = sku?.price || 0;
    amount += price * (it.quantity || 1);
    return {
      productId: it.productId,
      skuId: it.skuId,
      productName: product?.name,
      productIcon: product?.productIcon,
      skuName: sku?.name,
      price,
      quantity: it.quantity,
    };
  });

  const id = `O${Date.now()}`;
  const orderNo = nextOrderNo();
  const signCode = genSignCode();
  const order = {
    id,
    orderNo,
    status: 'pending_pay',
    zone: address.zone,
    address: address.address,
    addressShort: address.address.replace('山屿西山著', '').trim(),
    customer: address.name,
    contactName: address.name,
    contactPhone: address.phone,
    amount,
    payAmount: amount,
    itemCount: orderItems.reduce((s: number, i: any) => s + i.quantity, 0),
    items: orderItems,
    remark,
    picker: null,
    courier: null,
    signCode,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
  store.orders.unshift(order);
  store.orderTracks[id] = {
    orderNo,
    status: 'pending_pay',
    etaText: '今天 18:00 前',
    signCode,
    address: address.address,
    courier: null,
    timeline: [
      { step: 'delivered', text: '商品已送达', time: null, done: false, current: false },
      { step: 'delivering', text: '配送员正在赶来', time: null, done: false, current: false },
      { step: 'picking', text: '仓库正在拣货', time: null, done: false, current: false },
      { step: 'paid', text: '订单已支付', time: null, done: false, current: true },
    ],
  };
  sendOk(res, { orderId: id, orderNo, payAmount: amount, signCode });
});

router.post('/orders/:id/pay', (req, res) => {
  const order = store.orders.find((o: any) => o.id === req.params.id);
  if (!order) return sendFail(res, '订单不存在', 404);
  order.status = 'paid';
  if (store.orderTracks[order.id]) {
    const track = store.orderTracks[order.id] as any;
    track.status = 'paid';
    const tl = track.timeline as any[];
    tl.forEach((t) => { t.done = t.step === 'paid'; t.current = t.step === 'paid'; });
    const paidStep = tl.find((t) => t.step === 'paid');
    if (paidStep) paidStep.time = new Date().toISOString().replace('T', ' ').slice(0, 19);
  }
  // 支付成功后进入分拣队列
  store.pickTasks.unshift({
    id: `PT${Date.now()}`,
    orderNo: order.orderNo,
    address: order.addressShort || order.address,
    zoneId: order.zone === '西区' ? 'WEST' : 'EAST',
    itemCount: order.itemCount,
    waitingMinutes: 0,
    status: 'pending',
  });
  sendOk(res, { success: true, status: 'paid' });
});

router.put('/orders/:id/cancel', (req, res) => {
  const order = store.orders.find((o: any) => o.id === req.params.id);
  if (!order) return sendFail(res, '订单不存在', 404);
  order.status = 'cancelled';
  sendOk(res, { success: true });
});

router.put('/orders/:id/receive', (req, res) => {
  const order = store.orders.find((o: any) => o.id === req.params.id);
  if (!order) return sendFail(res, '订单不存在', 404);
  order.status = 'completed';

  let pointsEarned = 0;
  if (!(order as any).pointsAwarded) {
    pointsEarned = Math.floor(order.payAmount || order.amount || 0);
    if (pointsEarned > 0) {
      store.pointsInfo.totalPoints += pointsEarned;
      store.pointsInfo.totalEarned += pointsEarned;
      store.pointsRecords.unshift({
        id: `PR${Date.now()}`,
        type: 'earn',
        amount: pointsEarned,
        description: `购物获得 - 订单 ${order.orderNo}`,
        orderNo: order.orderNo,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      });
    }
    (order as any).pointsAwarded = true;
  }

  sendOk(res, { success: true, pointsEarned });
});

// ---------- 积分商城 ----------
router.get('/points/info', (_req, res) => {
  sendOk(res, store.pointsInfo);
});

router.get('/points/records', (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const start = (page - 1) * pageSize;
  sendOk(res, store.pointsRecords.slice(start, start + pageSize));
});

router.get('/points/services', (_req, res) => {
  sendOk(res, store.pointsServices);
});

router.get('/points/exchanges', (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const start = (page - 1) * pageSize;
  sendOk(res, store.pointsExchanges.slice(start, start + pageSize));
});

router.post('/points/exchange', (req, res) => {
  const { serviceId } = req.body || {};
  const service = store.pointsServices.find((s: any) => s.id === serviceId);
  if (!service) return sendFail(res, '服务不存在', 404);
  if (service.stock <= 0) return sendFail(res, '库存不足', 400);
  if (store.pointsInfo.totalPoints < service.pointsPrice) {
    return sendFail(res, `积分不足，还需 ${service.pointsPrice - store.pointsInfo.totalPoints} 积分`, 400);
  }

  store.pointsInfo.totalPoints -= service.pointsPrice;
  store.pointsInfo.totalSpent += service.pointsPrice;
  service.stock -= 1;
  service.sales += 1;

  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const serviceDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const exchange = {
    id: `EX${Date.now()}`,
    serviceName: service.name,
    points: service.pointsPrice,
    status: 'pending',
    serviceDate,
    createdAt: now,
  };
  store.pointsExchanges.unshift(exchange);
  store.pointsRecords.unshift({
    id: `PR${Date.now()}`,
    type: 'spend',
    amount: service.pointsPrice,
    description: `兑换${service.name}`,
    serviceType: service.category,
    createdAt: now,
  });

  sendOk(res, { success: true, message: '兑换成功', exchange });
});

export default router;
