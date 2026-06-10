/// <reference types="@tarojs/taro" />

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
    NODE_ENV: 'development' | 'production';
    TARO_APP_API?: string;
  }
}
