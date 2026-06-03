import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { navigateTo, PAGE_PATH } from '../../utils';
import { USER_ROLE } from '../../config/constants';
import './index.scss';

export default class ProfilePage extends Component {
  // 跳转分销中心
  goToDistribution = () => {
    navigateTo(PAGE_PATH.DISTRIBUTION);
  };

  // 跳转订单
  goToOrders = (status?: string) => {
    Taro.switchTab({ url: PAGE_PATH.ORDERS });
  };

  // 设置
  goToSettings = () => {
    Taro.showToast({ title: '设置页面开发中', icon: 'none' });
  };

  // 地址管理
  goToAddress = () => {
    Taro.showToast({ title: '地址管理开发中', icon: 'none' });
  };

  render() {
    const store = useUserStore.getState();
    const { userInfo } = store;
    const isBuildingLeader = userInfo?.role === USER_ROLE.BUILDING_LEADER;
    const isCommunityLeader = userInfo?.role === USER_ROLE.COMMUNITY_LEADER;

    return (
      <View className='profile-page'>
        <ScrollView className='profile-body' scrollY>
          {/* 个人信息头部 */}
          <View className='profile-header'>
            <View className='user-info'>
              <View className='avatar'>
                <Text>{userInfo?.avatar || '😊'}</Text>
              </View>
              <View className='user-detail'>
                <View className='name-row'>
                  <Text className='user-name'>
                    {userInfo?.nickname || '点击登录'}
                  </Text>
                  {(isBuildingLeader || isCommunityLeader) && (
                    <Text className='role-badge'>
                      {isCommunityLeader ? '团长' : '楼长'}
                    </Text>
                  )}
                </View>
                <Text className='user-community'>
                  {userInfo?.community?.name || '阳光花园小区'}
                  {userInfo?.building && ` · ${userInfo.building.name}${userInfo.building.unit}`}
                </Text>
                {isBuildingLeader && (
                  <Text className='user-code'>邀请码：{userInfo?.distributorCode}</Text>
                )}
              </View>
            </View>
          </View>

          {/* 楼长/团长入口 */}
          {(isBuildingLeader || isCommunityLeader) && (
            <View className='distributor-entry' onClick={this.goToDistribution}>
              <View className='entry-left'>
                <Text className='entry-icon'>🏅</Text>
                <View className='entry-info'>
                  <Text className='entry-title'>
                    {isCommunityLeader ? '团长管理中心' : '楼长分销中心'}
                  </Text>
                  <Text className='entry-desc'>
                    累计佣金 ¥{userInfo?.totalCommission?.toFixed(2) || '0.00'}
                    {' | '}
                    可提现 ¥{userInfo?.balance?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              </View>
              <Text className='entry-arrow'>›</Text>
            </View>
          )}

          {/* 订单统计 */}
          <View className='order-stats'>
            <View className='stat-item' onClick={() => this.goToOrders()}>
              <Text className='stat-num'>0</Text>
              <Text className='stat-label'>待付款</Text>
            </View>
            <View className='stat-item' onClick={() => this.goToOrders()}>
              <Text className='stat-num'>0</Text>
              <Text className='stat-label'>待发货</Text>
            </View>
            <View className='stat-item' onClick={() => this.goToOrders()}>
              <Text className='stat-num'>1</Text>
              <Text className='stat-label'>配送中</Text>
            </View>
            <View className='stat-item' onClick={() => this.goToOrders()}>
              <Text className='stat-num'>2</Text>
              <Text className='stat-label'>待评价</Text>
            </View>
            <View className='stat-item' onClick={() => this.goToOrders()}>
              <Text className='stat-num'>0</Text>
              <Text className='stat-label'>售后</Text>
            </View>
          </View>

          {/* 功能菜单 */}
          <View className='menu-section'>
            <View className='menu-item' onClick={() => this.goToOrders()}>
              <Text className='menu-icon'>📦</Text>
              <Text className='menu-text'>全部订单</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item'>
              <Text className='menu-icon'>🎫</Text>
              <Text className='menu-text'>优惠券</Text>
              <Text className='menu-badge'>3张可用</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item'>
              <Text className='menu-icon'>⭐</Text>
              <Text className='menu-text'>我的收藏</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item' onClick={this.goToAddress}>
              <Text className='menu-icon'>📍</Text>
              <Text className='menu-text'>收货地址</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
          </View>

          {/* 楼长相关菜单 */}
          {isBuildingLeader && (
            <View className='menu-section'>
              <View className='menu-item' onClick={this.goToDistribution}>
                <Text className='menu-icon'>💰</Text>
                <Text className='menu-text'>我的佣金</Text>
                <Text className='menu-value'>¥{userInfo?.balance?.toFixed(2) || '0.00'}</Text>
                <Text className='menu-arrow'>›</Text>
              </View>
              <View className='menu-item' onClick={this.goToDistribution}>
                <Text className='menu-icon'>👥</Text>
                <Text className='menu-text'>我的团员</Text>
                <Text className='menu-arrow'>›</Text>
              </View>
              <View className='menu-item' onClick={this.goToDistribution}>
                <Text className='menu-icon'>📊</Text>
                <Text className='menu-text'>推广数据</Text>
                <Text className='menu-arrow'>›</Text>
              </View>
            </View>
          )}

          {/* 其他 */}
          <View className='menu-section'>
            <View className='menu-item'>
              <Text className='menu-icon'>🔔</Text>
              <Text className='menu-text'>消息通知</Text>
              <Text className='menu-badge red'>5</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item' onClick={this.goToSettings}>
              <Text className='menu-icon'>⚙️</Text>
              <Text className='menu-text'>设置</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item'>
              <Text className='menu-icon'>❓</Text>
              <Text className='menu-text'>帮助与反馈</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
          </View>

          {/* 申请成为楼长入口（普通用户可见） */}
          {!isBuildingLeader && !isCommunityLeader && (
            <View className='apply-section'>
              <View className='apply-card'>
                <Text className='apply-icon'>🏅</Text>
                <View className='apply-info'>
                  <Text className='apply-title'>成为楼长，分享赚钱</Text>
                  <Text className='apply-desc'>
                    分享商品给邻居，最高获得{5}%佣金
                  </Text>
                </View>
                <View className='apply-btn'>
                  <Text>立即申请</Text>
                </View>
              </View>
            </View>
          )}

          <View className='safe-bottom' />
        </ScrollView>
      </View>
    );
  }
}
