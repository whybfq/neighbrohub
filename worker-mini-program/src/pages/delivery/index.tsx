import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { checkWorkerLogin, navigateTo, showToast, getZoneName, copyText, PAGE_PATH } from '../../utils';
import { BUSINESS_RULES, MVP_ZONES } from '../../config/constants';
import AppButton from '../../components/app-button';
import EmptyState from '../../components/empty-state';
import './index.scss';

type ZoneFilter = 'ALL' | 'EAST' | 'WEST';

interface State {
  online: boolean;
  pool: any[];
  holdingCount: number;
  active: any;
  zoneFilter: ZoneFilter;
  loading: boolean;
}

const ZONE_TABS: { id: ZoneFilter; name: string }[] = [
  { id: 'ALL', name: '全部' },
  ...MVP_ZONES.map((z) => ({ id: z.id as ZoneFilter, name: z.name })),
];

export default class DeliveryPage extends Component<{}, State> {
  state: State = {
    online: true,
    pool: [],
    holdingCount: 0,
    active: null,
    zoneFilter: 'ALL',
    loading: false,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.loadPool();
  }

  onShow() {
    if (Taro.getStorageSync('worker_token')) {
      this.loadPool();
    }
  }

  onPullDownRefresh() {
    this.loadPool().finally(() => Taro.stopPullDownRefresh());
  }

  loadPool = async () => {
    this.setState({ loading: true });
    try {
      const data: any = await workerApi.getDeliveryPool();
      const active = await workerApi.getActiveDelivery();
      this.setState({
        online: data.online,
        pool: data.list || [],
        holdingCount: data.holdingCount ?? 0,
        active: active || null,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      showToast('加载抢单池失败');
      this.setState({ loading: false });
    }
  };

  toggleOnline = async () => {
    const online = !this.state.online;
    try {
      await workerApi.setOnlineStatus(online);
      this.setState({ online });
      showToast(online ? '已上线，可抢单' : '已离线');
    } catch (err: any) {
      showToast(err?.message || '状态更新失败');
    }
  };

  handleGrab = async (id: string) => {
    if (!this.state.online) {
      showToast('请先上线接单');
      return;
    }
    if (this.state.holdingCount >= BUSINESS_RULES.maxConcurrentOrders) {
      showToast(`已达持单上限 ${BUSINESS_RULES.maxConcurrentOrders} 单`);
      return;
    }
    try {
      await workerApi.grabOrder(id);
      showToast('抢单成功', 'success');
      this.loadPool();
    } catch (err: any) {
      showToast(err?.message || '抢单失败');
    }
  };

  goConfirm = (id: string) => {
    navigateTo(PAGE_PATH.DELIVERY_CONFIRM, { id });
  };

  filterByZone = <T extends { zoneId?: string }>(items: T[]) => {
    const { zoneFilter } = this.state;
    if (zoneFilter === 'ALL') return items;
    return items.filter((item) => item.zoneId === zoneFilter);
  };

  render() {
    const { online, pool, holdingCount, active, zoneFilter, loading } = this.state;
    const filteredPool = this.filterByZone(pool);
    const showActive = active && (zoneFilter === 'ALL' || active.zoneId === zoneFilter);

    return (
      <View className='delivery-page'>
        <View className='delivery-header'>
          <View className='online-row' hoverClass='card-pressed' onClick={this.toggleOnline}>
            <Text className={`online-dot ${online ? 'on' : ''}`} />
            <Text className='online-text'>{online ? '在线接单' : '已离线'}</Text>
          </View>
          <Text className='hold-text'>持单 {holdingCount}/{BUSINESS_RULES.maxConcurrentOrders}</Text>
        </View>

        <View className='zone-tabs'>
          {ZONE_TABS.map((tab) => (
            <View
              key={tab.id}
              className={`zone-tab ${zoneFilter === tab.id ? 'active' : ''}`}
              onClick={() => this.setState({ zoneFilter: tab.id })}
            >
              <Text>{tab.name}</Text>
            </View>
          ))}
        </View>

        <ScrollView className='delivery-body' scrollY>
          {showActive && (
            <>
              <Text className='section-title'>配送中 · {getZoneName(active.zoneId)}</Text>
              <View className='active-card'>
                <Text className='order-no'>#{active.orderNo}</Text>
                <Text className='addr'>{active.address}</Text>
                <View className='active-actions'>
                  <AppButton type='secondary' size='sm' onClick={() => copyText(active.address, '地址已复制')}>
                    复制地址
                  </AppButton>
                  <AppButton type='primary' size='sm' onClick={() => this.goConfirm(active.id)}>
                    确认送达
                  </AppButton>
                </View>
              </View>
            </>
          )}

          <Text className='section-title'>抢单大厅 · {filteredPool.length} 单</Text>
          {loading && <View className='loading-tip'><Text>加载中...</Text></View>}
          {!loading && filteredPool.length === 0 && (
            <EmptyState iconName='cart' text='暂无待配送订单' subText='分拣完成后订单会进入抢单池' />
          )}
          {filteredPool.map((order) => (
            <View key={order.id} className='pool-card'>
              <View className='pool-top'>
                <Text className='order-no'>#{order.orderNo} · {getZoneName(order.zoneId)}</Text>
                <Text className='fee'>¥{order.fee}</Text>
              </View>
              <Text className='pool-addr'>{order.address}</Text>
              <Text className='pool-meta'>{order.itemCount} 件 · 等待 {order.waitingMinutes} 分钟</Text>
              <AppButton
                type='primary'
                size='md'
                block
                disabled={!online}
                onClick={() => this.handleGrab(order.id)}
              >
                {online ? '立即抢单' : '请先上线'}
              </AppButton>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
