import { Component } from 'react';
import { View, Text, Input, Picker, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { userApi } from '../../services/api';
import { mockCommunity } from '../../services/mockData';
import { showToast, navigateTo, PAGE_PATH } from '../../utils';
import './index.scss';

interface State {
  step: number;
  community: any;
  selectedBuilding: string;
  selectedUnit: string;
  roomNumber: string;
  buildings: any[];
  units: string[];
  submitting: boolean;
}

export default class BindCommunityPage extends Component<{}, State> {
  state: State = {
    step: 1,
    community: mockCommunity,
    selectedBuilding: '',
    selectedUnit: '',
    roomNumber: '',
    buildings: [],
    units: [],
    submitting: false
  };

  componentDidMount() {
    this.loadCommunityInfo();
  }

  loadCommunityInfo = () => {
    // 实际项目通过定位或搜索获取小区信息
    this.setState({
      community: mockCommunity,
      buildings: mockCommunity.buildings
    });
  };

  // 选择楼栋
  handleBuildingChange = (e: any) => {
    const index = e.detail.value;
    const building = this.state.buildings[index];
    this.setState({
      selectedBuilding: building.id,
      units: building.units,
      selectedUnit: ''
    });
  };

  // 选择单元
  handleUnitChange = (e: any) => {
    const index = e.detail.value;
    this.setState({ selectedUnit: this.state.units[index] });
  };

  // 切换小区
  handleSwitchCommunity = () => {
    Taro.showActionSheet({
      itemList: ['阳光花园小区', '翠竹苑小区', '碧海蓝天小区', '金色家园小区'],
      success: (res) => {
        const communities = ['阳光花园小区', '翠竹苑小区', '碧海蓝天小区', '金色家园小区'];
        showToast(`已选择：${communities[res.tapIndex]}`);
      }
    });
  };

  // 申请成为楼长
  handleApplyLeader = () => {
    Taro.showModal({
      title: '成为楼长',
      content: '绑定小区后，您可以申请成为楼长，分享商品给邻居赚取佣金。要查看楼长申请详情吗？',
      success: (res) => {
        if (res.confirm) {
          navigateTo(PAGE_PATH.DISTRIBUTION);
        }
      }
    });
  };

  // 提交绑定
  handleSubmit = async () => {
    const { selectedBuilding, selectedUnit, roomNumber, community } = this.state;

    if (!selectedBuilding) {
      Taro.showToast({ title: '请选择楼栋', icon: 'none' });
      return;
    }
    if (!selectedUnit) {
      Taro.showToast({ title: '请选择单元', icon: 'none' });
      return;
    }
    if (!roomNumber.trim()) {
      Taro.showToast({ title: '请输入房间号', icon: 'none' });
      return;
    }

    this.setState({ submitting: true });

    try {
      await userApi.bindCommunity({
        communityId: community.id,
        buildingId: selectedBuilding,
        unit: selectedUnit,
        room: roomNumber.trim()
      });

      const store = useUserStore.getState();
      const building = this.state.buildings.find(b => b.id === selectedBuilding);
      store.setCommunity(community);
      store.setBuilding({ id: selectedBuilding, name: building?.name, unit: selectedUnit, room: roomNumber });

      Taro.showToast({ title: '绑定成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '绑定失败', icon: 'none' });
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { step, community, selectedBuilding, selectedUnit, roomNumber, buildings, units, submitting } = this.state;

    return (
      <View className='bind-page'>
        {/* 头部 */}
        <View className='bind-header'>
          <Text className='bind-title'>🏘️ 绑定您的小区</Text>
          <Text className='bind-desc'>绑定小区和楼栋，享受本社区专属服务</Text>
        </View>

        {/* 步骤条 */}
        <View className='steps'>
          <View className={`step ${step >= 1 ? 'active' : ''}`}>
            <View className='step-num'>1</View>
            <Text className='step-text'>确认小区</Text>
          </View>
          <View className='step-line' />
          <View className={`step ${step >= 2 ? 'active' : ''}`}>
            <View className='step-num'>2</View>
            <Text className='step-text'>选择楼栋</Text>
          </View>
          <View className='step-line' />
          <View className={`step ${step >= 3 ? 'active' : ''}`}>
            <View className='step-num'>3</View>
            <Text className='step-text'>完成绑定</Text>
          </View>
        </View>

        {/* 表单区域 */}
        <View className='bind-form'>
          {/* 小区信息 */}
          <View className='form-section'>
            <View className='section-title'>📍 所在小区</View>
            <View className='community-card'>
              <Text className='community-name'>{community.name}</Text>
              <Text className='community-addr'>{community.address}</Text>
              <Text className='change-btn' onClick={this.handleSwitchCommunity}>不是我的小区？切换</Text>
            </View>
          </View>

          {/* 选择楼栋 */}
          <View className='form-section'>
            <View className='section-title'>🏢 选择楼栋</View>
            <View className='building-grid'>
              {buildings.map(building => (
                <View
                  key={building.id}
                  className={`building-item ${selectedBuilding === building.id ? 'active' : ''}`}
                  onClick={() => {
                    this.setState({
                      selectedBuilding: building.id,
                      units: building.units,
                      selectedUnit: ''
                    });
                  }}
                >
                  <Text className='building-name'>{building.name}</Text>
                  <Text className='building-units'>{building.units.length}个单元</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 选择单元 */}
          {selectedBuilding && (
            <View className='form-section'>
              <View className='section-title'>🚪 选择单元</View>
              <View className='unit-grid'>
                {units.map(unit => (
                  <View
                    key={unit}
                    className={`unit-item ${selectedUnit === unit ? 'active' : ''}`}
                    onClick={() => this.setState({ selectedUnit: unit })}
                  >
                    {unit}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 房间号 */}
          {selectedUnit && (
            <View className='form-section'>
              <View className='section-title'>🏠 房间号</View>
              <View className='room-input-wrap'>
                <Input
                  className='room-input'
                  type='text'
                  placeholder='例如：1501'
                  value={roomNumber}
                  onInput={(e: any) => this.setState({ roomNumber: e.detail.value })}
                  maxlength={10}
                />
                <Text className='room-hint'>仅用于配送识别，不会公开</Text>
              </View>
            </View>
          )}

          {/* 提交按钮 */}
          <View className='submit-area'>
            <Button
              className='submit-btn'
              loading={submitting}
              disabled={submitting || !selectedBuilding || !selectedUnit || !roomNumber.trim()}
              onClick={this.handleSubmit}
            >
              确认绑定，开始购物
            </Button>
          </View>

          {/* 楼长申请提示 */}
          <View className='leader-tip'>
            <Text className='tip-icon'>💡</Text>
            <Text className='tip-text'>
              绑定完成后，您也可以申请成为
              <Text className='highlight' onClick={this.handleApplyLeader}>楼长</Text>
              ，分享商品给邻居赚取佣金哦！
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
