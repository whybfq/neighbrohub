# 项目 TODO 跟踪

> **时间顺序与并行关系** → **[ROADMAP.md](./ROADMAP.md)**  
> 上架步骤（含买服务器）→ **[LAUNCH-TODO.md](./LAUNCH-TODO.md)**  
> 代码与文档一致 → **[CODE-DOC-SYNC.md](./CODE-DOC-SYNC.md)**  
> 测试 → **[TEST-CHECKLIST.md](./TEST-CHECKLIST.md)**

---

## 🔴 P0 · 上架阻塞（必须完成）

- [ ] **云服务器 + 域名 ICP 备案 + HTTPS**
- [ ] **MySQL 持久化**（替换 `server/src/store` 内存存储）
- [ ] **生产 API 域名** 写入各端 `TARO_APP_API` / `VITE_API_BASE`
- [ ] **两个微信小程序 AppID** + request 合法域名
- [ ] **微信登录**（后端 `code` → `openid`，非假 token）
- [ ] **微信支付**（`requestPayment` + 回调验签）
- [ ] **商品真实图片**（替换 Emoji `coverImage`）
- [ ] **隐私政策 / 用户协议** 页面
- [ ] **JWT 鉴权** + 禁用默认 `admin/admin123`

---

## 🟠 P1 · 核心体验

- [ ] 微信 **订阅消息**（备货/配送/送达）
- [ ] 手机号授权与解密
- [ ] 作业端 **真实作业员登录**（非演示 token）
- [ ] 管理后台与 API **深度联动**（非 Mock 表格）
- [ ] 地址数据 **以服务端为准**（减少纯本地 Storage）
- [ ] 订单列表 / 个人中心 **订单统计** 接真实 API
- [ ] 退款 / 售后流程

---

## 🟡 P2 · 体验与工程

- [x] 环境变量模板（`.env.example`）与 Taro `TARO_APP_API`
- [x] 隐藏未完成的「开发中」入口（`MVP_FEATURES.SECONDARY_MENU`）
- [x] 订单列表 API 失败不再静默展示 Mock
- [x] 个人中心去掉假订单数字，改为快捷入口
- [x] CI：四端 build / test:ui（`.github/workflows/ci.yml`）
- [x] 上架 / 测试 / 环境 / 路线图文档
- [x] 消费者 401 登出、详情/追踪页去除 Mock 回退
- [x] 作业端列表初始空数据（避免假任务闪现）
- [x] 子项目 README 与 v3.0 定位对齐
- [x] **开放骑手注册** + 配送费 ¥1 + 自配免配送费（三端 + API）
- [x] 启动恢复登录态、订单状态机校验、配送追踪同步
- [x] 订单列表仅「已送达」可确认收货；首页秒杀接 API
- [x] 作业端/管理端 API 统一错误处理
- [ ] TabBar 作业端绿色选中图标
- [ ] 配送页 `openLocation` 导航
- [ ] 入库扫码对接 SKU 库
- [ ] 合并 `buildings.ts` 为 monorepo 共享包（防双端漂移）
- [ ] 单元测试 / API 集成测试（supertest）
- [ ] Docker Compose 一键部署

---

## 🟢 P3 · 二期功能（MVP 不做）

- [ ] 团长 / 楼长分销（`MVP_FEATURES.DISTRIBUTION`）
- [ ] 优惠券（`MVP_FEATURES.COUPONS`）
- [ ] 秒杀独立页
- [ ] GPS 自动定位 + 电子围栏
- [ ] 多仓 / 多社区扩展
- [ ] Spring Boot 迁移（若 Node 不满足性能）

---

## 功能开关（`mini-program/src/config/constants.ts`）

| 开关 | 当前 | 说明 |
|------|------|------|
| `DISTRIBUTION` | `false` | 分销中心 |
| `POINTS` | `true` | 积分商城 |
| `COUPONS` | `false` | 优惠券 |
| `SECONDARY_MENU` | `false` | 消息/设置/帮助 |
| `FLASH_SALE` | `true` | 首页秒杀区（点击进分类） |

---

## 本地开发速查

```bash
cd server && npm run dev                    # :8090
cd mini-program && npm run dev:weapp        # 消费者
cd worker-mini-program && npm run dev:weapp # 作业
cd admin-web && npm run dev                 # :10088
```

---

*最后更新：与仓库代码同步维护。*
