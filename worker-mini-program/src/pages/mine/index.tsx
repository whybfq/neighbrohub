/** 我的：骑手角色标签、今日配送收入规则说明 */
import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockWorkerUser, mockDashboard } from '../../services/mockData';
import { checkWorkerLogin, formatPrice, PAGE_PATH } from '../../utils';
import { BUSINESS_RULES, MVP_COMMUNITY } from '../../config/constants';
import AppButton from '../../components/app-button';
import './index.scss';

interface State {
  user: typeof mockWorkerUser;
  earnings: number;
}

const ROLE_TEXT: Record<string, string> = {
  inbound: '入库员',
  pick: '分拣员',
  delivery: '配送员',
};

export default class MinePage extends Component<{}, State> {
  state: State = {
    user: mockWorkerUser,
    earnings: mockDashboard.todayEarnings,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.loadProfile();
  }

  onShow() {
    if (Taro.getStorageSync('worker_token')) {
      this.loadProfile();
    }
  }

  loadProfile = async () => {
    try {
      const [user, dash]: any[] = await Promise.all([
        workerApi.getProfile(),
        workerApi.getDashboard(),
      ]);
      this.setState({ user, earnings: dash.todayEarnings });
    } catch (err) {
      console.error(err);
    }
  };

  handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定退出作业台？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('worker_token');
          Taro.redirectTo({ url: PAGE_PATH.LOGIN });
        }
      },
    });
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
              <Text key={r} className='role-tag'>{ROLE_TEXT[r] || r}</Text>
            ))}
            {user.courierStatus === 'active' && (
              <Text className='role-tag active'>配送已认证</Text>
            )}
          </View>

          <View className='earn-card'>
            <Text className='earn-label'>今日配送收入</Text>
            <Text className='earn-value'>¥{formatPrice(earnings)}</Text>
            <Text className='earn-rule'>
              接他人单 ¥{BUSINESS_RULES.deliveryFeePerOrder}/单 · 自配免配送费 · 持单上限 {BUSINESS_RULES.maxConcurrentOrders}
            </Text>
          </View>

          <View className='menu-section'>
            <AppButton type='ghost' size='md' block onClick={() => Taro.switchTab({ url: PAGE_PATH.HOME })}>
              返回工作台
            </AppButton>
            <View className='logout-wrap'>
              <AppButton type='danger' size='md' block onClick={this.handleLogout}>
                退出登录
              </AppButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
