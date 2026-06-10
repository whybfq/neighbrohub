import { Component } from 'react';
import { View, Text, Input, Picker, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { userApi, communityApi } from '../../services/api';
import { mockCommunity } from '../../services/mockData';
import { showToast, navigateTo, PAGE_PATH } from '../../utils';
import { MVP_COMMUNITY, MVP_FEATURES, MVP_ZONES, formatMvpAddress } from '../../config/constants';
import './index.scss';

interface State {
  step: number;
  community: any;
  selectedZone: string;
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
    selectedZone: MVP_ZONES[0].id,
    selectedBuilding: '',
    selectedUnit: '',
    roomNumber: '',
    buildings: mockCommunity.zones[0].buildings,
    units: [],
    submitting: false
  };

  componentDidMount() {
    this.loadCommunityInfo();
  }

  loadCommunityInfo = async () => {
    try {
      const community = await communityApi.getCommunityInfo();
      const zoneId = this.state.selectedZone || MVP_ZONES[0].id;
      const zone = community.zones?.find((z: any) => z.id === zoneId) || community.zones[0];
      this.setState({
        community,
        buildings: zone?.buildings || [],
      });
    } catch {
      this.setState({
        community: mockCommunity,
        buildings: mockCommunity.zones[0].buildings,
      });
    }
  };

  getCurrentZone = () => {
    const { community, selectedZone } = this.state;
    return community.zones?.find((z: any) => z.id === selectedZone) || community.zones[0];
  };

  handleZoneChange = (zoneId: string) => {
    const zone = this.state.community.zones.find((z: any) => z.id === zoneId);
    this.setState({
      selectedZone: zoneId,
      buildings: zone?.buildings || [],
      selectedBuilding: '',
      selectedUnit: '',
      units: [],
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

  // 切换东西区（MVP 仅服务山屿西山著）
  handleSwitchZone = () => {
    Taro.showActionSheet({
      itemList: MVP_ZONES.map((z) => z.name),
      success: (res) => {
        const zone = MVP_ZONES[res.tapIndex];
        this.handleZoneChange(zone.id);
        showToast(`已选择：${MVP_COMMUNITY.name}${zone.name}`);
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
    const { selectedBuilding, selectedUnit, roomNumber, community, selectedZone } = this.state;

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
      const zone = community.zones.find((z: any) => z.id === selectedZone);
      const building = this.state.buildings.find(b => b.id === selectedBuilding);
      const fullAddress = formatMvpAddress(zone.name, building?.name || '', selectedUnit, roomNumber.trim());
      const store = useUserStore.getState();

      await userApi.bindCommunity({
        communityId: community.id,
        buildingId: selectedBuilding,
        unit: selectedUnit,
        room: roomNumber.trim(),
        zoneId: zone?.id,
        zoneName: zone?.name,
        buildingName: building?.name,
        contactName: store.userInfo?.nickname,
        contactPhone: store.userInfo?.phone,
        fullAddress,
      });

      store.setCommunity(community);
      store.setBuilding({ id: selectedBuilding, name: building?.name, unit: selectedUnit, room: roomNumber });
      store.setUserInfo({
        ...(store.userInfo || {}),
        community,
        zone: zone ? { id: zone.id, name: zone.name } : undefined,
      });

      Taro.showToast({ title: '绑定成功', icon: 'success' });

      const from = Taro.getCurrentInstance().router?.params?.from;
      setTimeout(() => {
        if (from === 'address' || from === 'order') {
          Taro.navigateBack();
        } else {
          Taro.switchTab({ url: PAGE_PATH.INDEX });
        }
      }, 1500);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '绑定失败', icon: 'none' });
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { step, community, selectedZone, selectedBuilding, selectedUnit, roomNumber, buildings, units, submitting } = this.state;
    const currentZone = this.getCurrentZone();

    return (
      <View className='bind-page'>
        {/* 头部 */}
        <View className='bind-header'>
          <Text className='bind-title'>🏘️ 绑定您的地址</Text>
          <Text className='bind-desc'>选择山屿西山著东区或西区，享受专属配送</Text>
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
          {/* 小区与分区 */}
          <View className='form-section'>
            <View className='section-title'>📍 所在社区</View>
            <View className='community-card'>
              <Text className='community-name'>{community.name}</Text>
              <Text className='community-addr'>{community.address}</Text>
              <Text className='change-btn' onClick={this.handleSwitchZone}>切换东西区</Text>
            </View>
          </View>

          {/* 选择东西区 */}
          <View className='form-section'>
            <View className='section-title'>🧭 选择分区</View>
            <View className='building-grid'>
              {community.zones.map((zone: any) => (
                <View
                  key={zone.id}
                  className={`building-item ${selectedZone === zone.id ? 'active' : ''}`}
                  onClick={() => this.handleZoneChange(zone.id)}
                >
                  <Text className='building-name'>{zone.name}</Text>
                  <Text className='building-units'>{zone.buildings.length}栋楼</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 选择楼栋 */}
          <View className='form-section form-section--scroll'>
            <View className='section-title'>🏢 {currentZone.name} · 选择楼栋（共 {buildings.length} 栋）</View>
            <ScrollView className='building-scroll' scrollY enhanced showScrollbar={false}>
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
            </ScrollView>
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

          {!MVP_FEATURES.DISTRIBUTION && (
          <View className='leader-tip'>
            <Text className='tip-icon'>💡</Text>
            <Text className='tip-text'>
              MVP 当前仅服务山屿西山著东区、西区，绑定后可在首页下单。
            </Text>
          </View>
          )}
          {MVP_FEATURES.DISTRIBUTION && (
          <View className='leader-tip'>
            <Text className='tip-icon'>💡</Text>
            <Text className='tip-text'>
              绑定完成后，您也可以申请成为
              <Text className='highlight' onClick={this.handleApplyLeader}>楼长</Text>
              ，分享商品给邻居赚取佣金哦！
            </Text>
          </View>
          )}
        </View>
      </View>
    );
  }
}
