import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { orderApi } from '../../services/api';
import { maskPhone, showToast } from '../../utils';
import { MVP_COMMUNITY } from '../../config/constants';
import EmptyState from '../../components/empty-state/index';
import AppButton from '../../components/app-button';
import './index.scss';

interface TimelineItem {
  step: string;
  text: string;
  time: string | null;
  done: boolean;
  current?: boolean;
  extra?: string;
}

interface TrackData {
  orderNo: string;
  statusText: string;
  etaText: string;
  signCode: string;
  address: string;
  contactName: string;
  contactPhone: string;
  courier?: { name: string; phone: string };
  timeline: TimelineItem[];
}

interface State {
  track: TrackData | null;
  loading: boolean;
  loadError: boolean;
}

export default class TrackPage extends Component<{}, State> {
  orderId = '';

  state: State = {
    track: null,
    loading: true,
    loadError: false,
  };

  componentDidMount() {
    const params = getCurrentInstance().router?.params;
    this.orderId = params?.id || '';
    if (!this.orderId) {
      this.setState({ loading: false, loadError: true });
      return;
    }
    this.loadTrack();
  }

  onShow() {
    if (this.orderId) {
      this.loadTrack();
    }
  }

  onPullDownRefresh() {
    this.loadTrack().finally(() => Taro.stopPullDownRefresh());
  }

  loadTrack = async () => {
    this.setState({ loading: true, loadError: false });
    try {
      const track = await orderApi.getOrderTrack(this.orderId);
      this.setState({ track: track as TrackData });
    } catch (err) {
      console.error('加载配送追踪失败', err);
      this.setState({ track: null, loadError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  formatTimelineTime = (time: string | null) => {
    if (!time) return '—';
    const date = new Date(time.replace(/-/g, '/'));
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  handleContact = () => {
    const { track } = this.state;
    if (track?.courier?.phone && !track.courier.phone.includes('*')) {
      Taro.makePhoneCall({ phoneNumber: track.courier.phone }).catch(() => {
        showToast('无法拨号，请稍后重试');
      });
      return;
    }
    showToast(`请联系${MVP_COMMUNITY.warehouseName}`);
  };

  render() {
    const { track, loading, loadError } = this.state;

    if (loading) {
      return (
        <View className='track-page'>
          <View className='track-loading'>
            <Text>加载配送信息...</Text>
          </View>
        </View>
      );
    }

    if (loadError || !track) {
      return (
        <View className='track-page'>
          <EmptyState iconName='order' text='暂无配送信息' subText='请确认订单号或稍后重试' />
          <View style={{ padding: '24px' }}>
            <AppButton type='ghost' size='md' block onClick={this.loadTrack}>重新加载</AppButton>
          </View>
        </View>
      );
    }

    const signDigits = (track.signCode || '').split('');

    return (
      <View className='track-page'>
        <View className='track-header'>
          <Text className='track-status'>{track.statusText}</Text>
          <Text className='track-eta'>预计 {track.etaText}送达</Text>
          <Text className='track-order-no'>订单号 {track.orderNo}</Text>
        </View>

        <ScrollView className='track-body' scrollY>
          {track.courier && (
            <View className='courier-card'>
              <View className='courier-avatar'>
                <Text>🛵</Text>
              </View>
              <View className='courier-info'>
                <Text className='courier-name'>{track.courier.name}</Text>
                <Text className='courier-phone'>{maskPhone(track.courier.phone)}</Text>
              </View>
              <View className='courier-action' onClick={this.handleContact}>
                <Text>联系配送</Text>
              </View>
            </View>
          )}

          <View className='timeline-card'>
            {track.timeline.map((item, index) => (
              <View
                key={item.step + index}
                className={`timeline-item ${item.done ? 'done' : 'pending'} ${item.current ? 'current' : ''}`}
              >
                <View className='tl-dot' />
                <View className='tl-content'>
                  <Text className='tl-text'>{item.text}</Text>
                  <Text className='tl-time'>{this.formatTimelineTime(item.time)}</Text>
                  {item.extra && <Text className='tl-extra'>{item.extra}</Text>}
                </View>
              </View>
            ))}
          </View>

          {signDigits.length > 0 && (
            <View className='sign-code-card'>
              <Text className='sign-label'>签收码（送达时向配送员出示）</Text>
              <View className='sign-digits'>
                {signDigits.map((digit, index) => (
                  <View key={index} className='sign-digit'>
                    <Text>{digit}</Text>
                  </View>
                ))}
              </View>
              <Text className='sign-tip'>配送员送达时需输入此码确认</Text>
            </View>
          )}

          <View className='address-card'>
            <Text className='address-label'>配送地址</Text>
            <Text className='address-text'>{track.address}</Text>
            <Text className='address-contact'>
              {track.contactName} {maskPhone(track.contactPhone)}
            </Text>
          </View>

          <View className='safe-bottom' />
        </ScrollView>
      </View>
    );
  }
}
