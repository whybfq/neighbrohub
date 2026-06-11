# 环境变量配置

## 后端 `server/`

```bash
cd server
cp .env.example .env
# 编辑 .env 后
npm run dev
```

| 变量 | 说明 |
|------|------|
| `PORT` | 监听端口，默认 8090 |
| `CORS_ORIGINS` | 逗号分隔的前端域名 |
| `JWT_SECRET` | 生产必改 |
| `WECHAT_*` | 微信登录 / 支付（上架阶段填写） |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 管理后台账号 |

## 管理后台 `admin-web/`

```bash
cd admin-web
cp .env.example .env
npm run dev
```

| 变量 | 说明 |
|------|------|
| `VITE_API_BASE` | API 地址，如 `http://localhost:8090/api/v1` |

## 消费者小程序 `mini-program/`

编辑 `config/dev.js`（开发）或 `config/prod.js`（生产上传）：

```js
env: {
  TARO_APP_API: '"https://api.你的域名.com/api/v1"',
}
```

代码中通过 `process.env.TARO_APP_API` 读取（见 `src/config/constants.ts`）。

## 履约端 `worker-mini-program/`

同消费者端，修改 `config/dev.js` / `config/prod.js` 的 `TARO_APP_API`。

## 微信小程序合法域名

上架前在微信公众平台配置：

- request：`https://api.你的域名.com`
- upload/download：OSS 域名（若上传图片）

详见 [LAUNCH-TODO.md](./LAUNCH-TODO.md)。
