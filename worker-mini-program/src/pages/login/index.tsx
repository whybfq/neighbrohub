/**
 * 履约端登录 / 骑手开放注册
 *
 * MVP 演示：login/register 可传 consumerUserId 关联消费者账号以支持自配。
 * 生产需改为真实微信 code → openid。
 */
import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { BUSINESS_RULES, MVP_COMMUNITY } from '../../config/constants';
import { showToast, PAGE_PATH } from '../../utils';
import AppIcon from '../../components/app-icon';
import './index.scss';

export default class LoginPage extends Component {
  state = { loading: false };

  handleLogin = async () => {
    this.setState({ loading: true });
    try {
      await Taro.login();
      const res: any = await workerApi.login({
        code: 'dev',
        phone: '138****5678',
        consumerUserId: 'U10001',
        nickname: '骑手',
      });
      Taro.setStorageSync('worker_token', res.token);
      showToast(res.user?.openRegistered ? '登录成功，可接单' : '登录成功', 'success');
      setTimeout(() => {
        Taro.switchTab({ url: PAGE_PATH.HOME });
      }, 600);
    } catch (err: any) {
      showToast(err?.message || '登录失败');
    } finally {
      this.setState({ loading: false });
    }
  };

  handleRegister = async () => {
    this.setState({ loading: true });
    try {
      const res: any = await workerApi.register({
        nickname: '新骑手',
        phone: '138****5678',
        consumerUserId: 'U10001',
      });
      showToast(res.message || '骑手注册成功', 'success');
      setTimeout(() => this.handleLogin(), 800);
    } catch (err: any) {
      showToast(err?.message || '注册失败');
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;

    return (
      <View className='login-page'>
        <Text className='logo'>🏗️</Text>
        <Text className='title'>邻选·履约</Text>
        <Text className='subtitle'>{MVP_COMMUNITY.warehouseName}</Text>
        <Text className='subtitle2'>山屿西山著 · 入库·分拣·配送</Text>
        <View className='features'>
          <View className='feat-item'><AppIcon name='plus' size={36} /><Text>入库</Text></View>
          <View className='feat-item'><AppIcon name='order' size={36} /><Text>分拣</Text></View>
          <View className='feat-item'><AppIcon name='cart' size={36} /><Text>配送</Text></View>
        </View>
        <Button className='login-btn' loading={loading} disabled={loading} hoverClass='btn-pressed' onClick={this.handleLogin}>
          <AppIcon name='wechat-white' size={36} />
          <Text>微信登录 · 开放接单</Text>
        </Button>
        <Button className='register-btn' loading={loading} disabled={loading} hoverClass='btn-pressed' onClick={this.handleRegister}>
          <Text>注册成为骑手</Text>
        </Button>
        <Text className='tip'>任何人可注册接单 · 配送费 ¥{BUSINESS_RULES.consumerDeliveryFee}/单</Text>
        <Text className='tip sub'>自配自己的订单免配送费 · 接他人单 ¥{BUSINESS_RULES.deliveryFeePerOrder}/单</Text>
      </View>
    );
  }
}
