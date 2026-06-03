// API 基础地址配置
export const API_BASE_URL = 'https://api.linshe.com/v1';

// 图片资源基础地址
export const IMG_BASE_URL = 'https://cdn.linshe.com';

// 订单状态枚举
export const ORDER_STATUS = {
  PENDING_PAY: 'pending_pay',       // 待付款
  PENDING_DELIVER: 'pending_deliver', // 待发货
  DELIVERING: 'delivering',         // 配送中
  COMPLETED: 'completed',           // 已完成
  REFUNDING: 'refunding',           // 退款中
  REFUNDED: 'refunded',             // 已退款
  CLOSED: 'closed'                  // 已关闭
};

// 订单状态中文映射
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAY]: '待付款',
  [ORDER_STATUS.PENDING_DELIVER]: '待发货',
  [ORDER_STATUS.DELIVERING]: '配送中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.REFUNDING]: '退款中',
  [ORDER_STATUS.REFUNDED]: '已退款',
  [ORDER_STATUS.CLOSED]: '已关闭'
};

// 用户角色
export const USER_ROLE = {
  USER: 'user',
  BUILDING_LEADER: 'building_leader',  // 楼长
  COMMUNITY_LEADER: 'community_leader', // 团长
  ADMIN: 'admin'
};

// 分销佣金比例（可后台配置）
export const COMMISSION_RATE = {
  BUILDING_LEADER: 0.05,    // 楼长 5%
  COMMUNITY_LEADER: 0.03,   // 团长 3%
};

// 配送方式
export const DELIVERY_TYPE = {
  SELF_PICKUP: 'self_pickup',   // 团长自提
  DOOR_DELIVERY: 'door_delivery' // 送货上门
};

// 支付方式
export const PAYMENT_METHOD = {
  WECHAT_PAY: 'wechat_pay'
};

// 页面路径
export const PAGE_PATH = {
  INDEX: '/pages/index/index',
  DETAIL: '/pages/detail/detail',
  CART: '/pages/cart/cart',
  ORDER: '/pages/order/order',
  ORDERS: '/pages/orders/orders',
  PROFILE: '/pages/profile/profile',
  LOGIN: '/pages/login/login',
  BIND_COMMUNITY: '/pages/bind-community/bind-community',
  DISTRIBUTION: '/pages/distribution/distribution'
};
