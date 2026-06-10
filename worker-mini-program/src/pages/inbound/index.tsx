import { Component } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import { workerApi } from '../../services/api';
import { mockInboundRecent } from '../../services/mockData';
import { checkWorkerLogin, showToast } from '../../utils';
import './index.scss';

interface State {
  productName: string;
  quantity: string;
  location: string;
  recent: typeof mockInboundRecent;
}

export default class InboundPage extends Component<{}, State> {
  state: State = {
    productName: '农夫山泉 550ml×24瓶',
    quantity: '10',
    location: 'A-012',
    recent: mockInboundRecent,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.loadRecent();
  }

  loadRecent = async () => {
    try {
      const recent = await workerApi.getInboundRecent();
      this.setState({ recent: recent as any });
    } catch {
      // mock
    }
  };

  handleScan = () => {
    showToast('扫码功能开发中，请手动录入');
  };

  handleSubmit = async () => {
    try {
      await workerApi.submitInbound({
        name: this.state.productName,
        quantity: Number(this.state.quantity),
        location: this.state.location,
      });
      showToast('入库成功', 'success');
      this.loadRecent();
    } catch (err: any) {
      showToast(err?.message || '入库失败');
    }
  };

  render() {
    const { productName, quantity, location, recent } = this.state;

    return (
      <View className='inbound-page'>
        <View className='scan-btn' onClick={this.handleScan}>
          <Text className='scan-icon'>📷</Text>
          <Text className='scan-text'>扫描商品条码</Text>
        </View>

        <ScrollView className='inbound-body' scrollY>
          <View className='form-card'>
            <Text className='form-title'>入库信息</Text>
            <Text className='product-name'>{productName}</Text>
            <View className='form-row'>
              <Text className='label'>数量</Text>
              <Input
                className='input'
                type='number'
                value={quantity}
                onInput={(e) => this.setState({ quantity: e.detail.value })}
              />
            </View>
            <View className='form-row'>
              <Text className='label'>库位</Text>
              <Input
                className='input'
                value={location}
                onInput={(e) => this.setState({ location: e.detail.value })}
              />
            </View>
            <View className='submit-btn' onClick={this.handleSubmit}>
              <Text>确认入库</Text>
            </View>
          </View>

          <Text className='section-title'>最近入库</Text>
          {recent.map((item) => (
            <View key={item.id} className='recent-item'>
              <Text className='recent-name'>{item.skuName || item.name} ×{item.qty}</Text>
              <Text className='recent-meta'>{item.location} · {item.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
