import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { workerApi } from '../../services/api';
import { mockPickTasks } from '../../services/mockData';
import { checkWorkerLogin, navigateTo, PAGE_PATH } from '../../utils';
import { MVP_ZONES } from '../../config/constants';
import './index.scss';

type ZoneFilter = 'ALL' | 'EAST' | 'WEST';

interface State {
  tasks: typeof mockPickTasks;
  zoneFilter: ZoneFilter;
}

const ZONE_TABS: { id: ZoneFilter; name: string }[] = [
  { id: 'ALL', name: '全部' },
  ...MVP_ZONES.map((z) => ({ id: z.id as ZoneFilter, name: z.name })),
];

export default class PickListPage extends Component<{}, State> {
  state: State = { tasks: mockPickTasks, zoneFilter: 'ALL' };

  componentDidMount() {
    checkWorkerLogin();
    this.loadTasks();
  }

  loadTasks = async () => {
    try {
      const tasks = await workerApi.getPickTasks();
      this.setState({ tasks: tasks as any });
    } catch {
      // mock
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
    const { tasks, zoneFilter } = this.state;
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
          {filteredTasks.length === 0 && (
            <View className='empty-list'>
              <Text>当前分区暂无待分拣订单</Text>
            </View>
          )}
          {filteredTasks.map((task) => (
            <View key={task.id} className='task-card' onClick={() => this.goDetail(task.id)}>
              <View className='task-top'>
                <Text className='order-no'>#{task.orderNo}</Text>
                <Text className='wait'>等待 {task.waitingMinutes} 分钟</Text>
              </View>
              <Text className='task-addr'>{task.address} · {task.itemCount} 件</Text>
              <View className='task-btn'>
                <Text>开始拣货</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
