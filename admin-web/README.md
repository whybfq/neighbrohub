# 邻选·管理

山屿西山著前置仓 **Web 管理后台**（浏览器访问，非小程序）。

## 功能（MVP Mock）

| 模块 | 说明 |
|------|------|
| 仪表盘 | 今日 GMV、订单、待分拣/配送、履约时长 |
| 商品管理 | 商品列表、上下架 |
| 库存管理 | 库存查询、入库记录 |
| 订单中心 | 按状态筛选，东/西区订单 |
| 履约监控 | 仓配各节点看板 |
| 配送员管理 | 审核、暂停接单 |
| 仓库设置 | 山屿西山著地下仓信息 |

## 本地运行

```bash
npm install
npm run dev      # http://localhost:10088
```

**演示登录**：`admin` / `admin123`

## 三端并行预览

```bash
# 消费者小程序 H5
cd mini-program && npm run dev:h5          # :10086

# 作业端 H5
cd worker-mini-program && npm run dev:h5   # :10087

# 管理后台 Web
cd admin-web && npm run dev                # :10088
```

## 技术栈

- React 18 + TypeScript
- Vite 5
- Ant Design 5
- React Router 6

后端 API 接入后，修改 `src/services/api.ts` 即可。
