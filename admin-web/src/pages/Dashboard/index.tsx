import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  CarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { adminApi } from '../../services/api';
import { MVP_COMMUNITY } from '../../config/constants';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>仪表盘</Typography.Title>
        <Typography.Paragraph type="secondary">
          {MVP_COMMUNITY.name}（{MVP_COMMUNITY.zones.join('·')}）· 今日运营概览
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="今日 GMV" prefix={<DollarOutlined />} value={data.todayGmv} precision={2} suffix="元" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="今日订单" prefix={<ShoppingCartOutlined />} value={data.todayOrders} suffix="单" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="待分拣" prefix={<InboxOutlined />} value={data.pendingPick} suffix="单" valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="配送中" prefix={<CarOutlined />} value={data.delivering} suffix="单" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="拣货中" value={data.picking} suffix="单" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic title="待配送" value={data.pendingDelivery} suffix="单" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="平均履约时长"
              prefix={<ClockCircleOutlined />}
              value={data.avgFulfillMinutes}
              suffix="分钟"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
