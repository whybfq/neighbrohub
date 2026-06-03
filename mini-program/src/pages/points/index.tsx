import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { pointsApi } from '../../services/api';
import { usePointsStore } from '../../store';
import { showToast, showConfirm, formatPrice } from '../../utils';
import { POINTS_RECORD_TYPE } from '../../config/constants';
import './index.scss';

interface State {
  services: any[];
  records: any[];
  exchanges: any[];
  activeTab: 'services' | 'records' | 'exchanges';
  loading: boolean;
  exchangingId: string | null;
  exchangeSuccess: boolean;
}

export default class PointsPage extends Component<{}, State> {
  state: State = {
    services: [],
    records: [],
    exchanges: [],
    activeTab: 'services',
    loading: true,
    exchangingId: null,
    exchangeSuccess: false
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true });
    try {
      const [services, records, exchanges] = await Promise.all([
        pointsApi.getServices(),
        pointsApi.getPointsRecords({ page: 1, pageSize: 20 }),
        pointsApi.getExchangeRecords({ page: 1, pageSize: 20 })
      ]);

      const store = usePointsStore.getState();
      store.setServices(services);
      store.setRecords(records);
      store.setExchanges(exchanges);

      this.setState({ services, records, exchanges, loading: false });
    } catch (err) {
      console.error('加载积分数据失败:', err);
      this.setState({ loading: false });
    }
  };

  // 兑换服务
  handleExchange = async (service: any) => {
    const store = usePointsStore.getState();
    if (store.totalPoints < service.pointsPrice) {
      showToast(`积分不足，还需 ${service.pointsPrice - store.totalPoints} 积分`);
      return;
    }

    const confirmed = await showConfirm(
      '确认兑换',
      `使用 ${service.pointsPrice} 积分兑换「${service.name}」？\n市场价：¥${formatPrice(service.marketPrice)}`
    );

    if (!confirmed) return;

    this.setState({ exchangingId: service.id });

    try {
      await pointsApi.exchangeService(service.id);
      store.spendPoints(service.pointsPrice);

      // 兑换成功动画
      this.setState({ exchangingId: null, exchangeSuccess: true });
      showToast('兑换成功！', 'success');

      // 2秒后隐藏成功动画
      setTimeout(() => {
        this.setState({ exchangeSuccess: false });
      }, 2000);

      this.loadData();
    } catch (err: any) {
      this.setState({ exchangingId: null });
      showToast(err.message || '兑换失败');
    }
  };

  // 切换Tab
  switchTab = (tab: 'services' | 'records' | 'exchanges') => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { services, records, exchanges, activeTab, loading, exchangingId, exchangeSuccess } = this.state;
    const store = usePointsStore.getState();

    if (loading) {
      return (
        <View className='points-page'>
          <View className='loading-wrap'>
            <Text>加载中...</Text>
          </View>
        </View>
      );
    }

    return (
      <View className='points-page'>
        {/* 兑换成功动画 */}
        {exchangeSuccess && (
          <View className='exchange-success-overlay'>
            <View className='success-card'>
              <Text className='success-icon'>🎉</Text>
              <Text className='success-title'>兑换成功！</Text>
              <Text className='success-desc'>服务将在24小时内生效</Text>
            </View>
          </View>
        )}

        {/* 积分头部 */}
        <View className='points-header'>
          <View className='header-bg' />
          <View className='header-content'>
            <Text className='header-title'>我的积分</Text>
            <View className='points-balance'>
              <Text className='balance-num'>{store.totalPoints.toLocaleString()}</Text>
              <Text className='balance-unit'>积分</Text>
            </View>
            <Text className='points-rule'>💡 消费1元 = 1积分，永不过期</Text>
            <View className='points-stats'>
              <View className='stat-item'>
                <Text className='stat-value'>{store.totalEarned.toLocaleString()}</Text>
                <Text className='stat-label'>累计获得</Text>
              </View>
              <View className='stat-divider' />
              <View className='stat-item'>
                <Text className='stat-value'>{store.totalSpent.toLocaleString()}</Text>
                <Text className='stat-label'>已使用</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab切换 */}
        <View className='tab-bar'>
          <View
            className={`tab-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => this.switchTab('services')}
          >
            <Text>兑换服务</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => this.switchTab('records')}
          >
            <Text>积分明细</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'exchanges' ? 'active' : ''}`}
            onClick={() => this.switchTab('exchanges')}
          >
            <Text>兑换记录</Text>
          </View>
        </View>

        <ScrollView className='points-body' scrollY>
          {/* 兑换服务列表 */}
          {activeTab === 'services' && (
            <View className='services-section'>
              {services.length === 0 ? (
                <View className='empty-state'>
                  <Text className='empty-icon'>🎁</Text>
                  <Text className='empty-text'>暂无兑换服务</Text>
                </View>
              ) : (
                <View className='services-grid'>
                  {services.map(service => (
                    <View key={service.id} className='service-card'>
                      <View className='service-img'>
                        <Text className='service-icon'>{service.icon}</Text>
                        {service.tags && service.tags.map((tag: string, i: number) => (
                          <Text key={i} className='service-tag'>{tag}</Text>
                        ))}
                      </View>
                      <View className='service-info'>
                        <Text className='service-name'>{service.name}</Text>
                        <Text className='service-desc'>{service.description}</Text>
                        <View className='service-meta'>
                          <Text className='meta-item'>已兑 {service.sales} 次</Text>
                          <Text className='meta-item'>剩余 {service.stock} 份</Text>
                        </View>
                        <View className='service-bottom'>
                          <View className='service-price'>
                            <Text className='price-points'>{service.pointsPrice.toLocaleString()}</Text>
                            <Text className='price-unit'>积分</Text>
                          </View>
                          <View className='market-price'>
                            <Text>价值 ¥{formatPrice(service.marketPrice)}</Text>
                          </View>
                        </View>
                        <View
                          className={`exchange-btn ${store.totalPoints < service.pointsPrice ? 'disabled' : ''} ${exchangingId === service.id ? 'exchanging' : ''}`}
                          onClick={() => this.handleExchange(service)}
                        >
                          <Text>
                            {exchangingId === service.id
                              ? '兑换中...'
                              : store.totalPoints < service.pointsPrice
                                ? `还差 ${service.pointsPrice - store.totalPoints} 积分`
                                : '立即兑换'
                            }
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 积分明细 */}
          {activeTab === 'records' && (
            <View className='records-section'>
              {records.length === 0 ? (
                <View className='empty-state'>
                  <Text className='empty-icon'>📊</Text>
                  <Text className='empty-text'>暂无积分记录</Text>
                </View>
              ) : (
                <View className='records-list'>
                  {records.map(record => (
                    <View key={record.id} className='record-item'>
                      <View className='record-left'>
                        <View className={`record-icon ${record.type}`}>
                          <Text>{record.type === POINTS_RECORD_TYPE.EARN ? '➕' : '➖'}</Text>
                        </View>
                        <View className='record-info'>
                          <Text className='record-desc'>{record.description}</Text>
                          <Text className='record-time'>{record.createdAt}</Text>
                        </View>
                      </View>
                      <View className='record-right'>
                        <Text className={`record-amount ${record.type}`}>
                          {record.type === POINTS_RECORD_TYPE.EARN ? '+' : '-'}{record.amount.toLocaleString()}
                        </Text>
                        <Text className='record-unit'>积分</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 兑换记录 */}
          {activeTab === 'exchanges' && (
            <View className='exchanges-section'>
              {exchanges.length === 0 ? (
                <View className='empty-state'>
                  <Text className='empty-icon'>📋</Text>
                  <Text className='empty-text'>暂无兑换记录</Text>
                </View>
              ) : (
                <View className='exchanges-list'>
                  {exchanges.map(exchange => (
                    <View key={exchange.id} className='exchange-item'>
                      <View className='exchange-left'>
                        <View className='exchange-icon'>
                          <Text>🎫</Text>
                        </View>
                        <View className='exchange-info'>
                          <Text className='exchange-name'>{exchange.serviceName}</Text>
                          <Text className='exchange-time'>兑换时间：{exchange.createdAt}</Text>
                          <Text className='exchange-date'>服务日期：{exchange.serviceDate}</Text>
                        </View>
                      </View>
                      <View className='exchange-right'>
                        <Text className='exchange-status completed'>
                          {exchange.status === 'completed' ? '已完成' : '处理中'}
                        </Text>
                        <Text className='exchange-points'>-{exchange.points.toLocaleString()}积分</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View className='safe-bottom' />
        </ScrollView>
      </View>
    );
  }
}
