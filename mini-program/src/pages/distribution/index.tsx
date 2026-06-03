import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { distributionApi } from '../../services/api';
import { mockDistributionData } from '../../services/mockData';
import { formatPrice, copyText, showToast, navigateTo } from '../../utils';
import { COMMISSION_RATE } from '../../config/constants';
import './index.scss';

interface State {
  data: any;
  activeSubTab: string;
  loading: boolean;
}

export default class DistributionPage extends Component<{}, State> {
  state: State = {
    data: mockDistributionData,
    activeSubTab: 'commissions',
    loading: false
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true });
    try {
      const data = await distributionApi.getDistributionData();
      this.setState({ data });
    } catch (err) {
      // 使用模拟数据
    } finally {
      this.setState({ loading: false });
    }
  };

  // 复制邀请码
  handleCopyCode = () => {
    const { data } = this.state;
    copyText(data.inviteCode);
  };

  // 分享邀请
  handleShare = () => {
    const store = useUserStore.getState();
    const code = store.userInfo?.distributorCode || '';
    const { data } = this.state;

    // 在小程序中触发分享
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    // 同时提供复制链接功能
    Taro.showModal({
      title: '分享邀请',
      content: `您的邀请码：${code}\n分享给邻居，他们下单你就能赚佣金！`,
      confirmText: '复制邀请码',
      success: (res) => {
        if (res.confirm) {
          this.handleCopyCode();
        }
      }
    });
  };

  // 查看统计数据详情
  handleViewStatDetail = (type: string) => {
    showToast(`查看${type}详情`);
    setTimeout(() => {
      Taro.showToast({ title: '数据详情开发中', icon: 'none' });
    }, 600);
  };

  // 申请提现
  handleWithdraw = () => {
    const { data } = this.state;
    if (data.availableCommission <= 0) {
      showToast('暂无可提现佣金');
      return;
    }
    Taro.showModal({
      title: '申请提现',
      content: `可提现金额：¥${formatPrice(data.availableCommission)}，确认提现？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await distributionApi.withdraw(data.availableCommission);
            showToast('提现申请已提交', 'success');
            this.loadData();
          } catch (err: any) {
            showToast('提现失败');
          }
        }
      }
    });
  };

  render() {
    const { data, activeSubTab, loading } = this.state;

    return (
      <View className='distribution-page'>
        {/* 头部 */}
        <View className='dist-header'>
          <View className='header-top'>
            <Text className='header-title'>🏅 楼长分销中心</Text>
            <Text className='header-subtitle'>分享好物，轻松赚钱</Text>
          </View>

          {/* 佣金总览 */}
          <View className='commission-overview'>
            <View className='overview-item'>
              <Text className='overview-label'>可提现佣金</Text>
              <Text className='overview-value primary'>¥{formatPrice(data.availableCommission)}</Text>
            </View>
            <View className='overview-divider' />
            <View className='overview-item'>
              <Text className='overview-label'>累计佣金</Text>
              <Text className='overview-value'>¥{formatPrice(data.totalCommission)}</Text>
            </View>
            <View className='overview-divider' />
            <View className='overview-item'>
              <Text className='overview-label'>待结算</Text>
              <Text className='overview-value'>¥{formatPrice(data.pendingCommission)}</Text>
            </View>
          </View>
        </View>

        <ScrollView className='dist-body' scrollY>
          {/* 邀请码 */}
          <View className='invite-section'>
            <View className='invite-card'>
              <Text className='invite-label'>我的邀请码</Text>
              <View className='invite-code-wrap'>
                <Text className='invite-code'>{data.inviteCode}</Text>
                <View className='copy-btn' onClick={this.handleCopyCode}>
                  <Text>复制</Text>
                </View>
              </View>
              <View className='invite-tip'>
                <Text className='tip-text'>
                  💡 分享邀请码或商品链接，邻居通过你的链接下单，你就能获得 {COMMISSION_RATE.BUILDING_LEADER * 100}% 佣金
                </Text>
              </View>
              <View className='share-btn-wrap'>
                <View className='share-btn' onClick={this.handleShare}>
                  <Text>📤 分享邀请链接</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 数据统计 */}
          <View className='stats-section'>
            <Text className='section-title'>📊 本月数据</Text>
            <View className='stats-grid'>
              <View className='stat-card' onClick={() => this.handleViewStatDetail('今日订单')}>
                <Text className='stat-value'>{data.todayOrders}</Text>
                <Text className='stat-label'>今日订单</Text>
              </View>
              <View className='stat-card' onClick={() => this.handleViewStatDetail('累计订单')}>
                <Text className='stat-value'>{data.totalOrders}</Text>
                <Text className='stat-label'>累计订单</Text>
              </View>
              <View className='stat-card' onClick={() => this.handleViewStatDetail('今日新增')}>
                <Text className='stat-value'>{data.todayMembers}</Text>
                <Text className='stat-label'>今日新增</Text>
              </View>
              <View className='stat-card' onClick={() => this.handleViewStatDetail('团队成员')}>
                <Text className='stat-value'>{data.totalMembers}</Text>
                <Text className='stat-label'>团队成员</Text>
              </View>
              <View className='stat-card highlight' onClick={() => this.handleViewStatDetail('本月佣金')}>
                <Text className='stat-value'>¥{formatPrice(data.monthlyCommission)}</Text>
                <Text className='stat-label'>本月佣金</Text>
              </View>
              <View className='stat-card highlight' onClick={() => this.handleViewStatDetail('小区排名')}>
                <Text className='stat-value'>No.{data.rank}</Text>
                <Text className='stat-label'>小区排名</Text>
              </View>
            </View>
          </View>

          {/* 下级Tab */}
          <View className='sub-tabs'>
            <View
              className={`sub-tab ${activeSubTab === 'commissions' ? 'active' : ''}`}
              onClick={() => this.setState({ activeSubTab: 'commissions' })}
            >
              <Text>佣金明细</Text>
            </View>
            <View
              className={`sub-tab ${activeSubTab === 'members' ? 'active' : ''}`}
              onClick={() => this.setState({ activeSubTab: 'members' })}
            >
              <Text>我的团员</Text>
            </View>
          </View>

          {/* 佣金明细 */}
          {activeSubTab === 'commissions' && (
            <View className='records-section'>
              {data.commissionRecords.map((record: any) => (
                <View key={record.id} className='record-item'>
                  <View className='record-left'>
                    <Text className='record-type'>
                      {record.type === 'order_commission' ? '订单佣金' : '提现'}
                    </Text>
                    <Text className='record-time'>{record.createdAt}</Text>
                    {record.orderNo !== '-' && (
                      <Text className='record-order'>订单：{record.orderNo}</Text>
                    )}
                  </View>
                  <View className='record-right'>
                    <Text className={`record-amount ${record.type === 'withdraw' ? 'out' : 'in'}`}>
                      {record.type === 'withdraw' ? '-' : '+'}¥{formatPrice(record.amount)}
                    </Text>
                    <Text className={`record-status ${record.status}`}>
                      {record.status === 'pending' ? '待结算' :
                       record.status === 'settled' ? '已结算' : '已完成'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 我的团员 */}
          {activeSubTab === 'members' && (
            <View className='members-section'>
              {data.subMembers.map((member: any) => (
                <View key={member.id} className='member-item'>
                  <Text className='member-avatar'>{member.avatar}</Text>
                  <View className='member-info'>
                    <Text className='member-name'>{member.nickname}</Text>
                    <Text className='member-building'>{member.building}</Text>
                  </View>
                  <View className='member-stats'>
                    <Text className='member-orders'>已购{member.orderCount}单</Text>
                    <Text className='member-date'>{member.joinDate}加入</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 提现按钮 */}
          <View className='withdraw-section'>
            <View className='withdraw-btn' onClick={this.handleWithdraw}>
              <Text>申请提现 ¥{formatPrice(data.availableCommission)}</Text>
            </View>
          </View>

          {/* 分销说明 */}
          <View className='rules-section'>
            <Text className='section-title'>📋 分销规则说明</Text>
            <View className='rule-item'>
              <Text className='rule-num'>1</Text>
              <Text className='rule-text'>
                楼长分享商品或邀请码，用户通过链接下单后，楼长获得订单金额的 {COMMISSION_RATE.BUILDING_LEADER * 100}% 作为佣金。
              </Text>
            </View>
            <View className='rule-item'>
              <Text className='rule-num'>2</Text>
              <Text className='rule-text'>
                团长作为楼长的上级，获得订单金额的 {COMMISSION_RATE.COMMUNITY_LEADER * 100}% 作为管理佣金。
              </Text>
            </View>
            <View className='rule-item'>
              <Text className='rule-num'>3</Text>
              <Text className='rule-text'>
                佣金在用户确认收货后自动结算，T+7天后可提现至微信零钱。
              </Text>
            </View>
            <View className='rule-item'>
              <Text className='rule-num'>4</Text>
              <Text className='rule-text'>
                楼长可选择送货上门或让用户到团长自提点自取，配送费用由平台承担。
              </Text>
            </View>
            <View className='rule-item'>
              <Text className='rule-num'>5</Text>
              <Text className='rule-text'>
                如发生退款，对应佣金将自动扣除。恶意刷单行为将被取消楼长资格。
              </Text>
            </View>
          </View>

          <View className='safe-bottom' />
        </ScrollView>
      </View>
    );
  }
}
