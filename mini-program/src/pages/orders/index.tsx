import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { orderApi } from '../../services/api';
import { mockOrders } from '../../services/mockData';
import {
  formatPrice,
  getOrderStatusText,
  getOrderStatusColor,
  showToast,
  showConfirm,
  navigateTo,
  PAGE_PATH,
  matchOrderTab,
  isTrackableOrder,
} from '../../utils';
import { ORDER_STATUS, ORDER_LIST_TABS } from '../../config/constants';
import EmptyState from '../../components/empty-state/index';
import './index.scss';

interface State {
  orders: any[];
  activeTab: string;
  loading: boolean;
}

export default class OrdersPage extends Component<{}, State> {
  state: State = {
    orders: mockOrders,
    activeTab: 'all',
    loading: false,
  };

  componentDidMount() {
    this.loadOrders();
  }

  onShow() {
    this.loadOrders();
  }

  loadOrders = async () => {
    this.setState({ loading: true });
    try {
      const orders = await orderApi.getOrders({ page: 1, pageSize: 20 });
      this.setState({ orders });
    } catch (err) {
      // 使用模拟数据
    } finally {
      this.setState({ loading: false });
    }
  };

  handleTabChange = (tab: string) => {
    this.setState({ activeTab: tab });
  };

  handlePay = (orderId: string) => {
    Taro.showModal({
      title: '确认支付',
      content: '确认使用微信支付？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.payOrder(orderId, 'wechat_pay');
            showToast('支付成功', 'success');
            this.loadOrders();
          } catch (err: any) {
            showToast('支付失败');
          }
        }
      },
    });
  };

  handleCancel = async (orderId: string) => {
    const confirmed = await showConfirm('取消订单', '确定要取消该订单吗？');
    if (confirmed) {
      try {
        await orderApi.cancelOrder(orderId);
        showToast('已取消', 'success');
        this.loadOrders();
      } catch (err: any) {
        showToast('取消失败');
      }
    }
  };

  handleConfirmReceive = async (orderId: string) => {
    const confirmed = await showConfirm('确认收货', '确认已收到商品？');
    if (confirmed) {
      try {
        await orderApi.confirmReceive(orderId);
        showToast('已确认收货', 'success');
        this.loadOrders();
      } catch (err: any) {
        showToast('操作失败');
      }
    }
  };

  handleTrack = (orderId: string) => {
    navigateTo(PAGE_PATH.TRACK, { id: orderId });
  };

  handleRebuy = (order: any) => {
    Taro.setStorageSync('temp_order', {
      items: order.items.map((item: any) => ({
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity,
        productName: item.productName,
        productIcon: item.icon,
        skuName: item.skuName,
        price: item.price,
      })),
      fromRebuy: true,
    });
    navigateTo(PAGE_PATH.ORDER);
  };

  getOrderActions = (order: any) => {
    const { status, id } = order;

    switch (status) {
      case ORDER_STATUS.PENDING_PAY:
        return (
          <View className='action-btns' onClick={(e: any) => e.stopPropagation()}>
            <View className='action-btn secondary' onClick={() => this.handleCancel(id)}>
              <Text>取消订单</Text>
            </View>
            <View className='action-btn primary' onClick={() => this.handlePay(id)}>
              <Text>去支付</Text>
            </View>
          </View>
        );
      case ORDER_STATUS.DELIVERING:
      case ORDER_STATUS.DISPATCHING:
      case ORDER_STATUS.DELIVERED:
        return (
          <View className='action-btns' onClick={(e: any) => e.stopPropagation()}>
            <View className='action-btn secondary' onClick={() => this.handleTrack(id)}>
              <Text>查看配送</Text>
            </View>
            <View className='action-btn primary' onClick={() => this.handleConfirmReceive(id)}>
              <Text>确认收货</Text>
            </View>
          </View>
        );
      case ORDER_STATUS.COMPLETED:
        return (
          <View className='action-btns' onClick={(e: any) => e.stopPropagation()}>
            <View className='action-btn secondary' onClick={() => this.handleRebuy(order)}>
              <Text>再来一单</Text>
            </View>
          </View>
        );
      default:
        if (isTrackableOrder(status)) {
          return (
            <View className='action-btns' onClick={(e: any) => e.stopPropagation()}>
              <View className='action-btn secondary' onClick={() => this.handleTrack(id)}>
                <Text>查看配送</Text>
              </View>
            </View>
          );
        }
        return null;
    }
  };

  getFilteredOrders = () => {
    const { orders, activeTab } = this.state;
    return orders.filter((o) => matchOrderTab(o.status, activeTab));
  };

  getItemCount = (order: any) => {
    return order.items.reduce((s: number, i: any) => s + i.quantity, 0);
  };

  render() {
    const { activeTab, loading } = this.state;
    const filteredOrders = this.getFilteredOrders();

    return (
      <View className='orders-page'>
        <View className='order-tabs'>
          <ScrollView scrollX className='tabs-scroll'>
            <View className='tabs-list'>
              {ORDER_LIST_TABS.map((tab) => (
                <View
                  key={tab.key}
                  className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => this.handleTabChange(tab.key)}
                >
                  <Text>{tab.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView className='order-list' scrollY>
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon='📋'
              text='暂无订单'
              subText='去逛逛社区好物吧'
              actionText='去首页'
              onAction={() => Taro.switchTab({ url: PAGE_PATH.INDEX })}
            />
          ) : (
            filteredOrders.map((order) => (
              <View
                key={order.id}
                className='order-card'
                onClick={() => isTrackableOrder(order.status) && this.handleTrack(order.id)}
              >
                <View className='order-card-header'>
                  <Text className='order-no'>订单号：{order.orderNo}</Text>
                  <Text
                    className='order-status'
                    style={{ color: getOrderStatusColor(order.status) }}
                  >
                    {getOrderStatusText(order.status)}
                  </Text>
                </View>

                {order.items.map((item: any, index: number) => (
                  <View key={index} className='order-item'>
                    <View className='item-img'>
                      <Text>{item.icon || '📦'}</Text>
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

                {order.address && (
                  <View className='order-address'>
                    <Text className='order-address-text'>📍 {order.address}</Text>
                  </View>
                )}

                <View className='order-card-footer'>
                  <View className='order-total'>
                    <Text>共{this.getItemCount(order)}件</Text>
                    <Text>实付：</Text>
                    <Text className='total-price'>¥{formatPrice(order.payAmount)}</Text>
                  </View>
                  {this.getOrderActions(order)}
                </View>
              </View>
            ))
          )}

          {loading && (
            <View className='loading-more'>
              <Text>加载中...</Text>
            </View>
          )}

          <View className='safe-bottom' />
        </ScrollView>
      </View>
    );
  }
}
