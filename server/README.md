# NeighbroHub API

统一后端 API 服务，供三端共用：

| 客户端 | Header | 说明 |
|--------|--------|------|
| 邻选·购 | `X-Client-Type: consumer` | 消费者小程序 |
| 邻选·作业 | `X-Client-Type: worker` | 仓配作业小程序 |
| 邻选·管理 | `X-Client-Type: admin` | Web 管理后台 |

## 快速启动

```bash
cd server
npm install
npm run dev        # http://localhost:8090/api/v1
```

健康检查：`GET http://localhost:8090/api/v1/health`

## 环境变量

```bash
cp .env.example .env   # 编辑 PORT、CORS_ORIGINS、ADMIN_PASSWORD 等
```

详见 [docs/ENV.md](../docs/ENV.md) 与 [docs/LAUNCH-TODO.md](../docs/LAUNCH-TODO.md)。

## 响应格式

```json
{ "code": 0, "message": "ok", "data": {} }
```

## 主要接口

### 消费者 `/api/v1`
- `GET /products/list` · `GET /orders/list` · `POST /orders/create` · `POST /orders/:id/pay`
- `GET /address/list` · `POST /address/add`
- `GET /community/info` · `POST /user/login`

### 作业端 `/api/v1`
- `GET /worker/dashboard` · `GET /wms/pick/tasks` · `POST /wms/pick/tasks/:id/complete`
- `GET /delivery/pool` · `POST /delivery/tasks/:id/grab` · `POST /delivery/tasks/:id/deliver`

### 管理后台 `/api/v1`
- `POST /admin/login`（admin / admin123）
- `GET /admin/dashboard` · `GET /admin/products` · `GET /admin/orders`
- `GET /admin/couriers` · `PUT /admin/couriers/:id/approve`

## 四端联调

```bash
# 终端 1 - API
cd server && npm run dev

# 终端 2 - 消费者
cd mini-program && npm run dev:h5      # :10086

# 终端 3 - 作业端
cd worker-mini-program && npm run dev:h5   # :10087

# 终端 4 - 管理后台
cd admin-web && npm run dev            # :10088
```

## 说明

- 当前为 **内存存储** MVP 骨架，重启后数据重置
- 方案文档规划生产环境使用 Spring Boot + MySQL，本服务可逐步替换
- 三端 `USE_MOCK_API = false`（默认）时连本服务；改 `true` 可离线 Mock
