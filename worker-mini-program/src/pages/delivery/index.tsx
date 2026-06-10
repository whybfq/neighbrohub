import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { workerApi } from '../../services/api';
import { mockDashboard, mockDeliveryPool, mockActiveDelivery } from '../../services/mockData';
import { checkWorkerLogin, navigateTo, showToast, PAGE_PATH } from '../../utils';
import { BUSINESS_RULES, MVP_ZONES } from '../../config/constants';
import './index.scss';

type ZoneFilter = 'ALL' | 'EAST' | 'WEST';

interface State {
  online: boolean;
  pool: typeof mockDeliveryPool;
  holdingCount: number;
  active: typeof mockActiveDelivery | null;
  zoneFilter: ZoneFilter;
}

const ZONE_TABS: { id: ZoneFilter; name: string }[] = [
  { id: 'ALL', name: '全部' },
  ...MVP_ZONES.map((z) => ({ id: z.id as ZoneFilter, name: z.name })),
];

export default class DeliveryPage extends Component<{}, State> {
  state: State = {
    online: true,
    pool: mockDeliveryPool,
    holdingCount: mockDashboard.holdingCount,
    active: mockActiveDelivery,
    zoneFilter: 'ALL',
  };

  componentDidMount() {
    checkWorkerLogin();
    this.loadPool();
  }

  loadPool = async () => {
    try {
      const data: any = await workerApi.getDeliveryPool();
      this.setState({
        online: data.online,
        pool: data.list || mockDeliveryPool,
        holdingCount: data.holdingCount ?? mockDashboard.holdingCount,
      });
      const active = await workerApi.getActiveDelivery();
      this.setState({ active: active as any });
    } catch {
      // mock
    }
  };

  toggleOnline = async () => {
    const online = !this.state.online;
    this.setState({ online });
    try {
      await workerApi.setOnlineStatus(online);
    } catch {
      // mock
    }
    showToast(online ? '已上线' : '已离线');
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
    } catch {
      showToast('抢单成功（Mock）', 'success');
      this.setState({ holdingCount: this.state.holdingCount + 1 });
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
    const { online, pool, holdingCount, active, zoneFilter } = this.state;
    const filteredPool = this.filterByZone(pool);
    const showActive = active && (zoneFilter === 'ALL' || active.zoneId === zoneFilter);

    return (
      <View className='delivery-page'>
        <View className='delivery-header'>
          <View className='online-row' onClick={this.toggleOnline}>
            <Text className={`online-dot ${online ? 'on' : ''}`} />
            <Text className='online-text'>{online ? '在线接单' : '已离线'}</Text>
          </View>
          <Text className='hold-text'>
            持单 {holdingCount}/{BUSINESS_RULES.maxConcurrentOrders}
          </Text>
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
              <Text className='section-title'>配送中</Text>
              <View className='active-card'>
                <Text className='order-no'>#{active.orderNo} · {active.address}</Text>
                <Text className='status'>已取货 · 配送中</Text>
                <View className='active-actions'>
                  <View className='btn-nav' onClick={() => showToast('打开导航')}>
                    <Text>导航</Text>
                  </View>
                  <View className='btn-deliver' onClick={() => this.goConfirm(active.id)}>
                    <Text>确认送达</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <Text className='section-title'>抢单大厅 · {filteredPool.length} 单待配送</Text>
          {filteredPool.length === 0 && (
            <View className='empty-pool'>
              <Text>当前分区暂无待配送订单</Text>
            </View>
          )}
          {filteredPool.map((order) => (
            <View key={order.id} className='pool-card'>
              <View className='pool-top'>
                <Text className='order-no'>#{order.orderNo} · {order.address}</Text>
                <Text className='fee'>¥{order.fee}</Text>
              </View>
              <Text className='pool-meta'>
                {order.itemCount} 件 · 等待 {order.waitingMinutes} 分钟
              </Text>
              <View className='grab-btn' onClick={() => this.handleGrab(order.id)}>
                <Text>立即抢单</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
