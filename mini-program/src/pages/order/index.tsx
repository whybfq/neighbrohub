import { Component } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { orderApi } from '../../services/api';
import { mockAddresses, mockCoupons } from '../../services/mockData';
import { formatPrice, showToast, showConfirm, generateOrderNo, PAGE_PATH } from '../../utils';
import { DELIVERY_TYPE, COMMISSION_RATE, POINTS_PER_YUAN } from '../../config/constants';
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
}

export default class OrderPage extends Component<{}, State> {
  state: State = {
    orderItems: [],
    address: null,
    addresses: mockAddresses,
    coupon: null,
    coupons: mockCoupons,
    deliveryType: DELIVERY_TYPE.SELF_PICKUP,
    remark: '',
    totalAmount: 0,
    discount: 0,
    payAmount: 0,
    submitting: false,
    showAddressPicker: false,
    showCouponPicker: false
  };

  componentDidMount() {
    this.initOrder();
  }

  initOrder = () => {
    // 从临时存储中读取订单数据
    const tempOrder = Taro.getStorageSync('temp_order');
    if (!tempOrder || !tempOrder.items) {
      Taro.showToast({ title: '订单数据异常', icon: 'none' });
      setTimeout(() => Taro.navigateBack(), 1500);
      return;
    }

    const { items } = tempOrder;
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const defaultAddress = this.state.addresses.find(a => a.isDefault) || this.state.addresses[0];

    this.setState({
      orderItems: items,
      address: defaultAddress,
      totalAmount,
      payAmount: totalAmount
    });

    // 清除临时数据
    Taro.removeStorageSync('temp_order');
  };

  // 切换配送方式
  handleDeliveryChange = (type: string) => {
    this.setState({ deliveryType: type });
  };

  // 选择优惠券
  handleSelectCoupon = (coupon: any) => {
    if (this.state.coupon?.id === coupon.id) {
      this.setState({ coupon: null, discount: 0, payAmount: this.state.totalAmount });
    } else {
      const discount = coupon.value;
      this.setState({
        coupon,
        discount,
        payAmount: Math.max(0, this.state.totalAmount - discount)
      });
    }
    this.setState({ showCouponPicker: false });
  };

  // 选择地址
  handleSelectAddress = (address: any) => {
    this.setState({ address, showAddressPicker: false });
  };

  // 提交订单
  handleSubmit = async () => {
    const { orderItems, address, deliveryType, coupon, remark, payAmount } = this.state;

    if (!address) {
      showToast('请选择收货地址');
      return;
    }

    this.setState({ submitting: true });

    try {
      const orderData = {
        items: orderItems.map((item: any) => ({
          productId: item.productId,
          skuId: item.skuId,
          quantity: item.quantity
        })),
        addressId: address.id,
        couponId: coupon?.id,
        deliveryType,
        remark
      };

      const result = await orderApi.createOrder(orderData);

      // 跳转到支付
      Taro.showToast({ title: '下单成功', icon: 'success' });

      setTimeout(() => {
        // 模拟支付流程
        Taro.showModal({
          title: '确认支付',
          content: `需支付 ¥${formatPrice(payAmount)}`,
          success: (res) => {
            if (res.confirm) {
              Taro.showToast({ title: '支付成功', icon: 'success' });
              setTimeout(() => {
                Taro.redirectTo({ url: PAGE_PATH.ORDERS });
              }, 1500);
            }
          }
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
      deliveryType, remark, totalAmount, discount, payAmount,
      submitting, showAddressPicker, showCouponPicker
    } = this.state;

    const commission = {
      buildingLeader: payAmount * COMMISSION_RATE.BUILDING_LEADER,
      communityLeader: payAmount * COMMISSION_RATE.COMMUNITY_LEADER
    };

    return (
      <View className='order-page'>
        <View className='order-header'>
          <Text className='order-title'>确认订单</Text>
        </View>

        <ScrollView className='order-body' scrollY>
          {/* 收货地址 */}
          <View className='address-section' onClick={() => this.setState({ showAddressPicker: true })}>
            {address ? (
              <View className='address-card'>
                <View className='address-info'>
                  <Text className='address-name'>{address.name}</Text>
                  <Text className='address-phone'>{address.phone}</Text>
                </View>
                <Text className='address-detail'>
                  <Text className='address-tag'>
                    {address.id === 'A001' ? '默认' : '提货点'}
                  </Text>
                  {address.address}
                </Text>
                <Text className='address-arrow'>›</Text>
              </View>
            ) : (
              <View className='no-address'>
                <Text>请添加收货地址</Text>
              </View>
            )}
          </View>

          {/* 配送方式 */}
          <View className='delivery-section'>
            <Text className='section-title'>配送方式</Text>
            <View className='delivery-options'>
              <View
                className={`delivery-option ${deliveryType === DELIVERY_TYPE.SELF_PICKUP ? 'active' : ''}`}
                onClick={() => this.handleDeliveryChange(DELIVERY_TYPE.SELF_PICKUP)}
              >
                <Text className='option-icon'>🏪</Text>
                <Text className='option-name'>团长自提</Text>
                <Text className='option-desc'>免费</Text>
              </View>
              <View
                className={`delivery-option ${deliveryType === DELIVERY_TYPE.DOOR_DELIVERY ? 'active' : ''}`}
                onClick={() => this.handleDeliveryChange(DELIVERY_TYPE.DOOR_DELIVERY)}
              >
                <Text className='option-icon'>🚀</Text>
                <Text className='option-name'>送货上门</Text>
                <Text className='option-desc'>免费</Text>
              </View>
            </View>
          </View>

          {/* 商品列表 */}
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

          {/* 优惠券 */}
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

          {/* 佣金预览 */}
          <View className='commission-preview'>
            <Text className='commission-title'>💰 本单分销佣金</Text>
            <View className='commission-row'>
              <Text>楼长佣金 (5%)</Text>
              <Text className='commission-amount'>¥{formatPrice(commission.buildingLeader)}</Text>
            </View>
            <View className='commission-row'>
              <Text>团长佣金 (3%)</Text>
              <Text className='commission-amount'>¥{formatPrice(commission.communityLeader)}</Text>
            </View>
          </View>

          {/* 积分预估 */}
          <View className='points-preview'>
            <View className='points-preview-header'>
              <Text className='points-preview-icon'>⭐</Text>
              <Text className='points-preview-title'>积分预估</Text>
            </View>
            <View className='points-preview-content'>
              <Text className='points-preview-desc'>
                确认收货后可获得 <Text className='points-highlight'>{Math.floor(payAmount) * POINTS_PER_YUAN}</Text> 积分
              </Text>
              <Text className='points-preview-rule'>消费1元=1积分，永不过期</Text>
            </View>
          </View>

          {/* 备注 */}
          <View className='remark-section'>
            <Text className='section-title'>备注</Text>
            <Input
              className='remark-input'
              type='text'
              placeholder='选填：给团长/楼长的留言'
              value={remark}
              onInput={(e: any) => this.setState({ remark: e.detail.value })}
              maxlength={50}
            />
          </View>

          {/* 价格明细 */}
          <View className='price-detail'>
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
            <View className='price-row total'>
              <Text>实付款</Text>
              <Text className='total-amount'>¥{formatPrice(payAmount)}</Text>
            </View>
          </View>

          <View className='safe-bottom' />
        </ScrollView>

        {/* 底部提交栏 */}
        <View className='submit-bar'>
          <View className='submit-total'>
            <Text className='total-label'>实付：</Text>
            <Text className='total-price'>¥{formatPrice(payAmount)}</Text>
          </View>
          <View className={`submit-btn ${submitting ? 'disabled' : ''}`} onClick={this.handleSubmit}>
            <Text>{submitting ? '提交中...' : '提交订单'}</Text>
          </View>
        </View>

        {/* 地址选择弹窗 */}
        {showAddressPicker && (
          <View className='picker-mask' onClick={() => this.setState({ showAddressPicker: false })}>
            <View className='picker-panel' onClick={(e: any) => e.stopPropagation()}>
              <View className='picker-header'>
                <Text className='picker-title'>选择收货地址</Text>
                <Text className='picker-close' onClick={() => this.setState({ showAddressPicker: false })}>✕</Text>
              </View>
              <View className='picker-body'>
                {addresses.map(addr => (
                  <View
                    key={addr.id}
                    className={`address-option ${address?.id === addr.id ? 'active' : ''}`}
                    onClick={() => this.handleSelectAddress(addr)}
                  >
                    <View className='addr-info'>
                      <Text className='addr-name'>{addr.name}</Text>
                      <Text className='addr-phone'>{addr.phone}</Text>
                    </View>
                    <Text className='addr-text'>{addr.address}</Text>
                    {address?.id === addr.id && <Text className='addr-check'>✓</Text>}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* 优惠券选择弹窗 */}
        {showCouponPicker && (
          <View className='picker-mask' onClick={() => this.setState({ showCouponPicker: false })}>
            <View className='picker-panel' onClick={(e: any) => e.stopPropagation()}>
              <View className='picker-header'>
                <Text className='picker-title'>选择优惠券</Text>
                <Text className='picker-close' onClick={() => this.setState({ showCouponPicker: false })}>✕</Text>
              </View>
              <View className='picker-body'>
                <View className='coupon-option' onClick={() => this.handleSelectCoupon(null as any)}>
                  <Text className={!coupon ? 'active' : ''}>不使用优惠券</Text>
                </View>
                {coupons.map(cp => (
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
