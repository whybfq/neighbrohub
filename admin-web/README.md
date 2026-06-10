# 邻选·管理（Web 后台）

山屿西山著前置仓运营后台，浏览器访问 `:10088`。

## 本地运行

```bash
cp .env.example .env   # 可选，默认连 localhost:8090
npm install
npm run dev
```

**开发环境**登录：`admin` / `admin123`（仅 `import.meta.env.DEV` 预填）。  
生产请设置 `server/.env` 的 `ADMIN_PASSWORD`。

## 模块

| 模块 | 当前 |
|------|------|
| 仪表盘 / 商品 / 订单 / 库存 / 配送员 | UI + 部分 API |
| 深度运营联动 | 待 MySQL + 鉴权（见 [TODO](../docs/TODO.md) P1） |

## 文档

[ROADMAP](../docs/ROADMAP.md) · [ENV](../docs/ENV.md)
