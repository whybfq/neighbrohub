/**
 * 邻选·购 — 全局常量与功能开关
 *
 * MVP_FEATURES：false 的入口在 UI 层隐藏，勿在文档中写「已上线」。
 * BUSINESS_RULES：起送价、配送费等，应与 server/src/config/delivery.ts 一致。
 * PAGE_PATH：与 app.config.ts 页面路径保持同步。
 */
// API 基础地址（开发见 config/dev.js，生产见 config/prod.js 的 TARO_APP_API）
export const API_BASE_URL = process.env.TARO_APP_API || 'http://localhost:8090/api/v1';

/** 设为 true 时走本地 Mock，不请求后端 */
export const USE_MOCK_API = false;

// 图片资源基础地址（生产请改为 OSS/CDN）
export const IMG_BASE_URL = process.env.TARO_APP_CDN || 'https://cdn.linshe.com';

// MVP 功能开关
export const MVP_FEATURES = {
  DISTRIBUTION: false,
  POINTS: true,
  COUPONS: false,
  /** 消息 / 设置 / 帮助等未完成二级菜单 */
  SECONDARY_MENU: false,
  /** 首页限时秒杀区块 */
  FLASH_SALE: true,
};

// 服务范围（MVP 单仓 · 山屿西山著东/西区）
export const MVP_ZONES = [
  { id: 'EAST', name: '东区', buildingCount: 21, unitsPerBuilding: 3 },
  { id: 'WEST', name: '西区', buildingCount: 17, unitsPerBuilding: 3 },
] as const;

export const MVP_COMMUNITY = {
  id: 'C001',
  name: '山屿西山著',
  warehouseName: '山屿西山著地下仓',
  address: '北京市海淀区山屿西山著',
  etaMinutes: 120,
  businessOpen: '08:00',
  businessClose: '21:00',
};

/** 格式化配送地址：山屿西山著东区 3栋 2单元 501室 */
export const formatMvpAddress = (
  zoneName: string,
  building: string,
  unit?: string,
  room?: string
): string => {
  const base = `山屿西山著${zoneName} ${building}`;
  if (unit && room) return `${base} ${unit} ${room}室`;
  if (unit) return `${base} ${unit}`;
  return base;
};

export const MVP_LOCATION_LABEL = `${MVP_COMMUNITY.name}（${MVP_ZONES.map((z) => z.name).join('·')}）`;

// 业务规则（MVP 可后台配置）
export const BUSINESS_RULES = {
  minOrderAmount: 1,              // 起送价 ¥1
  deliveryFee: 1,                 // 配送费 ¥1（自配免）
  courierFeePerOrder: 5,          // 配送员每单收入
  maxConcurrentOrders: 100,       // 配送员同时持单上限
  unpaidTimeoutMinutes: 15,
  pickupTimeoutMinutes: 20,
};

export const ORDER_STATUS = {
  PENDING_PAY: 'pending_pay',
  PAID: 'paid',
  PICKING: 'picking',
  PACKED: 'packed',
  DISPATCHING: 'dispatching',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDING: 'refunding',
  REFUNDED: 'refunded',
  // 兼容旧数据
  PENDING_DELIVER: 'pending_deliver',
  CLOSED: 'closed',
};

// 订单状态中文映射
export const ORDER_STATUS_TEXT: Record<string, string> = {
  [ORDER_STATUS.PENDING_PAY]: '待付款',
  [ORDER_STATUS.PAID]: '备货中',
  [ORDER_STATUS.PICKING]: '拣货中',
  [ORDER_STATUS.PACKED]: '待配送',
  [ORDER_STATUS.DISPATCHING]: '已接单',
  [ORDER_STATUS.DELIVERING]: '配送中',
  [ORDER_STATUS.DELIVERED]: '已送达',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.REFUNDING]: '退款中',
  [ORDER_STATUS.REFUNDED]: '已退款',
  [ORDER_STATUS.PENDING_DELIVER]: '备货中',
  [ORDER_STATUS.CLOSED]: '已关闭',
};

// 订单列表 Tab 分组
export const ORDER_LIST_TABS = [
  { key: 'all', label: '全部' },
  { key: ORDER_STATUS.PENDING_PAY, label: '待付款' },
  { key: 'preparing', label: '备货中' },
  { key: 'delivering', label: '配送中' },
  { key: ORDER_STATUS.COMPLETED, label: '已完成' },
];

export const ORDER_TAB_STATUS_GROUPS: Record<string, string[]> = {
  preparing: [
    ORDER_STATUS.PAID,
    ORDER_STATUS.PICKING,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.PENDING_DELIVER,
  ],
  delivering: [
    ORDER_STATUS.DISPATCHING,
    ORDER_STATUS.DELIVERING,
    ORDER_STATUS.DELIVERED,
  ],
};

// 可查看配送追踪的状态
export const TRACKABLE_ORDER_STATUSES = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PICKING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.DISPATCHING,
  ORDER_STATUS.DELIVERING,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.PENDING_DELIVER,
];

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
  DETAIL: '/pages/detail/index',
  CART: '/pages/cart/index',
  ORDER: '/pages/order/index',
  ORDERS: '/pages/orders/index',
  PROFILE: '/pages/profile/index',
  LOGIN: '/pages/login/index',
  BIND_COMMUNITY: '/pages/bind-community/index',
  DISTRIBUTION: '/pages/distribution/index',
  POINTS: '/pages/points/index',
  TRACK: '/pages/track/index',
  ADDRESS: '/pages/address/index',
  CATEGORY: '/pages/category/index',
};

// ==================== 仓储系统常量 ====================

// 仓储类型（地下仓库）
export const STORAGE_TYPE = {
  COLD_CHAIN: 'cold_chain',       // 冷链仓（冷藏/冷冻，2-8°C / -18°C）
  NORMAL: 'normal',               // 常温仓（恒温恒湿，15-25°C）
  DRY: 'dry'                      // 干燥仓（低湿度，适合干货）
};

export const STORAGE_TYPE_TEXT: Record<string, string> = {
  [STORAGE_TYPE.COLD_CHAIN]: '冷链仓',
  [STORAGE_TYPE.NORMAL]: '常温仓',
  [STORAGE_TYPE.DRY]: '干燥仓'
};

export const STORAGE_TYPE_ICON: Record<string, string> = {
  [STORAGE_TYPE.COLD_CHAIN]: '❄️',
  [STORAGE_TYPE.NORMAL]: '🏭',
  [STORAGE_TYPE.DRY]: '☀️'
};

// 保质期分类
export const SHELF_LIFE_CATEGORY = {
  LONG_TERM: 'long_term',       // 长保质期（>12个月）：水、啤酒、方便面等
  MEDIUM_TERM: 'medium_term',   // 中等保质期（3-12个月）：调味品、干货等
  SHORT_TERM: 'short_term'      // 短保质期（<3个月）：生鲜、乳制品等
};

export const SHELF_LIFE_CATEGORY_TEXT: Record<string, string> = {
  [SHELF_LIFE_CATEGORY.LONG_TERM]: '长保质期',
  [SHELF_LIFE_CATEGORY.MEDIUM_TERM]: '中等保质期',
  [SHELF_LIFE_CATEGORY.SHORT_TERM]: '短保质期'
};

export const SHELF_LIFE_CATEGORY_COLOR: Record<string, string> = {
  [SHELF_LIFE_CATEGORY.LONG_TERM]: '#52c41a',
  [SHELF_LIFE_CATEGORY.MEDIUM_TERM]: '#fa8c16',
  [SHELF_LIFE_CATEGORY.SHORT_TERM]: '#ff4d4f'
};

// 最佳赏味期状态
export const TASTE_PERIOD_STATUS = {
  PRIME: 'prime',         // 最佳赏味期（生产后1/3时间内）
  NORMAL: 'normal',       // 正常可食用
  APPROACHING: 'approaching' // 临近保质期（最后1/4时间）
};

export const TASTE_PERIOD_STATUS_TEXT: Record<string, string> = {
  [TASTE_PERIOD_STATUS.PRIME]: '最佳赏味期',
  [TASTE_PERIOD_STATUS.NORMAL]: '正常食用期',
  [TASTE_PERIOD_STATUS.APPROACHING]: '临近保质期'
};

export const TASTE_PERIOD_STATUS_COLOR: Record<string, string> = {
  [TASTE_PERIOD_STATUS.PRIME]: '#52c41a',
  [TASTE_PERIOD_STATUS.NORMAL]: '#1890ff',
  [TASTE_PERIOD_STATUS.APPROACHING]: '#fa8c16'
};

// ==================== 积分系统常量 ====================

// 积分获取规则：1元 = 1积分
export const POINTS_PER_YUAN = 1;

// 免物业费所需积分
export const PROPERTY_FEE_POINTS = 30000;

// 积分服务分类
export const POINTS_SERVICE_CATEGORY = {
  CLEANING: 'cleaning',
  AC_CLEANING: 'ac_cleaning',
  COOKING: 'cooking',
  PROPERTY_FEE: 'property_fee',
  OTHER: 'other',
};

// 积分服务分类中文
export const POINTS_SERVICE_CATEGORY_TEXT = {
  [POINTS_SERVICE_CATEGORY.CLEANING]: '保洁服务',
  [POINTS_SERVICE_CATEGORY.AC_CLEANING]: '空调清洗',
  [POINTS_SERVICE_CATEGORY.COOKING]: '做饭服务',
  [POINTS_SERVICE_CATEGORY.PROPERTY_FEE]: '免物业费',
  [POINTS_SERVICE_CATEGORY.OTHER]: '其他服务',
};

// 积分记录类型
export const POINTS_RECORD_TYPE = {
  EARN: 'earn',   // 获取
  SPEND: 'spend'  // 消费
};
