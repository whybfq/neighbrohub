import { Component } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockActiveDelivery } from '../../services/mockData';
import { checkWorkerLogin, showToast } from '../../utils';
import './index.scss';

interface State {
  signCode: string;
  order: typeof mockActiveDelivery;
}

export default class DeliveryConfirmPage extends Component<{}, State> {
  taskId = '';

  state: State = {
    signCode: '',
    order: mockActiveDelivery,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.taskId = getCurrentInstance().router?.params?.id || mockActiveDelivery.id;
  }

  handleConfirm = async () => {
    const { signCode } = this.state;
    if (signCode.length !== 6) {
      showToast('请输入6位签收码');
      return;
    }
    if (signCode !== this.state.order.signCode) {
      showToast('签收码错误');
      return;
    }
    try {
      await workerApi.confirmDeliver(this.taskId, signCode);
      showToast('送达成功', 'success');
      setTimeout(() => Taro.navigateBack({ delta: 2 }), 1000);
    } catch {
      showToast('送达成功（Mock）', 'success');
      setTimeout(() => Taro.navigateBack({ delta: 2 }), 1000);
    }
  };

  render() {
    const { signCode, order } = this.state;

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
          <Text className='demo-tip'>内测提示：Mock 签收码 {order.signCode}</Text>
          <View className='confirm-btn' onClick={this.handleConfirm}>
            <Text>确认送达</Text>
          </View>
        </View>
      </View>
    );
  }
}
