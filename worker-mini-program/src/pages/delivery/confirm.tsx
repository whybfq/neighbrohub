/** 送达确认：输入消费者订单 6 位签收码，POST /delivery/tasks/:id/deliver */
import { Component } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { checkWorkerLogin, showToast, PAGE_PATH } from '../../utils';
import AppButton from '../../components/app-button';
import EmptyState from '../../components/empty-state';
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
  submitting: boolean;
}

export default class DeliveryConfirmPage extends Component<{}, State> {
  taskId = '';

  state: State = {
    signCode: '',
    order: null,
    loading: true,
    submitting: false,
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
        this.setState({ order: active, loading: false });
        if (!this.taskId) this.taskId = active.id;
      } else {
        this.setState({ loading: false });
      }
    } catch (err: any) {
      this.setState({ loading: false });
      showToast(err?.message || '加载失败');
    }
  };

  handleConfirm = async () => {
    const { signCode, order, submitting } = this.state;
    if (submitting) return;
    if (!order) {
      showToast('暂无配送任务');
      return;
    }
    if (signCode.length !== 6) {
      showToast('请输入6位签收码');
      return;
    }
    this.setState({ submitting: true });
    try {
      await workerApi.confirmDeliver(this.taskId || order.id, signCode);
      showToast('送达成功', 'success');
      setTimeout(() => Taro.switchTab({ url: PAGE_PATH.DELIVERY }), 1000);
    } catch (err: any) {
      showToast(err.message || '签收失败');
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { signCode, order, loading, submitting } = this.state;

    if (loading) {
      return (
        <View className='confirm-page'>
          <View className='loading-tip'><Text>加载中...</Text></View>
        </View>
      );
    }

    if (!order) {
      return (
        <View className='confirm-page'>
          <EmptyState iconName='order' text='暂无配送中订单' subText='请先在配送页抢单' />
          <View className='back-wrap'>
            <AppButton type='ghost' size='md' block onClick={() => Taro.switchTab({ url: PAGE_PATH.DELIVERY })}>
              返回配送页
            </AppButton>
          </View>
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
          <AppButton
            type='primary'
            size='lg'
            block
            disabled={submitting || signCode.length !== 6}
            onClick={this.handleConfirm}
          >
            {submitting ? '提交中...' : '确认送达'}
          </AppButton>
        </View>
      </View>
    );
  }
}
