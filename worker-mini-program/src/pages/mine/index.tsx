import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockWorkerUser, mockDashboard } from '../../services/mockData';
import { checkWorkerLogin, formatPrice, PAGE_PATH } from '../../utils';
import { BUSINESS_RULES, MVP_COMMUNITY } from '../../config/constants';
import './index.scss';

interface State {
  user: typeof mockWorkerUser;
  earnings: number;
}

export default class MinePage extends Component<{}, State> {
  state: State = {
    user: mockWorkerUser,
    earnings: mockDashboard.todayEarnings,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.loadProfile();
  }

  loadProfile = async () => {
    try {
      const [user, dash]: any[] = await Promise.all([
        workerApi.getProfile(),
        workerApi.getDashboard(),
      ]);
      this.setState({ user, earnings: dash.todayEarnings });
    } catch {
      // mock
    }
  };

  handleLogout = () => {
    Taro.removeStorageSync('worker_token');
    Taro.redirectTo({ url: PAGE_PATH.LOGIN });
  };

  render() {
    const { user, earnings } = this.state;

    return (
      <View className='mine-page'>
        <View className='mine-header'>
          <Text className='avatar'>{user.avatar}</Text>
          <View className='user-info'>
            <Text className='name'>{user.nickname}</Text>
            <Text className='phone'>{user.phone}</Text>
            <Text className='warehouse'>{MVP_COMMUNITY.warehouseName}</Text>
          </View>
        </View>

        <ScrollView className='mine-body' scrollY>
          <View className='role-tags'>
            {user.roles.map((r) => (
              <Text key={r} className='role-tag'>
                {r === 'inbound' ? '入库员' : r === 'pick' ? '分拣员' : '配送员'}
              </Text>
            ))}
          </View>

          <View className='earn-card'>
            <Text className='earn-label'>今日配送收入</Text>
            <Text className='earn-value'>¥{formatPrice(earnings)}</Text>
            <Text className='earn-rule'>¥{BUSINESS_RULES.deliveryFeePerOrder}/单 · 上限 {BUSINESS_RULES.maxConcurrentOrders} 单</Text>
          </View>

          <View className='menu-item' onClick={() => Taro.navigateTo({ url: PAGE_PATH.HOME })}>
            <Text>🏠 返回工作台</Text>
          </View>
          <View className='menu-item logout' onClick={this.handleLogout}>
            <Text>退出登录</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
