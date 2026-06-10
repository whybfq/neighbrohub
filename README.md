# NeighbroHub · 邻选社区

社区前置仓即时配送平台（类小象超市），为 **山屿西山著（东区·西区）** 居民提供「线上下单、仓内拣货、骑手送达」的购物体验。

## 产品形态

| 端 | 目录 | 说明 |
|----|------|------|
| 邻选·购 | `mini-program/` | 消费者小程序（H5: `:10086`） |
| 邻选·作业 | `worker-mini-program/` | 仓配小程序（H5: `:10087`） |
| 邻选·管理 | `admin-web/` | **Web 管理后台**（浏览器: `:10088`） |
| 统一 API | `server/` | **后端服务**（`:8090/api/v1`） |

## 核心流程

```
用户下单 → 仓库拣货打包 → 配送员抢单 → 送达 → 用户追踪全程
```

## 服务范围（MVP）

- **社区**：山屿西山著
- **分区**：东区、西区
- **前置仓**：山屿西山著地下仓（单仓覆盖两个分区）
- **起送价**：¥1 · **配送员持单上限**：100 单

## 文档

- [SDD 规范文档 v3.0](docs/SDD-SPEC.md) — 完整产品与技术方案
- [MVP 详细设计](docs/MVP-DESIGN.md) — 单仓双分区：页面、API、状态机、排期
- [设计稿](docs/design/) — HTML 原型与总结报告

## 技术栈

- 小程序：Taro 3 + React + TypeScript
- 管理后台：React + Ant Design Pro（规划）
- 后端：Node.js Express（MVP 骨架）→ Spring Boot 3 + MySQL（规划）

## 本地预览

```bash
# ① 统一 API（建议先启动）
cd server && npm install && npm run dev              # http://localhost:8090/api/v1

# ② 消费者端
cd mini-program && npm install && npm run dev:h5    # http://localhost:10086

# ③ 作业端
cd worker-mini-program && npm install && npm run dev:h5   # http://localhost:10087

# ④ 管理后台（Web 网页）
cd admin-web && npm install && npm run dev                # http://localhost:10088

# 静态原型
open docs/design/prototype.html
```

## 开发状态

- [x] 消费者小程序 UI（Mock · 配送追踪 · 东/西区绑定/切换 · 地址管理 · 下单联动）
- [x] 作业端小程序 UI（Mock · 入库/分拣/抢单 · 分区筛选）
- [x] 管理后台 Web UI（Mock · 商品/订单/库存/配送员）
- [x] 统一 API 骨架（Node.js · 内存存储 · 三端联调）
- [ ] Spring Boot + MySQL 生产后端
