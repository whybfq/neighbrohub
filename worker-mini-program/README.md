# 邻选·作业（仓配小程序）

山屿西山著地下仓 · 入库 / 分拣 / 抢单配送。独立 AppID，与消费者端共用 API。

## 本地运行

```bash
npm install
npm run dev:h5      # http://localhost:10087
npm run dev:weapp
npm run test:ui
```

## 页面

| 页面 | 说明 |
|------|------|
| 工作台 | 今日统计（接 API，初始为 0） |
| 入库 | 扫码 / 手工录入 |
| 分拣 | 东/西区筛选 → 拣货清单 |
| 配送 | 抢单池、签收 |
| 我的 | 收入、退出 |

登录：本地 `Taro.login` + 后端；**生产需作业员账号体系**（见 [LAUNCH-TODO](../docs/LAUNCH-TODO.md)）。

生产 API：`config/prod.js` → `TARO_APP_API`。

## 文档

[ROADMAP](../docs/ROADMAP.md) · [ENV](../docs/ENV.md) · [CODE-DOC-SYNC](../docs/CODE-DOC-SYNC.md)
