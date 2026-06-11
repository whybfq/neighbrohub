# NeighbroHub · 邻选社区

社区前置仓即时配送平台（类小象超市），为 **山屿西山著（东区·西区）** 居民提供「线上下单、仓内拣货、骑手送达」的购物体验。

## 产品形态

| 端 | 目录 | 说明 |
|----|------|------|
| 邻选·购 | `mini-program/` | 消费者小程序（H5: `:10086`） |
| 邻选·履约 | `worker-mini-program/` | 仓配履约小程序（H5: `:10087`） |
| 邻选·管理 | `admin-web/` | **Web 管理后台**（浏览器: `:10088`） |
| 统一 API | `server/` | **后端服务**（`:8090/api/v1`） |

## 核心流程

```
用户下单 → 仓库拣货打包 → 配送员抢单 → 送达 → 用户追踪全程
```

## 服务范围（MVP）

- **社区**：山屿西山著
- **分区**：东区（1–21 栋）、西区（1–17 栋），每栋 3 单元
- **前置仓**：山屿西山著地下仓（单仓覆盖两个分区）
- **起送价**：¥1 · **配送员持单上限**：100 单

## 文档

| 文档 | 说明 |
|------|------|
| [SDD 规范 v3.0](docs/SDD-SPEC.md) | 完整产品与技术方案 |
| [MVP 详细设计](docs/MVP-DESIGN.md) | 页面、API、状态机 |
| **[实施路线图](docs/ROADMAP.md)** | **时间顺序、并行任务、里程碑** |
| **[上架清单](docs/LAUNCH-TODO.md)** | **买服务器、备案、微信支付、提审** |
| **[项目 TODO](docs/TODO.md)** | 待办跟踪 |
| [代码文档一致](docs/CODE-DOC-SYNC.md) | 文档与代码同步规范 |
| [测试清单](docs/TEST-CHECKLIST.md) | 上架前测试 |
| [环境变量](docs/ENV.md) | 四端配置 |
| [设计稿索引](docs/design/README.md) | HTML 原型（含归档说明） |

## 技术栈

- 小程序：Taro 3 + React + TypeScript
- 管理后台：React + Ant Design + Vite
- 后端：Node.js Express（MVP 内存存储）→ MySQL（规划）

## 本地预览

```bash
# ① 统一 API（建议先启动）
cd server && npm install && npm run dev              # http://localhost:8090/api/v1

# ② 消费者端
cd mini-program && npm install && npm run dev:h5       # http://localhost:10086

# ③ 履约端
cd worker-mini-program && npm install && npm run dev:h5   # http://localhost:10087

# ④ 管理后台
cd admin-web && npm install && npm run dev             # http://localhost:10088
```

生产环境配置见 [docs/ENV.md](docs/ENV.md)。

## 开发状态

- [x] 消费者小程序（分类 / 下单 / 订单 / 积分 / 绑楼栋）
- [x] 履约端 TabBar（入库 / 分拣 / 配送 / 我的）
- [x] 管理后台 Web UI
- [x] 统一 API + 三端联调
- [x] CI 编译检查（`.github/workflows/ci.yml`）
- [ ] **正式上架** → 见 [docs/LAUNCH-TODO.md](docs/LAUNCH-TODO.md)

### 上架前必做（摘要）

1. 云服务器 + 域名备案 + HTTPS  
2. MySQL 持久化  
3. 两个小程序 AppID + 合法域名  
4. 微信登录 + **微信支付**（当前为模拟支付）  
5. 商品真实图片 + 隐私协议 + 提审  

## 测试

```bash
cd mini-program && npm run test:ui
cd worker-mini-program && npm run test:ui
cd server && npm run build
cd admin-web && npm run build
```
