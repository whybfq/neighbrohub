/**
 * 内存数据仓库（MVP）
 *
 * 启动时从 seed.ts 深拷贝种子数据；所有路由读写此单例。
 * 字段说明：
 * - orders / orderTracks：消费者订单与配送追踪时间轴
 * - pickTasks / deliveryPool / activeDelivery：作业端分拣与抢单池
 * - workerUser / couriers：骑手账号与审核列表
 * - adminProducts / products：后台与消费者端商品（上下架需同步）
 */
import {
  addresses as seedAddresses,
  adminProducts as seedAdminProducts,
  community,
  couriers as seedCouriers,
  deliveryPool as seedDeliveryPool,
  activeDelivery as seedActiveDelivery,
  inboundRecords as seedInboundRecords,
  pointsInfo as seedPointsInfo,
  pointsRecords as seedPointsRecords,
  pointsServices as seedPointsServices,
  pointsExchanges as seedPointsExchanges,
  orders as seedOrders,
  orderTracks,
  pickTasks as seedPickTasks,
  products as seedProducts,
  categories as seedCategories,
  consumerUser,
  workerUser,
  buildDashboard,
} from '../data/seed.js';

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export const store = {
  community: clone(community),
  categories: clone(seedCategories),
  products: clone(seedProducts),
  adminProducts: clone(seedAdminProducts),
  user: clone(consumerUser),
  addresses: clone(seedAddresses),
  orders: clone(seedOrders),
  orderTracks: clone(orderTracks),
  cart: [] as any[],
  workerUser: clone(workerUser),
  workerOnline: true,
  pickTasks: clone(seedPickTasks),
  deliveryPool: clone(seedDeliveryPool),
  activeDelivery: clone(seedActiveDelivery) as typeof seedActiveDelivery | null,
  couriers: clone(seedCouriers),
  inboundRecords: clone(seedInboundRecords),
  pointsInfo: clone(seedPointsInfo),
  pointsRecords: clone(seedPointsRecords),
  pointsServices: clone(seedPointsServices),
  pointsExchanges: clone(seedPointsExchanges),
  holdingCount: 1,
};

/** 生成订单号：YYYYMMDD + 3 位随机数，如 20260608123 */
export function nextOrderNo() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${String(Math.floor(Math.random() * 900) + 100)}`;
}

/** 支付成功后生成 6 位签收码，配送员送达时需输入校验 */
export function genSignCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getDashboard() {
  return buildDashboard();
}

export function getInventory() {
  return store.adminProducts.map((p) => ({
    skuId: p.id,
    category: p.category,
    brand: p.brand,
    spec: p.spec,
    name: p.name,
    location: p.storageZone,
    tempZone: p.tempZone,
    quantity: p.stock,
    available: p.stock,
    reserved: p.id === 'P002' ? 12 : p.id === 'P001' ? 8 : 0,
  }));
}
