import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockDashboard, mockWorkerUser } from '../../services/mockData';
import { checkWorkerLogin, navigateTo, PAGE_PATH } from '../../utils';
import { MVP_COMMUNITY, BUSINESS_RULES } from '../../config/constants';
import './index.scss';

interface State {
  dashboard: typeof mockDashboard;
  user: typeof mockWorkerUser;
}

const NAV_ITEMS = [
  { key: 'inbound', icon: '📥', label: '入库', path: PAGE_PATH.INBOUND, color: '#667eea' },
  { key: 'pick', icon: '📦', label: '分拣', path: PAGE_PATH.PICK, color: '#764ba2' },
  { key: 'delivery', icon: '🛵', label: '配送', path: PAGE_PATH.DELIVERY, color: '#52c41a' },
  { key: 'mine', icon: '👤', label: '我的', path: PAGE_PATH.MINE, color: '#fa8c16' },
];

export default class HomePage extends Component<{}, State> {
  state: State = {
    dashboard: mockDashboard,
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

  loadData = async () => {
    try {
      const [dashboard, user] = await Promise.all([
        workerApi.getDashboard(),
        workerApi.getProfile(),
      ]);
      this.setState({ dashboard: dashboard as any, user: user as any });
    } catch {
      // mock fallback
    }
  };

  render() {
    const { dashboard, user } = this.state;

    return (
      <View className='home-page'>
        <View className='home-header'>
          <Text className='warehouse'>{MVP_COMMUNITY.warehouseName}</Text>
          <Text className='welcome'>{user.nickname}，今日加油 💪</Text>
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

          <View className='pending-bar'>
            <Text>待分拣 {dashboard.pendingPick} 单</Text>
            <Text>待配送 {dashboard.pendingDelivery} 单</Text>
            <Text>持单 {dashboard.holdingCount}/{BUSINESS_RULES.maxConcurrentOrders}</Text>
          </View>

          <View className='nav-grid'>
            {NAV_ITEMS.map((item) => (
              <View
                key={item.key}
                className='nav-card'
                style={{ borderLeftColor: item.color }}
                onClick={() => navigateTo(item.path)}
              >
                <Text className='nav-icon'>{item.icon}</Text>
                <Text className='nav-label'>{item.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}
