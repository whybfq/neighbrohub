import {
  addresses as seedAddresses,
  adminProducts as seedAdminProducts,
  community,
  couriers as seedCouriers,
  deliveryPool as seedDeliveryPool,
  activeDelivery as seedActiveDelivery,
  inboundRecords as seedInboundRecords,
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
  holdingCount: 1,
};

export function nextOrderNo() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${String(Math.floor(Math.random() * 900) + 100)}`;
}

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
