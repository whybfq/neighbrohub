import { Component } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { checkWorkerLogin, showToast } from '../../utils';
import './confirm.scss';

interface State {
  signCode: string;
  order: {
    id: string;
    orderNo: string;
    address: string;
    signCode: string;
  } | null;
  loading: boolean;
}

export default class DeliveryConfirmPage extends Component<{}, State> {
  taskId = '';

  state: State = {
    signCode: '',
    order: null,
    loading: true,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.taskId = getCurrentInstance().router?.params?.id || '';
    this.loadActive();
  }

  loadActive = async () => {
    try {
      const active: any = await workerApi.getActiveDelivery();
      if (active) {
        this.setState({
          order: active,
          loading: false,
        });
        if (!this.taskId) this.taskId = active.id;
      } else {
        this.setState({ loading: false });
        showToast('暂无配送中订单');
      }
    } catch {
      this.setState({ loading: false });
    }
  };

  handleConfirm = async () => {
    const { signCode, order } = this.state;
    if (!order) {
      showToast('暂无配送任务');
      return;
    }
    if (signCode.length !== 6) {
      showToast('请输入6位签收码');
      return;
    }
    try {
      await workerApi.confirmDeliver(this.taskId || order.id, signCode);
      showToast('送达成功', 'success');
      setTimeout(() => Taro.navigateBack({ delta: 2 }), 1000);
    } catch (err: any) {
      showToast(err.message || '签收失败');
    }
  };

  render() {
    const { signCode, order, loading } = this.state;

    if (loading) {
      return (
        <View className='confirm-page'>
          <Text>加载中...</Text>
        </View>
      );
    }

    if (!order) {
      return (
        <View className='confirm-page'>
          <Text>暂无配送中订单</Text>
        </View>
      );
    }

    return (
      <View className='confirm-page'>
        <View className='confirm-card'>
          <Text className='title'>确认送达</Text>
          <Text className='order-info'>#{order.orderNo} · {order.address}</Text>
          <Text className='hint'>请输入用户订单页上的 6 位签收码</Text>
          <Input
            className='code-input'
            type='number'
            maxlength={6}
            placeholder='签收码'
            value={signCode}
            onInput={(e) => this.setState({ signCode: e.detail.value })}
          />
          <View className='confirm-btn' onClick={this.handleConfirm}>
            <Text>确认送达</Text>
          </View>
        </View>
      </View>
    );
  }
}
