import { Router } from 'express';
import { sendFail, sendOk } from '../common/response.js';
import { community } from '../data/seed.js';
import { getDashboard, getInventory, store } from '../store/index.js';

const router = Router();

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'admin123') {
    sendOk(res, { token: `admin_${Date.now()}`, name: '运营管理员' });
    return;
  }
  sendFail(res, '账号或密码错误', 401);
});

router.get('/admin/dashboard', (_req, res) => {
  sendOk(res, getDashboard());
});

router.get('/admin/products', (_req, res) => {
  sendOk(res, store.adminProducts);
});

router.put('/admin/products/:id/status', (req, res) => {
  const p = store.adminProducts.find((x: any) => x.id === req.params.id);
  if (!p) return sendFail(res, '商品不存在', 404);
  p.status = p.status === 'on' ? 'off' : 'on';
  const consumer = store.products.find((x: any) => x.id === req.params.id);
  if (consumer) {
    consumer.status = p.status;
  }
  sendOk(res, p);
});

router.get('/admin/inventory', (_req, res) => {
  sendOk(res, getInventory());
});

router.get('/admin/inbound', (_req, res) => {
  sendOk(res, store.inboundRecords);
});

router.get('/admin/orders', (req, res) => {
  let list = store.orders.map((o: any) => ({
    id: o.id,
    orderNo: o.orderNo,
    status: o.status,
    zone: o.zone,
    address: o.addressShort || o.address,
    customer: o.customer,
    amount: o.payAmount || o.amount,
    itemCount: o.itemCount,
    picker: o.picker || '-',
    courier: o.courier?.name || '-',
    createdAt: o.createdAt,
  }));
  if (req.query.status && req.query.status !== 'all') {
    list = list.filter((o) => o.status === req.query.status);
  }
  sendOk(res, list);
});

router.put('/admin/orders/:id/status', (req, res) => {
  const order = store.orders.find((o: any) => o.id === req.params.id);
  if (!order) return sendFail(res, '订单不存在', 404);
  order.status = req.body?.status || order.status;
  sendOk(res, order);
});

router.get('/admin/couriers', (_req, res) => {
  sendOk(res, store.couriers);
});

router.put('/admin/couriers/:id/approve', (req, res) => {
  const c = store.couriers.find((x: any) => x.id === req.params.id);
  if (!c) return sendFail(res, '配送员不存在', 404);
  c.status = 'active';
  sendOk(res, c);
});

router.put('/admin/couriers/:id/suspend', (req, res) => {
  const c = store.couriers.find((x: any) => x.id === req.params.id);
  if (!c) return sendFail(res, '配送员不存在', 404);
  c.status = 'suspended';
  sendOk(res, c);
});

router.get('/admin/warehouse', (_req, res) => {
  sendOk(res, {
    id: community.id,
    name: community.name,
    warehouseId: community.warehouse.id,
    warehouseName: community.warehouse.name,
    address: `${community.address} 地下车库 B1`,
    zones: community.zones.map((z) => z.name),
    businessOpen: community.businessHours.open,
    businessClose: community.businessHours.close,
  });
});

export default router;
