import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { orderApi } from '../../services/api';
import { mockOrders } from '../../services/mockData';
import { formatPrice, getOrderStatusText, getOrderStatusColor, showToast, showConfirm, navigateTo, PAGE_PATH } from '../../utils';
import { ORDER_STATUS } from '../../config/constants';
import EmptyState from '../../components/empty-state/index';
import './index.scss';

interface State {
  orders: any[];
  activeTab: string;
  loading: boolean;
}

const TABS = [
  { key: 'all', label: '全部' },
  { key: ORDER_STATUS.PENDING_PAY, label: '待付款' },
  { key: ORDER_STATUS.PENDING_DELIVER, label: '待发货' },
  { key: ORDER_STATUS.DELIVERING, label: '配送中' },
  { key: ORDER_STATUS.COMPLETED, label: '已完成' }
];

export default class OrdersPage extends Component<{}, State> {
  state: State = {
    orders: mockOrders,
    activeTab: 'all',
    loading: false
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
      const { activeTab } = this.state;
      const params: any = { page: 1, pageSize: 20 };
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      const orders = await orderApi.getOrders(params);
      this.setState({ orders });
    } catch (err) {
      // 使用模拟数据
    } finally {
      this.setState({ loading: false });
    }
  };

  // 切换Tab
  handleTabChange = (tab: string) => {
    this.setState({ activeTab: tab }, () => this.loadOrders());
  };

  // 支付订单
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
      }
    });
  };

  // 取消订单
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

  // 确认收货
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

  // 查看订单详情
  handleViewDetail = (orderId: string) => {
    // 跳转到订单详情页
    navigateTo('/pages/order-detail/index', { id: orderId });
  };

  // 再来一单
  handleRebuy = (order: any) => {
    Taro.setStorageSync('temp_order', {
      items: order.items.map((item: any) => ({
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity,
        productName: item.productName,
        productIcon: item.icon,
        skuName: item.skuName,
        price: item.price
      })),
      fromRebuy: true
    });
    navigateTo(PAGE_PATH.ORDER);
  };

  // 去评价
  handleReview = (orderId: string) => {
    Taro.showToast({ title: '评价功能开发中', icon: 'none' });
  };

  // 获取订单操作按钮
  getOrderActions = (order: any) => {
    const { status } = order;
    switch (status) {
      case ORDER_STATUS.PENDING_PAY:
        return (
          <View className='action-btns'>
            <View className='action-btn secondary' onClick={() => this.handleCancel(order.id)}>
              <Text>取消订单</Text>
            </View>
            <View className='action-btn primary' onClick={() => this.handlePay(order.id)}>
              <Text>去支付</Text>
            </View>
          </View>
        );
      case ORDER_STATUS.DELIVERING:
        return (
          <View className='action-btns'>
            <View className='action-btn secondary' onClick={() => this.handleViewDetail(order.id)}>
              <Text>查看物流</Text>
            </View>
            <View className='action-btn primary' onClick={() => this.handleConfirmReceive(order.id)}>
              <Text>确认收货</Text>
            </View>
          </View>
        );
      case ORDER_STATUS.COMPLETED:
        return (
          <View className='action-btns'>
            <View className='action-btn secondary' onClick={() => this.handleRebuy(order)}>
              <Text>再来一单</Text>
            </View>
            <View className='action-btn secondary' onClick={() => this.handleReview(order.id)}>
              <Text>去评价</Text>
            </View>
          </View>
        );
      case ORDER_STATUS.PENDING_DELIVER:
        return (
          <View className='action-btns'>
            <View className='action-btn secondary' onClick={() => this.handleCancel(order.id)}>
              <Text>取消订单</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // 获取过滤后的订单
  getFilteredOrders = () => {
    const { orders, activeTab } = this.state;
    if (activeTab === 'all') return orders;
    return orders.filter(o => o.status === activeTab);
  };

  render() {
    const { activeTab, loading } = this.state;
    const filteredOrders = this.getFilteredOrders();

    return (
      <View className='orders-page'>
        {/* Tab切换 */}
        <View className='order-tabs'>
          <ScrollView scrollX className='tabs-scroll'>
            <View className='tabs-list'>
              {TABS.map(tab => (
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

        {/* 订单列表 */}
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
            filteredOrders.map(order => (
              <View key={order.id} className='order-card'>
                {/* 订单头部 */}
                <View className='order-card-header'>
                  <Text className='order-no'>订单号：{order.orderNo}</Text>
                  <Text
                    className='order-status'
                    style={{ color: getOrderStatusColor(order.status) }}
                  >
                    {getOrderStatusText(order.status)}
                  </Text>
                </View>

                {/* 商品信息 */}
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

                {/* 楼长/团长信息 */}
                {order.buildingLeader && (
                  <View className='distributor-info'>
                    <Text className='distributor-text'>
                      🏅 楼长：{order.buildingLeader.name} | 团长：{order.communityLeader?.name}
                    </Text>
                    {order.commission && (
                      <Text className='commission-text'>
                        佣金：楼长 ¥{formatPrice(order.commission.buildingLeader)} | 团长 ¥{formatPrice(order.commission.communityLeader)}
                      </Text>
                    )}
                  </View>
                )}

                {/* 订单底部 */}
                <View className='order-card-footer'>
                  <View className='order-total'>
                    <Text>共{order.items.reduce((s: number, i: any) => s + i.quantity, 0)}件</Text>
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
