import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { MVP_COMMUNITY } from '../../config/constants';
import { showToast, PAGE_PATH } from '../../utils';
import './index.scss';

export default class LoginPage extends Component {
  handleLogin = async () => {
    try {
      const res: any = await workerApi.login('mock_code');
      Taro.setStorageSync('worker_token', res.token);
      showToast('登录成功', 'success');
      setTimeout(() => {
        Taro.redirectTo({ url: PAGE_PATH.HOME });
      }, 800);
    } catch {
      Taro.setStorageSync('worker_token', 'dev_token');
      Taro.redirectTo({ url: PAGE_PATH.HOME });
    }
  };

  render() {
    return (
      <View className='login-page'>
        <Text className='logo'>🏗️</Text>
        <Text className='title'>邻选·作业</Text>
        <Text className='subtitle'>{MVP_COMMUNITY.warehouseName} · 仓配工作台</Text>
        <View className='features'>
          <Text className='feat'>📥 扫码入库</Text>
          <Text className='feat'>📦 订单分拣</Text>
          <Text className='feat'>🛵 抢单配送</Text>
        </View>
        <Button className='login-btn' onClick={this.handleLogin}>微信登录</Button>
        <Text className='tip'>内测账号：登录后进入工作台</Text>
      </View>
    );
  }
}
