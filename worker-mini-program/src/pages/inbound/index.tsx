/** 扫码/手工入库：POST /wms/inbound，记录展示于 /wms/inbound/recent */
import { Component } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockInboundRecent } from '../../services/mockData';
import { checkWorkerLogin, showToast } from '../../utils';
import AppButton from '../../components/app-button';
import EmptyState from '../../components/empty-state';
import './index.scss';

interface State {
  productName: string;
  quantity: string;
  location: string;
  recent: typeof mockInboundRecent;
  submitting: boolean;
}

export default class InboundPage extends Component<{}, State> {
  state: State = {
    productName: '',
    quantity: '1',
    location: '',
    recent: mockInboundRecent,
    submitting: false,
  };

  componentDidMount() {
    checkWorkerLogin();
    this.loadRecent();
  }

  onShow() {
    if (Taro.getStorageSync('worker_token')) {
      this.loadRecent();
    }
  }

  loadRecent = async () => {
    try {
      const recent = await workerApi.getInboundRecent();
      this.setState({ recent: recent as any });
    } catch (err) {
      console.error(err);
    }
  };

  handleScan = () => {
    Taro.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        if (res.result) {
          this.setState({ productName: res.result });
          showToast('扫码成功', 'success');
        }
      },
      fail: () => {
        showToast('扫码取消或不可用，请手动录入');
      },
    });
  };

  handleSubmit = async () => {
    const { productName, quantity, location } = this.state;
    if (!productName.trim()) {
      showToast('请输入商品名称');
      return;
    }
    this.setState({ submitting: true });
    try {
      await workerApi.submitInbound({
        name: productName.trim(),
        quantity: Number(quantity) || 1,
        location: location.trim() || 'A-001',
      });
      showToast('入库成功', 'success');
      this.loadRecent();
    } catch (err: any) {
      showToast(err?.message || '入库失败');
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { productName, quantity, location, recent, submitting } = this.state;

    return (
      <View className='inbound-page'>
        <View className='scan-btn' hoverClass='card-pressed' onClick={this.handleScan}>
          <Text className='scan-icon'>📷</Text>
          <Text className='scan-text'>扫描商品条码</Text>
        </View>

        <ScrollView className='inbound-body' scrollY>
          <View className='form-card'>
            <Text className='form-title'>入库信息</Text>
            <View className='form-row'>
              <Text className='label'>商品</Text>
              <Input
                className='input flex-input'
                value={productName}
                placeholder='商品名称'
                onInput={(e) => this.setState({ productName: e.detail.value })}
              />
            </View>
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
            <AppButton type='primary' size='lg' block disabled={submitting} onClick={this.handleSubmit}>
              {submitting ? '提交中...' : '确认入库'}
            </AppButton>
          </View>

          <Text className='section-title'>最近入库</Text>
          {recent.length === 0 ? (
            <EmptyState iconName='empty' text='暂无入库记录' />
          ) : (
            recent.map((item) => (
              <View key={item.id} className='recent-item'>
                <Text className='recent-name'>{item.skuName || item.name} ×{item.qty}</Text>
                <Text className='recent-meta'>{item.location} · {item.time}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }
}
