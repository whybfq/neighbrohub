import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { userApi } from '../../services/api';
import { navigateTo, showToast, PAGE_PATH } from '../../utils';
import { MVP_COMMUNITY } from '../../config/constants';
import './index.scss';

interface State {
  addresses: any[];
  loading: boolean;
}

export default class AddressPage extends Component<{}, State> {
  state: State = {
    addresses: [],
    loading: true,
  };

  componentDidMount() {
    this.loadAddresses();
  }

  onShow() {
    this.loadAddresses();
  }

  loadAddresses = async () => {
    this.setState({ loading: true });
    try {
      const addresses = await userApi.getAddresses();
      this.setState({ addresses: addresses as any[] });
    } catch {
      showToast('加载地址失败');
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSetDefault = async (id: string) => {
    try {
      await userApi.updateAddress(id, { isDefault: true });
      showToast('已设为默认地址', 'success');
      this.loadAddresses();
    } catch {
      showToast('设置失败');
    }
  };

  handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除地址',
      content: '确定删除该收货地址吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await userApi.deleteAddress(id);
            showToast('已删除', 'success');
            this.loadAddresses();
          } catch {
            showToast('删除失败');
          }
        }
      },
    });
  };

  handleAdd = () => {
    navigateTo(PAGE_PATH.BIND_COMMUNITY, { from: 'address' });
  };

  render() {
    const { addresses, loading } = this.state;

    return (
      <View className='address-page'>
        <View className='address-header'>
          <Text className='address-title'>收货地址</Text>
          <Text className='address-subtitle'>{MVP_COMMUNITY.name} · 东区 / 西区</Text>
        </View>

        <ScrollView className='address-list' scrollY>
          {loading && (
            <View className='address-empty'>
              <Text>加载中...</Text>
            </View>
          )}

          {!loading && addresses.length === 0 && (
            <View className='address-empty'>
              <Text className='empty-icon'>📍</Text>
              <Text className='empty-text'>暂无收货地址</Text>
              <Text className='empty-desc'>添加山屿西山著东/西区地址后即可下单</Text>
            </View>
          )}

          {addresses.map((addr) => (
            <View key={addr.id} className='address-card'>
              <View className='card-top'>
                <View className='contact-row'>
                  <Text className='contact-name'>{addr.name}</Text>
                  <Text className='contact-phone'>{addr.phone}</Text>
                  {addr.isDefault && <Text className='default-tag'>默认</Text>}
                </View>
                <Text className='zone-tag'>{addr.zone}</Text>
              </View>
              <Text className='full-address'>{addr.address}</Text>
              <View className='card-actions'>
                {!addr.isDefault && (
                  <Text className='action-btn' onClick={() => this.handleSetDefault(addr.id)}>
                    设为默认
                  </Text>
                )}
                <Text className='action-btn danger' onClick={() => this.handleDelete(addr.id)}>
                  删除
                </Text>
              </View>
            </View>
          ))}

          <View className='list-bottom' />
        </ScrollView>

        <View className='add-bar'>
          <View className='add-btn' onClick={this.handleAdd}>
            <Text>+ 新增收货地址</Text>
          </View>
        </View>
      </View>
    );
  }
}
