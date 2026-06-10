# 邻选·购（消费者小程序）

山屿西山著 · 前置仓即时配送消费者端。与根目录 [README](../README.md) 及 [SDD v3.0](../docs/SDD-SPEC.md) 一致。

## 定位

- **单仓双分区**：东区 1–21 栋、西区 1–17 栋，每栋 3 单元
- **核心链路**：浏览 → 下单 → 追踪配送 → 确认收货 → 积分
- **默认关闭**：分销（`DISTRIBUTION`）、优惠券（`COUPONS`）
- **支付说明**：当前为 **API 模拟支付**，正式微信支付见 [LAUNCH-TODO](../docs/LAUNCH-TODO.md)

## 本地运行

```bash
npm install
npm run dev:h5      # http://localhost:10086
npm run dev:weapp   # 微信开发者工具
npm run test:ui     # 图标检查 + 编译
```

需先启动 `server/`（`:8090`），`USE_MOCK_API=false`（默认）。

## 生产 API

编辑 `config/prod.js` 中 `TARO_APP_API`，详见 [docs/ENV.md](../docs/ENV.md)。

## 主要页面

| 页面 | 状态 |
|------|------|
| 首页 / 分类 / 详情 / 购物车 / 下单 | ✅ 联调 API |
| 订单 / 配送追踪 | ✅（支付为模拟） |
| 积分商城 | ✅ |
| 绑定社区 / 地址 | ✅ |
| 分销中心 | 🔒 开关关闭 |
| 消息 / 设置 / 帮助 | 🔒 开关关闭 |

## 文档

- [实施路线图](../docs/ROADMAP.md) — 时间顺序与并行任务
- [上架清单](../docs/LAUNCH-TODO.md)
- [代码文档一致](../docs/CODE-DOC-SYNC.md)
