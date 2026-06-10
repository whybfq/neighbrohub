import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockWorkerUser } from '../../services/mockData';
import { EMPTY_WORKER_DASHBOARD } from '../../config/constants';
import { checkWorkerLogin, navigateTo, PAGE_PATH, showToast } from '../../utils';
import { MVP_COMMUNITY, BUSINESS_RULES } from '../../config/constants';
import AppIcon from '../../components/app-icon';
import AppButton from '../../components/app-button';
import './index.scss';

interface State {
  dashboard: typeof EMPTY_WORKER_DASHBOARD;
  user: typeof mockWorkerUser;
}

export default class HomePage extends Component<{}, State> {
  state: State = {
    dashboard: EMPTY_WORKER_DASHBOARD,
    user: mockWorkerUser,
  };

  componentDidMount() {
    if (!checkWorkerLogin()) return;
    this.loadData();
  }

  onShow() {
    if (Taro.getStorageSync('worker_token')) {
      this.loadData();
    }
  }

  onPullDownRefresh() {
    this.loadData().finally(() => Taro.stopPullDownRefresh());
  }

  loadData = async () => {
    try {
      const [dashboard, user] = await Promise.all([
        workerApi.getDashboard(),
        workerApi.getProfile(),
      ]);
      this.setState({ dashboard: dashboard as any, user: user as any });
    } catch (err) {
      console.error('加载工作台失败', err);
      showToast('加载失败，请确认后端已启动');
    }
  };

  goTab = (path: string) => {
    Taro.switchTab({ url: path });
  };

  render() {
    const { dashboard, user } = this.state;

    return (
      <View className='home-page'>
        <View className='home-header'>
          <View className='header-top'>
            <Text className='brand'>邻选·作业台</Text>
            <Text className='warehouse-tag'>{MVP_COMMUNITY.warehouseName}</Text>
          </View>
          <Text className='welcome'>{user.nickname}，今日加油</Text>
        </View>

        <ScrollView className='home-body' scrollY>
          <View className='stats-grid'>
            <View className='stat-card'>
              <Text className='stat-num'>{dashboard.todayInbound}</Text>
              <Text className='stat-label'>今日入库</Text>
            </View>
            <View className='stat-card'>
              <Text className='stat-num'>{dashboard.todayPick}</Text>
              <Text className='stat-label'>今日分拣</Text>
            </View>
            <View className='stat-card'>
              <Text className='stat-num'>{dashboard.todayDelivery}</Text>
              <Text className='stat-label'>今日配送</Text>
            </View>
            <View className='stat-card highlight'>
              <Text className='stat-num'>¥{dashboard.todayEarnings}</Text>
              <Text className='stat-label'>今日收入</Text>
            </View>
          </View>

          <View className='todo-cards'>
            <View className='todo-card pick' hoverClass='card-pressed' onClick={() => this.goTab(PAGE_PATH.PICK)}>
              <View className='todo-left'>
                <AppIcon name='order' size={44} />
                <View>
                  <Text className='todo-title'>待分拣</Text>
                  <Text className='todo-desc'>东区·西区订单</Text>
                </View>
              </View>
              <Text className='todo-badge'>{dashboard.pendingPick}</Text>
            </View>
            <View className='todo-card delivery' hoverClass='card-pressed' onClick={() => this.goTab(PAGE_PATH.DELIVERY)}>
              <View className='todo-left'>
                <AppIcon name='cart' size={44} />
                <View>
                  <Text className='todo-title'>待配送</Text>
                  <Text className='todo-desc'>抢单大厅</Text>
                </View>
              </View>
              <Text className='todo-badge'>{dashboard.pendingDelivery}</Text>
            </View>
          </View>

          <View className='hold-bar'>
            <Text>当前持单 {dashboard.holdingCount}/{BUSINESS_RULES.maxConcurrentOrders}</Text>
          </View>

          <View className='inbound-entry' onClick={() => navigateTo(PAGE_PATH.INBOUND)}>
            <View className='inbound-left'>
              <AppIcon name='plus' size={48} />
              <View>
                <Text className='inbound-title'>扫码入库</Text>
                <Text className='inbound-desc'>商品到货 · 录入库位</Text>
              </View>
            </View>
            <Text className='inbound-arrow'>›</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
