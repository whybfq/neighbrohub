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
  DISTRIBUTION: '/pages/distribution/distribution',
  POINTS: '/pages/points/points'
};

// ==================== 积分系统常量 ====================

// 积分获取规则：1元 = 1积分
export const POINTS_PER_YUAN = 1;

// 积分服务分类
export const POINTS_SERVICE_CATEGORY = {
  CLEANING: 'cleaning',       // 保洁服务
  CAR_WASH: 'car_wash',       // 洗车服务
  PROPERTY_FEE: 'property_fee', // 免物业费
  OTHER: 'other'              // 其他服务
};

// 积分服务分类中文
export const POINTS_SERVICE_CATEGORY_TEXT = {
  [POINTS_SERVICE_CATEGORY.CLEANING]: '保洁服务',
  [POINTS_SERVICE_CATEGORY.CAR_WASH]: '洗车服务',
  [POINTS_SERVICE_CATEGORY.PROPERTY_FEE]: '免物业费',
  [POINTS_SERVICE_CATEGORY.OTHER]: '其他服务'
};

// 积分记录类型
export const POINTS_RECORD_TYPE = {
  EARN: 'earn',   // 获取
  SPEND: 'spend'  // 消费
};
