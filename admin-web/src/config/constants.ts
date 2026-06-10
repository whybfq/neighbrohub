export const MVP_COMMUNITY = {
  id: 'C001',
  name: '山屿西山著',
  warehouseId: 'WH001',
  warehouseName: '山屿西山著地下仓',
  address: '北京市海淀区山屿西山著 地下车库 B1',
  zones: ['东区', '西区'],
  businessOpen: '08:00',
  businessClose: '21:00',
};

export const ORDER_STATUS_TEXT: Record<string, string> = {
  pending_pay: '待付款',
  paid: '备货中',
  picking: '拣货中',
  packed: '待配送',
  dispatching: '已接单',
  delivering: '配送中',
  delivered: '已送达',
  completed: '已完成',
  cancelled: '已取消',
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending_pay: 'orange',
  paid: 'blue',
  picking: 'processing',
  packed: 'purple',
  dispatching: 'cyan',
  delivering: 'green',
  delivered: 'success',
  completed: 'default',
  cancelled: 'default',
};

export const API_BASE = '/api/v1';
