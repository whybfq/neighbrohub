import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import consumerRoutes from './routes/consumer.js';
import workerRoutes from './routes/worker.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT) || 8090;

const defaultOrigins = [
  'http://localhost:10086',
  'http://localhost:10087',
  'http://localhost:10088',
  'http://127.0.0.1:10086',
  'http://127.0.0.1:10087',
  'http://127.0.0.1:10088',
];

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : defaultOrigins;

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json());

const api = express.Router();
api.use(consumerRoutes);
api.use(workerRoutes);
api.use(adminRoutes);

app.use('/api/v1', api);

app.get('/', (_req, res) => {
  res.json({
    name: 'NeighbroHub API',
    version: '0.1.0',
    docs: '/api/v1/health',
    community: '山屿西山著（东区·西区）',
    env: process.env.NODE_ENV || 'development',
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 NeighbroHub API  http://localhost:${PORT}/api/v1`);
  console.log(`   健康检查          http://localhost:${PORT}/api/v1/health`);
  console.log(`   CORS 允许         ${corsOrigins.join(', ')}`);
  console.log(`   环境变量模板      server/.env.example`);
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123') {
    console.warn('\n⚠️  生产环境请设置 ADMIN_PASSWORD，勿使用默认密码\n');
  } else {
    console.log('');
  }
});
