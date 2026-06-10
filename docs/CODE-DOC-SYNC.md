# 代码与文档一致性规范

> 目标：**README / docs 描述的能力 = 代码实际行为**，避免「文档写已上线、代码仍 Mock」。

---

## 单一事实来源（Single Source of Truth）

| 主题 | 权威来源 | 文档需引用而非重复发明 |
|------|----------|------------------------|
| 功能是否开启 | `mini-program/src/config/constants.ts` → `MVP_FEATURES` | TODO.md 功能开关表 |
| 服务范围 / 楼栋 | `server/src/data/buildings.ts` + seed | README、LAUNCH-TODO |
| API 地址 | `config/dev.js` / `config/prod.js` 的 `TARO_APP_API` | ENV.md |
| 后端环境变量 | `server/.env.example` | ENV.md、server/README |
| 上架步骤 | `docs/LAUNCH-TODO.md` | 根 README 只摘要 + 链接 |
| 时间顺序 | `docs/ROADMAP.md` | TODO.md P0–P3 |

**规则**：数字（栋数、起送价、积分规则）只在一处定义，文档用链接指向代码或 seed。

---

## 产品定位表述（统一口径）

| ✅ 当前 MVP（v3.0） | ❌ 勿再作为主描述 |
|---------------------|------------------|
| 前置仓即时配送（类小象超市） | 团长+楼长双级分销为主 |
| 单仓 · 山屿西山著东/西区 | 多社区裂变 |
| 开放配送员抢单 | 团长自提为主 |
| 积分商城（开关 `POINTS: true`） | 默认全开所有 v2 功能 |

子项目 README 必须与根 `README.md` 及 `docs/SDD-SPEC.md` v3.0 一致。

---

## Mock 与「可用」的文档写法

| 层级 | 代码行为 | 文档应写 |
|------|----------|----------|
| **可用** | 默认 `USE_MOCK_API=false` 且接 API | 「可用，需后端」 |
| **模拟** | 如支付 `POST /pay` 直接改状态 | 「演示链路，非真支付」 |
| **关闭** | `MVP_FEATURES.xxx=false` | 「二期 / 未开放」 |
| **隐藏** | UI 不渲染 | 文档可不列或标「未开放」 |

禁止写「已完成微信支付」而代码无 `requestPayment`。

---

## 改代码时必须同步的文档

```
改 MVP_FEATURES     → docs/TODO.md 开关表
改 buildings/seed   → README 服务范围、LAUNCH-TODO
改 .env.example     → docs/ENV.md
改 API 路由         → server/README.md、MVP-DESIGN.md（若契约变）
完成 P0 项          → docs/TODO.md 勾选 + ROADMAP 里程碑日期
```

---

## 推荐 PR / 提交自检

- [ ] `npm run test:ui`（两小程序）+ `server build` + `admin-web build`
- [ ] 未改文档时，功能/开关变更已更新 TODO 或 ENV
- [ ] 新增「开发中」入口已加 `MVP_FEATURES` 或删除
- [ ] README 无 v2 分销为主表述

---

## 当前已知 intentional 差距（文档已标明）

| 项 | 代码 | 文档位置 |
|----|------|----------|
| 支付 | 模拟弹窗 + API 改状态 | LAUNCH-TODO、README |
| 存储 | 内存 store | LAUNCH-TODO P0 |
| 商品图 | Emoji | LAUNCH-TODO P0 |
| 分销 | `DISTRIBUTION: false` | TODO P3 |
| 管理后台 | 部分 Mock 展示 | admin-web/README |

这些差距**允许存在**，但必须在上述文档中列为待办，不得标为已完成。
