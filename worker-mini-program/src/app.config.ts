export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/pick/index',
    'pages/delivery/index',
    'pages/mine/index',
    'pages/inbound/index',
    'pages/pick/detail',
    'pages/delivery/confirm',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#52c41a',
    navigationBarTitleText: '邻选·作业',
    navigationBarTextStyle: 'white',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#52c41a',
    backgroundColor: '#fff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '工作台',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png',
      },
      {
        pagePath: 'pages/pick/index',
        text: '分拣',
        iconPath: 'assets/icons/order.png',
        selectedIconPath: 'assets/icons/order-active.png',
      },
      {
        pagePath: 'pages/delivery/index',
        text: '配送',
        iconPath: 'assets/icons/cart.png',
        selectedIconPath: 'assets/icons/cart-active.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png',
      },
    ],
  },
});
