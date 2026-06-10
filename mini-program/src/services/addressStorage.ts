import Taro from '@tarojs/taro';
import { mockAddresses } from './mockData';

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  zone: string;
  zoneId: string;
  buildingId?: string;
  buildingName?: string;
  unit?: string;
  room?: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'user_addresses';

export const getStoredAddresses = (): UserAddress[] => {
  const stored = Taro.getStorageSync(STORAGE_KEY);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  return mockAddresses.map((addr) => ({
    ...addr,
    zoneId: addr.zone === '西区' ? 'WEST' : 'EAST',
  }));
};

export const saveAddresses = (addresses: UserAddress[]) => {
  Taro.setStorageSync(STORAGE_KEY, addresses);
};

export const addAddress = (address: UserAddress, setDefault = true): UserAddress[] => {
  const list = getStoredAddresses();
  const next = setDefault
    ? list.map((item) => ({ ...item, isDefault: false }))
    : [...list];
  next.unshift({ ...address, isDefault: setDefault });
  saveAddresses(next);
  return next;
};

export const updateAddress = (id: string, data: Partial<UserAddress>): UserAddress[] => {
  const list = getStoredAddresses().map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  saveAddresses(list);
  return list;
};

export const setDefaultAddress = (id: string): UserAddress[] => {
  const list = getStoredAddresses().map((item) => ({
    ...item,
    isDefault: item.id === id,
  }));
  saveAddresses(list);
  return list;
};

export const deleteAddress = (id: string): UserAddress[] => {
  let list = getStoredAddresses().filter((item) => item.id !== id);
  if (list.length > 0 && !list.some((item) => item.isDefault)) {
    list[0] = { ...list[0], isDefault: true };
  }
  saveAddresses(list);
  return list;
};

export const getDefaultAddress = (): UserAddress | null => {
  const list = getStoredAddresses();
  return list.find((item) => item.isDefault) || list[0] || null;
};
