import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { MVP_COMMUNITY } from '../../config/constants';
import { showToast, PAGE_PATH } from '../../utils';
import AppIcon from '../../components/app-icon';
import './index.scss';

export default class LoginPage extends Component {
  state = { loading: false };

  handleLogin = async () => {
    this.setState({ loading: true });
    try {
      const loginRes = await Taro.login();
      const res: any = await workerApi.login(loginRes.code || 'dev');
      Taro.setStorageSync('worker_token', res.token);
      showToast('登录成功', 'success');
      setTimeout(() => {
        Taro.switchTab({ url: PAGE_PATH.HOME });
      }, 600);
    } catch (err: any) {
      showToast(err?.message || '登录失败');
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;

    return (
      <View className='login-page'>
        <Text className='logo'>🏗️</Text>
        <Text className='title'>邻选·作业</Text>
        <Text className='subtitle'>{MVP_COMMUNITY.warehouseName}</Text>
        <Text className='subtitle2'>山屿西山著 · 仓配工作台</Text>
        <View className='features'>
          <View className='feat-item'><AppIcon name='plus' size={36} /><Text>入库</Text></View>
          <View className='feat-item'><AppIcon name='order' size={36} /><Text>分拣</Text></View>
          <View className='feat-item'><AppIcon name='cart' size={36} /><Text>配送</Text></View>
        </View>
        <Button className='login-btn' loading={loading} disabled={loading} hoverClass='btn-pressed' onClick={this.handleLogin}>
          <AppIcon name='wechat-white' size={36} />
          <Text>微信登录</Text>
        </Button>
        <Text className='tip'>登录后进入工作台 · 请使用作业人员账号</Text>
      </View>
    );
  }
}
