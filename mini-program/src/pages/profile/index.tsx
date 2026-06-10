import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore, usePointsStore } from '../../store';
import { navigateTo, PAGE_PATH, showToast } from '../../utils';
import { USER_ROLE, MVP_FEATURES } from '../../config/constants';
import { pointsApi } from '../../services/api';
import AppIcon from '../../components/app-icon';
import './index.scss';

export default class ProfilePage extends Component {
  componentDidMount() {
    this.loadPointsInfo();
  }

  onShow() {
    this.loadPointsInfo();
  }

  loadPointsInfo = () => {
    if (!MVP_FEATURES.POINTS) return;
    pointsApi.getPointsInfo().then((info: any) => {
      usePointsStore.getState().setPointsInfo(info);
    }).catch(() => {});
  };
  // 跳转分销中心
  goToDistribution = () => {
    navigateTo(PAGE_PATH.DISTRIBUTION);
  };

  // 跳转订单
  goToOrders = () => {
    Taro.switchTab({ url: PAGE_PATH.ORDERS });
  };

  // 积分中心
  goToPoints = () => {
    navigateTo(PAGE_PATH.POINTS);
  };

  // 地址管理
  goToAddress = () => {
    navigateTo(PAGE_PATH.ADDRESS);
  };

  showComingSoon = (name: string) => {
    showToast(`${name}即将上线，敬请期待`);
  };

  applyToBeLeader = () => {
    Taro.showModal({
      title: '申请成为楼长',
      content: '分销功能即将上线，敬请期待。',
      showCancel: false,
    });
  };

  render() {
    const store = useUserStore.getState();
    const pointsStore = usePointsStore.getState();
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
                  {(MVP_FEATURES.DISTRIBUTION && (isBuildingLeader || isCommunityLeader)) && (
                    <Text className='role-badge'>
                      {isCommunityLeader ? '团长' : '楼长'}
                    </Text>
                  )}
                </View>
                <Text className='user-community'>
                  {userInfo?.community?.name || '山屿西山著'}
                  {userInfo?.zone?.name && ` · ${userInfo.zone.name}`}
                  {userInfo?.building && ` · ${userInfo.building.name}${userInfo.building.unit}`}
                </Text>
                {MVP_FEATURES.DISTRIBUTION && isBuildingLeader && (
                  <Text className='user-code'>邀请码：{userInfo?.distributorCode}</Text>
                )}
              </View>
            </View>
          </View>

          {MVP_FEATURES.POINTS && (
          <View className='points-card' hoverClass='btn-pressed' onClick={this.goToPoints}>
            <View className='points-card-left'>
              <AppIcon name='star-active' size={48} className='points-card-icon-img' />
              <View className='points-card-info'>
                <Text className='points-card-title'>积分商城</Text>
                <Text className='points-card-desc'>消费1元=1积分 · 30000分免一年物业费</Text>
              </View>
            </View>
            <View className='points-card-right'>
              <Text className='points-card-value'>{pointsStore.totalPoints.toLocaleString()}</Text>
              <Text className='points-card-arrow'>›</Text>
            </View>
          </View>
          )}

          {/* 楼长/团长入口 */}
          {MVP_FEATURES.DISTRIBUTION && (isBuildingLeader || isCommunityLeader) && (
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

          {/* 订单快捷入口 */}
          <View className='order-stats order-stats--simple'>
            <View className='stat-item' onClick={this.goToOrders}>
              <AppIcon name='order' size={44} />
              <Text className='stat-label'>我的订单</Text>
            </View>
            <View className='stat-item' onClick={this.goToAddress}>
              <AppIcon name='location' size={44} />
              <Text className='stat-label'>收货地址</Text>
            </View>
            {MVP_FEATURES.POINTS && (
              <View className='stat-item' onClick={this.goToPoints}>
                <AppIcon name='star-active' size={44} />
                <Text className='stat-label'>积分商城</Text>
              </View>
            )}
          </View>

          {/* 功能菜单 */}
          <View className='menu-section'>
            <View className='menu-item' hoverClass='btn-pressed' onClick={() => this.goToOrders()}>
              <AppIcon name='order' size={40} className='menu-icon-img' />
              <Text className='menu-text'>全部订单</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            {MVP_FEATURES.COUPONS && (
              <View className='menu-item' hoverClass='btn-pressed' onClick={() => this.showComingSoon('优惠券')}>
                <AppIcon name='gift' size={40} className='menu-icon-img' />
                <Text className='menu-text'>优惠券</Text>
                <Text className='menu-badge'>3张可用</Text>
                <Text className='menu-arrow'>›</Text>
              </View>
            )}
            {MVP_FEATURES.POINTS && (
              <View className='menu-item' hoverClass='btn-pressed' onClick={this.goToPoints}>
                <AppIcon name='star-active' size={40} className='menu-icon-img' />
                <Text className='menu-text'>积分商城</Text>
                <Text className='menu-value'>{pointsStore.totalPoints.toLocaleString()}分</Text>
                <Text className='menu-arrow'>›</Text>
              </View>
            )}
            <View className='menu-item' hoverClass='btn-pressed' onClick={this.goToAddress}>
              <AppIcon name='location' size={40} className='menu-icon-img' />
              <Text className='menu-text'>收货地址</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
          </View>

          {/* 楼长相关菜单 */}
          {MVP_FEATURES.DISTRIBUTION && isBuildingLeader && (
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

          {MVP_FEATURES.SECONDARY_MENU && (
          <View className='menu-section'>
            <View className='menu-item' hoverClass='btn-pressed' onClick={() => this.showComingSoon('消息通知')}>
              <AppIcon name='bell' size={40} className='menu-icon-img' />
              <Text className='menu-text'>消息通知</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item' hoverClass='btn-pressed' onClick={() => this.showComingSoon('设置')}>
              <AppIcon name='settings' size={40} className='menu-icon-img' />
              <Text className='menu-text'>设置</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
            <View className='menu-item' hoverClass='btn-pressed' onClick={() => this.showComingSoon('帮助与反馈')}>
              <AppIcon name='help' size={40} className='menu-icon-img' />
              <Text className='menu-text'>帮助与反馈</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
          </View>
          )}

          {/* 申请成为楼长入口（普通用户可见） */}
          {MVP_FEATURES.DISTRIBUTION && !isBuildingLeader && !isCommunityLeader && (
            <View className='apply-section'>
              <View className='apply-card'>
                <Text className='apply-icon'>🏅</Text>
                <View className='apply-info'>
                  <Text className='apply-title'>成为楼长，分享赚钱</Text>
                  <Text className='apply-desc'>
                    分享商品给邻居，最高获得{5}%佣金
                  </Text>
                </View>
                <View className='apply-btn' onClick={this.applyToBeLeader}>
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
