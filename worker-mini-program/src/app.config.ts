export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/inbound/index',
    'pages/pick/index',
    'pages/pick/detail',
    'pages/delivery/index',
    'pages/delivery/confirm',
    'pages/mine/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#52c41a',
    navigationBarTitleText: '邻选·作业',
    navigationBarTextStyle: 'white',
  },
});
