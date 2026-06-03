import { Component } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../store';
import { userApi } from '../../services/api';
import { PAGE_PATH } from '../../config/constants';
import './index.scss';

export default class LoginPage extends Component {
  state = {
    loading: false,
    agreed: false
  };

  // 微信一键登录
  handleWechatLogin = async () => {
    if (!this.state.agreed) {
      Taro.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    this.setState({ loading: true });

    try {
      // 获取微信登录code
      const loginRes = await Taro.login();
      if (!loginRes.code) {
        throw new Error('获取登录凭证失败');
      }

      // 调用后端登录接口
      const result = await userApi.login(loginRes.code);
      const store = useUserStore.getState();

      store.setToken(result.token);
      store.setUserInfo(result.user);

      if (result.user.community) {
        store.setCommunity(result.user.community);
      }
      if (result.user.building) {
        store.setBuilding(result.user.building);
      }

      Taro.showToast({ title: '登录成功', icon: 'success' });

      // 新用户需要绑定社区
      if (!result.user.community) {
        setTimeout(() => {
          Taro.redirectTo({ url: PAGE_PATH.BIND_COMMUNITY });
        }, 1000);
      } else {
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      }
    } catch (err: any) {
      Taro.showToast({ title: err.message || '登录失败', icon: 'none' });
    } finally {
      this.setState({ loading: false });
    }
  };

  // 手机号授权
  handleGetPhone = (e: any) => {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 获取到加密的手机号数据，发送到后端解密
      console.log('手机号加密数据:', e.detail);
    }
  };

  render() {
    const { loading, agreed } = this.state;

    return (
      <View className='login-page'>
        <View className='login-container'>
          {/* Logo */}
          <View className='login-logo'>
            <Text className='logo-icon'>🏘️</Text>
            <Text className='logo-title'>邻选社区</Text>
            <Text className='logo-subtitle'>社区私域购物平台</Text>
          </View>

          {/* 功能介绍 */}
          <View className='feature-list'>
            <View className='feature-item'>
              <Text className='feature-icon'>🏪</Text>
              <Text className='feature-text'>团长直供 · 楼长推荐</Text>
            </View>
            <View className='feature-item'>
              <Text className='feature-icon'>🚀</Text>
              <Text className='feature-text'>社区配送 · 快速到家</Text>
            </View>
            <View className='feature-item'>
              <Text className='feature-icon'>💰</Text>
              <Text className='feature-text'>分享赚钱 · 佣金可观</Text>
            </View>
          </View>

          {/* 登录按钮 */}
          <View className='login-actions'>
            <Button
              className='wechat-login-btn'
              loading={loading}
              disabled={loading}
              onClick={this.handleWechatLogin}
            >
              <Text className='btn-icon'>💚</Text>
              <Text>微信一键登录</Text>
            </Button>

            <Button
              className='phone-login-btn'
              openType='getPhoneNumber'
              onGetPhoneNumber={this.handleGetPhone}
            >
              <Text className='btn-icon'>📱</Text>
              <Text>手机号快捷登录</Text>
            </Button>
          </View>

          {/* 协议 */}
          <View className='agreement'>
            <View
              className={`agree-check ${agreed ? 'checked' : ''}`}
              onClick={() => this.setState({ agreed: !agreed })}
            >
              {agreed && <Text className='check-icon'>✓</Text>}
            </View>
            <Text className='agree-text'>
              登录即表示同意
              <Text className='link'>《用户服务协议》</Text>
              和
              <Text className='link'>《隐私政策》</Text>
            </Text>
          </View>

          {/* 底部提示 */}
          <View className='login-footer'>
            <Text className='footer-text'>
              首次登录将自动注册账号，我们承诺保护您的个人信息安全
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
