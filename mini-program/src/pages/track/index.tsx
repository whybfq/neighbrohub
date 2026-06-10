import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { orderApi } from '../../services/api';
import { mockOrderTracks } from '../../services/mockData';
import { maskPhone, showToast } from '../../utils';
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
}

export default class TrackPage extends Component<{}, State> {
  orderId = '';

  state: State = {
    track: null,
    loading: true,
  };

  componentDidMount() {
    const params = getCurrentInstance().router?.params;
    this.orderId = params?.id || 'O001';
    this.loadTrack();
  }

  loadTrack = async () => {
    this.setState({ loading: true });
    try {
      const track = await orderApi.getOrderTrack(this.orderId);
      this.setState({ track });
    } catch (err) {
      this.setState({ track: mockOrderTracks[this.orderId] || mockOrderTracks.O001 });
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
    showToast('客服功能开发中');
  };

  render() {
    const { track, loading } = this.state;

    if (loading || !track) {
      return (
        <View className='track-page'>
          <View className='track-loading'>
            <Text>加载配送信息...</Text>
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
                <Text>联系客服</Text>
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
