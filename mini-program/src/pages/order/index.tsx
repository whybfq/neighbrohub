import { Component } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { orderApi, userApi } from '../../services/api';
import { mockCoupons } from '../../services/mockData';
import { formatPrice, showToast, formatEtaText, navigateTo, calculatePoints } from '../../utils';
import { BUSINESS_RULES, DELIVERY_TYPE, MVP_COMMUNITY, MVP_FEATURES, PAGE_PATH, POINTS_PER_YUAN } from '../../config/constants';
import './index.scss';

interface State {
  orderItems: any[];
  address: any;
  addresses: any[];
  coupon: any;
  coupons: any[];
  deliveryType: string;
  remark: string;
  totalAmount: number;
  discount: number;
  payAmount: number;
  submitting: boolean;
  showAddressPicker: boolean;
  showCouponPicker: boolean;
  orderInitialized: boolean;
}

export default class OrderPage extends Component<{}, State> {
  state: State = {
    orderItems: [],
    address: null,
    addresses: [],
    coupon: null,
    coupons: mockCoupons,
    deliveryType: DELIVERY_TYPE.DOOR_DELIVERY,
    remark: '',
    totalAmount: 0,
    discount: 0,
    payAmount: 0,
    submitting: false,
    showAddressPicker: false,
    showCouponPicker: false,
    orderInitialized: false,
  };

  componentDidMount() {
    this.initOrderFromStorage();
    this.loadAddresses();
  }

  onShow() {
    this.loadAddresses();
  }

  initOrderFromStorage = () => {
    if (this.state.orderInitialized) return;

    const tempOrder = Taro.getStorageSync('temp_order');
    if (!tempOrder || !tempOrder.items) {
      Taro.showToast({ title: '订单数据异常', icon: 'none' });
      setTimeout(() => Taro.navigateBack(), 1500);
      return;
    }

    const { items } = tempOrder;
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    this.setState({
      orderItems: items,
      totalAmount,
      payAmount: totalAmount,
      orderInitialized: true,
    });

    Taro.removeStorageSync('temp_order');
  };

  loadAddresses = async () => {
    try {
      const addresses = (await userApi.getAddresses()) as any[];
      const address = this.pickPreferredAddress(addresses);
      this.setState({ addresses, address: address || this.state.address });
    } catch {
      // 保留当前选中地址
    }
  };

  pickPreferredAddress = (addresses: any[]) => {
    if (!addresses.length) return null;

    const currentId = this.state.address?.id;
    if (currentId && addresses.find((a) => a.id === currentId)) {
      return addresses.find((a) => a.id === currentId);
    }

    const userStore = useUserStore.getState();
    const zoneId = userStore.userInfo?.zone?.id;
    if (zoneId) {
      const zoneMatch = addresses.find((a) => a.zoneId === zoneId);
      if (zoneMatch) return zoneMatch;
    }

    return addresses.find((a) => a.isDefault) || addresses[0];
  };

  handleSelectCoupon = (coupon: any) => {
    if (this.state.coupon?.id === coupon?.id) {
      this.setState({ coupon: null, discount: 0, payAmount: this.state.totalAmount });
    } else if (coupon) {
      const discount = coupon.value;
      this.setState({
        coupon,
        discount,
        payAmount: Math.max(0, this.state.totalAmount - discount),
      });
    } else {
      this.setState({ coupon: null, discount: 0, payAmount: this.state.totalAmount });
    }
    this.setState({ showCouponPicker: false });
  };

  handleSelectAddress = (address: any) => {
    const userStore = useUserStore.getState();
    userStore.setUserInfo({
      ...(userStore.userInfo || {}),
      zone: address.zoneId ? { id: address.zoneId, name: address.zone } : userStore.userInfo?.zone,
    });
    this.setState({ address, showAddressPicker: false });
  };

  handleAddAddress = () => {
    this.setState({ showAddressPicker: false });
    navigateTo(PAGE_PATH.BIND_COMMUNITY, { from: 'order' });
  };

  handleSubmit = async () => {
    const { orderItems, address, deliveryType, coupon, remark, payAmount, totalAmount } = this.state;

    if (!address) {
      showToast('请选择收货地址');
      return;
    }

    if (totalAmount < BUSINESS_RULES.minOrderAmount) {
      showToast(`未满起送价 ¥${BUSINESS_RULES.minOrderAmount}`);
      return;
    }

    this.setState({ submitting: true });

    try {
      const orderData = {
        items: orderItems.map((item: any) => ({
          productId: item.productId,
          skuId: item.skuId,
          quantity: item.quantity,
        })),
        addressId: address.id,
        couponId: coupon?.id,
        deliveryType,
        remark,
      };

      const result = await orderApi.createOrder(orderData);
      const orderId = (result as any)?.orderId || 'O001';

      Taro.showToast({ title: '下单成功', icon: 'success' });

      setTimeout(() => {
        Taro.showModal({
          title: '确认支付',
          content: `配送至 ${address.zone} · 需支付 ¥${formatPrice(payAmount)}`,
          success: async (res) => {
            if (res.confirm) {
              try {
                await orderApi.payOrder(orderId, 'wechat_pay');
                Taro.showToast({ title: '支付成功', icon: 'success' });
                setTimeout(() => {
                  navigateTo(PAGE_PATH.TRACK, { id: orderId });
                }, 1500);
              } catch {
                Taro.switchTab({ url: PAGE_PATH.ORDERS });
              }
            } else {
              Taro.switchTab({ url: PAGE_PATH.ORDERS });
            }
          },
        });
      }, 1000);
    } catch (err: any) {
      showToast(err.message || '下单失败');
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const {
      orderItems, address, addresses, coupon, coupons,
      remark, totalAmount, discount, payAmount,
      submitting, showAddressPicker, showCouponPicker,
    } = this.state;

    const etaText = formatEtaText(MVP_COMMUNITY.etaMinutes);
    const belowMinOrder = totalAmount < BUSINESS_RULES.minOrderAmount;

    return (
      <View className='order-page'>
        <View className='order-header'>
          <Text className='order-title'>确认订单</Text>
        </View>

        <ScrollView className='order-body' scrollY>
          <View className='address-section' onClick={() => this.setState({ showAddressPicker: true })}>
            {address ? (
              <View className='address-card'>
                <View className='address-info'>
                  <Text className='address-name'>{address.name}</Text>
                  <Text className='address-phone'>{address.phone}</Text>
                </View>
                <Text className='address-detail'>
                  <Text className='address-tag zone'>{address.zone}</Text>
                  {address.isDefault && <Text className='address-tag'>默认</Text>}
                  {address.address}
                </Text>
                <Text className='address-arrow'>›</Text>
              </View>
            ) : (
              <View className='no-address' onClick={(e: any) => { e.stopPropagation(); this.handleAddAddress(); }}>
                <Text>请添加山屿西山著收货地址</Text>
                <Text className='add-link'>去添加 ›</Text>
              </View>
            )}
          </View>

          <View className='eta-section'>
            <View className='eta-icon-wrap'>
              <Text className='eta-icon'>🕐</Text>
            </View>
            <View className='eta-info'>
              <Text className='eta-title'>预计 {etaText}送达</Text>
              <Text className='eta-desc'>由{MVP_COMMUNITY.warehouseName}拣货配送至{address?.zone || '您的地址'}</Text>
            </View>
          </View>

          <View className='items-section'>
            <Text className='section-title'>商品信息</Text>
            {orderItems.map((item: any, index: number) => (
              <View key={index} className='order-item'>
                <View className='item-img'>
                  <Text>{item.productIcon || '📦'}</Text>
                </View>
                <View className='item-info'>
                  <Text className='item-name'>{item.productName}</Text>
                  <Text className='item-sku'>{item.skuName}</Text>
                  <View className='item-bottom'>
                    <Text className='item-price'>¥{formatPrice(item.price)}</Text>
                    <Text className='item-qty'>×{item.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {MVP_FEATURES.COUPONS && (
            <View className='coupon-section' onClick={() => this.setState({ showCouponPicker: true })}>
              <View className='section-row'>
                <Text className='row-label'>优惠券</Text>
                <View className='row-value'>
                  <Text className={coupon ? 'coupon-selected' : 'coupon-none'}>
                    {coupon ? `${coupon.name} -¥${coupon.value}` : '选择优惠券'}
                  </Text>
                  <Text className='row-arrow'>›</Text>
                </View>
              </View>
            </View>
          )}

          <View className='remark-section'>
            <Text className='section-title'>备注</Text>
            <Input
              className='remark-input'
              type='text'
              placeholder='选填：配送备注，如放门口'
              value={remark}
              onInput={(e: any) => this.setState({ remark: e.detail.value })}
              maxlength={50}
            />
          </View>

          <View className='price-detail'>
            {MVP_FEATURES.POINTS && (
              <View className='points-earn-row'>
                <Text className='points-earn-label'>⭐ 确认收货后可获积分</Text>
                <Text className='points-earn-value'>
                  +{calculatePoints(payAmount)} 积分（{POINTS_PER_YUAN}元=1积分）
                </Text>
              </View>
            )}
            <View className='price-row'>
              <Text>商品总额</Text>
              <Text>¥{formatPrice(totalAmount)}</Text>
            </View>
            {discount > 0 && (
              <View className='price-row discount'>
                <Text>优惠券</Text>
                <Text>-¥{formatPrice(discount)}</Text>
              </View>
            )}
            <View className='price-row'>
              <Text>配送费</Text>
              <Text className='free'>免费</Text>
            </View>
            {belowMinOrder && (
              <View className='min-order-tip'>
                <Text>还差 ¥{formatPrice(BUSINESS_RULES.minOrderAmount - totalAmount)} 达到起送价 ¥{BUSINESS_RULES.minOrderAmount}</Text>
              </View>
            )}
            <View className='price-row total'>
              <Text>实付款</Text>
              <Text className='total-amount'>¥{formatPrice(payAmount)}</Text>
            </View>
          </View>

          <View className='safe-bottom' />
        </ScrollView>

        <View className='submit-bar'>
          <View className='submit-total'>
            <Text className='total-label'>实付：</Text>
            <Text className='total-price'>¥{formatPrice(payAmount)}</Text>
          </View>
          <View
            className={`submit-btn ${submitting || belowMinOrder || !address ? 'disabled' : ''}`}
            onClick={this.handleSubmit}
          >
            <Text>
              {submitting ? '提交中...' : belowMinOrder ? `¥${BUSINESS_RULES.minOrderAmount}起送` : `微信支付 ¥${formatPrice(payAmount)}`}
            </Text>
          </View>
        </View>

        {showAddressPicker && (
          <View className='picker-mask' onClick={() => this.setState({ showAddressPicker: false })}>
            <View className='picker-panel' onClick={(e: any) => e.stopPropagation()}>
              <View className='picker-header'>
                <Text className='picker-title'>选择收货地址</Text>
                <Text className='picker-close' onClick={() => this.setState({ showAddressPicker: false })}>✕</Text>
              </View>
              <View className='picker-body'>
                {addresses.map((addr) => (
                  <View
                    key={addr.id}
                    className={`address-option ${address?.id === addr.id ? 'active' : ''}`}
                    onClick={() => this.handleSelectAddress(addr)}
                  >
                    <View className='addr-info'>
                      <Text className='addr-name'>{addr.name}</Text>
                      <Text className='addr-phone'>{addr.phone}</Text>
                      <Text className='addr-zone'>{addr.zone}</Text>
                    </View>
                    <Text className='addr-text'>{addr.address}</Text>
                    {address?.id === addr.id && <Text className='addr-check'>✓</Text>}
                  </View>
                ))}
                <View className='add-address-btn' onClick={this.handleAddAddress}>
                  <Text>+ 新增收货地址（东/西区）</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {showCouponPicker && (
          <View className='picker-mask' onClick={() => this.setState({ showCouponPicker: false })}>
            <View className='picker-panel' onClick={(e: any) => e.stopPropagation()}>
              <View className='picker-header'>
                <Text className='picker-title'>选择优惠券</Text>
                <Text className='picker-close' onClick={() => this.setState({ showCouponPicker: false })}>✕</Text>
              </View>
              <View className='picker-body'>
                <View className='coupon-option' onClick={() => this.handleSelectCoupon(null)}>
                  <Text className={!coupon ? 'active' : ''}>不使用优惠券</Text>
                </View>
                {coupons.map((cp) => (
                  <View
                    key={cp.id}
                    className={`coupon-card ${coupon?.id === cp.id ? 'active' : ''}`}
                    onClick={() => this.handleSelectCoupon(cp)}
                  >
                    <View className='coupon-left'>
                      <Text className='coupon-value'>¥{cp.value}</Text>
                      <Text className='coupon-condition'>满¥{cp.minAmount}可用</Text>
                    </View>
                    <View className='coupon-right'>
                      <Text className='coupon-name'>{cp.name}</Text>
                      <Text className='coupon-time'>有效期至 {cp.endTime}</Text>
                    </View>
                    {coupon?.id === cp.id && <Text className='coupon-check'>✓</Text>}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
