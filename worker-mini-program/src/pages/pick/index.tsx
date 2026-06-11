/**
 * 分拣任务列表：支付成功后订单进入 pickTasks，按东/西区筛选
 */
import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { workerApi } from '../../services/api';
import { checkWorkerLogin, navigateTo, getZoneName, PAGE_PATH, showToast } from '../../utils';
import { MVP_ZONES } from '../../config/constants';
import AppButton from '../../components/app-button';
import EmptyState from '../../components/empty-state';
import './index.scss';

type ZoneFilter = 'ALL' | 'EAST' | 'WEST';

interface State {
  tasks: any[];
  zoneFilter: ZoneFilter;
  loading: boolean;
}

const ZONE_TABS: { id: ZoneFilter; name: string }[] = [
  { id: 'ALL', name: '全部' },
  ...MVP_ZONES.map((z) => ({ id: z.id as ZoneFilter, name: z.name })),
];

export default class PickListPage extends Component<{}, State> {
  state: State = { tasks: [], zoneFilter: 'ALL', loading: false };

  componentDidMount() {
    checkWorkerLogin();
    this.loadTasks();
  }

  onShow() {
    if (Taro.getStorageSync('worker_token')) {
      this.loadTasks();
    }
  }

  onPullDownRefresh() {
    this.loadTasks().finally(() => Taro.stopPullDownRefresh());
  }

  loadTasks = async () => {
    this.setState({ loading: true });
    try {
      const tasks = await workerApi.getPickTasks();
      this.setState({ tasks: tasks as any, loading: false });
    } catch (err) {
      console.error(err);
      showToast('加载失败，请检查网络');
      this.setState({ loading: false });
    }
  };

  goDetail = (id: string) => {
    navigateTo(PAGE_PATH.PICK_DETAIL, { id });
  };

  filterByZone = <T extends { zoneId?: string }>(items: T[]) => {
    const { zoneFilter } = this.state;
    if (zoneFilter === 'ALL') return items;
    return items.filter((item) => item.zoneId === zoneFilter);
  };

  render() {
    const { tasks, zoneFilter, loading } = this.state;
    const filteredTasks = this.filterByZone(tasks);

    return (
      <View className='pick-page'>
        <View className='pick-header'>
          <Text className='pick-title'>待分拣 {filteredTasks.length} 单</Text>
        </View>

        <View className='zone-tabs'>
          {ZONE_TABS.map((tab) => (
            <View
              key={tab.id}
              className={`zone-tab ${zoneFilter === tab.id ? 'active' : ''}`}
              onClick={() => this.setState({ zoneFilter: tab.id })}
            >
              <Text>{tab.name}</Text>
            </View>
          ))}
        </View>

        <ScrollView className='pick-list' scrollY>
          {loading && (
            <View className='loading-tip'><Text>加载中...</Text></View>
          )}
          {!loading && filteredTasks.length === 0 && (
            <EmptyState iconName='order' text='暂无待分拣订单' subText='新订单支付后会出现在这里' />
          )}
          {filteredTasks.map((task) => (
            <View key={task.id} className='task-card'>
              <View className='task-top'>
                <Text className='order-no'>#{task.orderNo}</Text>
                <Text className='zone-tag'>{getZoneName(task.zoneId)}</Text>
                <Text className='wait'>等待 {task.waitingMinutes} 分钟</Text>
              </View>
              <Text className='task-addr'>{task.address} · {task.itemCount} 件</Text>
              <AppButton type='primary' size='md' block onClick={() => this.goDetail(task.id)}>
                开始拣货
              </AppButton>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
