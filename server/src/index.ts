import express from 'express';
import cors from 'cors';
import consumerRoutes from './routes/consumer.js';
import workerRoutes from './routes/worker.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT) || 8090;

app.use(cors({
  origin: [
    'http://localhost:10086',
    'http://localhost:10087',
    'http://localhost:10088',
    'http://127.0.0.1:10086',
    'http://127.0.0.1:10087',
    'http://127.0.0.1:10088',
  ],
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
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 NeighbroHub API  http://localhost:${PORT}/api/v1`);
  console.log(`   健康检查          http://localhost:${PORT}/api/v1/health`);
  console.log(`   管理后台登录      POST /api/v1/admin/login  (admin/admin123)\n`);
});
