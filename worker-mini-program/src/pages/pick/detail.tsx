import { Component } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { checkWorkerLogin, showToast, getZoneName } from '../../utils';
import { STORAGE_ZONES } from '../../config/constants';
import AppButton from '../../components/app-button';
import './index.scss';

interface State {
  detail: any;
  items: any[];
}

export default class PickDetailPage extends Component<{}, State> {
  taskId = '';

  state: State = {
    detail: null,
    items: [],
  };

  componentDidMount() {
    checkWorkerLogin();
    this.taskId = getCurrentInstance().router?.params?.id || 'PT001';
    this.loadDetail();
  }

  loadDetail = async () => {
    try {
      const detail: any = await workerApi.getPickDetail(this.taskId);
      this.setState({
        detail,
        items: detail.items.map((i: any) => ({ ...i })),
      });
    } catch (err: any) {
      showToast(err?.message || '加载失败');
    }
  };

  toggleItem = (index: number) => {
    const items = [...this.state.items];
    items[index] = { ...items[index], picked: !items[index].picked };
    this.setState({ items });
  };

  handleComplete = async () => {
    const allPicked = this.state.items.every((i) => i.picked);
    if (!allPicked) {
      showToast('请先完成全部拣货');
      return;
    }
    try {
      await workerApi.completePick(this.taskId);
      showToast('打包完成，已进入抢单池', 'success');
      setTimeout(() => Taro.navigateBack(), 1000);
    } catch (err: any) {
      showToast(err?.message || '提交失败');
    }
  };

  render() {
    const { detail, items } = this.state;

    if (!detail) {
      return (
        <View className='pick-detail-page'>
          <View className='loading-tip'><Text>加载中...</Text></View>
        </View>
      );
    }

    const allPicked = items.every((i) => i.picked);
    const pickedCount = items.filter((i) => i.picked).length;

    return (
      <View className='pick-detail-page'>
        <View className='detail-header'>
          <Text className='order-no'>#{detail.orderNo}</Text>
          {detail.zoneId && (
            <Text className='zone-badge'>{getZoneName(detail.zoneId)}</Text>
          )}
          <Text className='addr'>{detail.address}</Text>
          <Text className='progress-text'>已拣 {pickedCount}/{items.length} 件</Text>
        </View>

        <ScrollView className='item-list' scrollY>
          <Text className='list-title'>拣货清单（按库位）</Text>
          {items.map((item, index) => (
            <View
              key={item.skuId}
              className={`pick-item ${item.picked ? 'picked' : ''}`}
              onClick={() => this.toggleItem(index)}
            >
              <View className={`check ${item.picked ? 'checked' : ''}`}>
                {item.picked && <Text>✓</Text>}
              </View>
              <View className='item-info'>
                <Text className='item-name'>{item.name}</Text>
                <Text className='item-loc'>
                  {STORAGE_ZONES[item.zone as keyof typeof STORAGE_ZONES]?.icon || '📦'}{' '}
                  {item.location} · {STORAGE_ZONES[item.zone as keyof typeof STORAGE_ZONES]?.label || item.zone}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className='detail-footer'>
          <AppButton type='secondary' size='md' onClick={() => showToast('已上报缺货，等待运营处理')}>
            缺货上报
          </AppButton>
          <AppButton type='primary' size='md' disabled={!allPicked} onClick={this.handleComplete}>
            打包完成
          </AppButton>
        </View>
      </View>
    );
  }
}
