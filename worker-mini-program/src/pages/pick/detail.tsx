import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { mockPickDetail } from '../../services/mockData';
import { checkWorkerLogin, showToast } from '../../utils';
import { STORAGE_ZONES } from '../../config/constants';
import './index.scss';

interface State {
  detail: typeof mockPickDetail;
  items: any[];
}

export default class PickDetailPage extends Component<{}, State> {
  taskId = '';

  state: State = {
    detail: mockPickDetail,
    items: mockPickDetail.items.map((i) => ({ ...i })),
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
    } catch {
      // mock
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
      showToast('打包完成', 'success');
      setTimeout(() => Taro.navigateBack(), 1000);
    } catch {
      showToast('打包完成（Mock）', 'success');
      setTimeout(() => Taro.navigateBack(), 1000);
    }
  };

  render() {
    const { detail, items } = this.state;
    const allPicked = items.every((i) => i.picked);

    return (
      <View className='pick-detail-page'>
        <View className='detail-header'>
          <Text className='order-no'>#{detail.orderNo}</Text>
          <Text className='addr'>{detail.address}</Text>
        </View>

        <ScrollView className='item-list' scrollY>
          <Text className='list-title'>拣货清单（按库位排序）</Text>
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
          <View className='btn-outline' onClick={() => showToast('已上报缺货')}>
            <Text>缺货上报</Text>
          </View>
          <View className={`btn-primary ${allPicked ? '' : 'disabled'}`} onClick={this.handleComplete}>
            <Text>打包完成</Text>
          </View>
        </View>
      </View>
    );
  }
}
