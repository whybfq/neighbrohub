/** UI 图标资源映射 */
export const UI_ICONS = {
  search: require('./ui/search.png'),
  location: require('./ui/location.png'),
  bell: require('./ui/bell.png'),
  star: require('./ui/star.png'),
  'star-active': require('./ui/star-active.png'),
  back: require('./ui/back.png'),
  plus: require('./ui/plus.png'),
  minus: require('./ui/minus.png'),
  trash: require('./ui/trash.png'),
  wechat: require('./ui/wechat.png'),
  'wechat-white': require('./ui/wechat-white.png'),
  phone: require('./ui/phone.png'),
  'phone-white': require('./ui/phone-white.png'),
  clock: require('./ui/clock.png'),
  gift: require('./ui/gift.png'),
  settings: require('./ui/settings.png'),
  help: require('./ui/help.png'),
  empty: require('./ui/empty.png'),
  order: require('./ui/order.png'),
  cart: require('./ui/cart.png'),
  profile: require('./ui/profile.png'),
  home: require('./ui/home.png'),
} as const;

export type UiIconName = keyof typeof UI_ICONS;
