# 邻选·作业

山屿西山著地下仓 · 仓配作业小程序（入库 / 分拣 / 抢单配送）

## 本地运行

```bash
npm install
npm run dev:h5      # 浏览器预览 http://localhost:10087
npm run dev:weapp   # 微信开发者工具，导入本项目目录
```

## 与消费者端关系

**不能合并到同一个微信小程序**（需独立 AppID / 独立工程）。与消费者端 `mini-program/` 共用后端 API，开发时可同时启动：

```bash
# 终端 1 - 消费者
cd mini-program && npm run dev:h5    # :10086

# 终端 2 - 作业端
cd worker-mini-program && npm run dev:h5   # :10087
```

## 页面

| 页面 | 说明 |
|------|------|
| 登录 | 微信登录（Mock） |
| 工作台 | 今日统计 + 模块入口 |
| 入库 | 扫码录入、库位上架 |
| 分拣 | 待拣列表（按东/西区筛选）→ 拣货清单 → 打包完成 |
| 配送 | 抢单大厅（按东/西区筛选，持单上限 100）→ 确认送达 |
| 我的 | 角色、收入、退出 |

## 业务参数

见 `src/config/constants.ts`：`minOrderAmount: 1`，`maxConcurrentOrders: 100`
