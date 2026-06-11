/**
 * 配送费与骑手收入规则（权威来源，小程序 constants 应对齐）
 *
 * - 消费者默认付 consumerDeliveryFee（自配时 0）
 * - 骑手接他人单得 courierRewardPerOrder；接自己的单得 selfDeliveryCourierReward
 */
/** 配送业务规则（与服务端、小程序 constants 对齐） */
export const DELIVERY_BUSINESS = {
  /** 消费者下单配送费（元） */
  consumerDeliveryFee: 1,
  /** 骑手配送他人订单每单收入（元） */
  courierRewardPerOrder: 5,
  /** 自配单骑手收入 */
  selfDeliveryCourierReward: 0,
};

export function calcConsumerDeliveryFee(selfDelivery: boolean): number {
  return selfDelivery ? 0 : DELIVERY_BUSINESS.consumerDeliveryFee;
}

export function calcCourierFee(isOwnOrder: boolean): number {
  return isOwnOrder ? DELIVERY_BUSINESS.selfDeliveryCourierReward : DELIVERY_BUSINESS.courierRewardPerOrder;
}
