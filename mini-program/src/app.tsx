/**
 * 邻选·购 — 小程序根组件
 *
 * 启动时 restoreSession：若本地有 token 则拉 /user/info，
 * 避免冷启动后个人中心仍显示「点击登录」。
 */
import { Component, PropsWithChildren } from 'react';
import Taro from '@tarojs/taro';
import { useUserStore } from './store';
import { userApi } from './services/api';
import './app.scss';

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    this.restoreSession();
  }

  /** 有 token 时恢复用户信息，避免重启后显示「点击登录」 */
  restoreSession = async () => {
    const token = Taro.getStorageSync('token');
    if (!token) return;

    const store = useUserStore.getState();
    store.checkLogin();

    try {
      const info: any = await userApi.getUserInfo();
      store.setUserInfo(info);
      if (info?.community) store.setCommunity(info.community);
      if (info?.building) store.setBuilding(info.building);
    } catch {
      store.logout();
    }
  };

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;
