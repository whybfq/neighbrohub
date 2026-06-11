/** 履约监控看板：按订单状态汇总待分拣/配送中等 */
import { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, message } from 'antd';
import { adminApi } from '../../services/api';
import { ORDER_STATUS_COLOR, ORDER_STATUS_TEXT } from '../../config/constants';

export default function FulfillmentPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getDashboard(), adminApi.getOrders()])
      .then(([d, o]) => {
        setDashboard(d);
        setOrders(o.filter((x) => !['completed', 'cancelled', 'pending_pay'].includes(x.status)));
      })
      .catch((e: Error) => message.error(e.message || '加载履约数据失败'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (!dashboard) {
    return (
      <Typography.Text type="danger" style={{ display: 'block', marginTop: 48, textAlign: 'center' }}>
        履约数据加载失败，请确认后端 API 已启动
      </Typography.Text>
    );
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 140 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => <Tag color={ORDER_STATUS_COLOR[s]}>{ORDER_STATUS_TEXT[s]}</Tag>,
    },
    { title: '分区', dataIndex: 'zone', width: 70 },
    { title: '地址', dataIndex: 'address' },
    { title: '下单时间', dataIndex: 'createdAt', width: 170 },
    { title: '分拣员', dataIndex: 'picker', width: 80 },
    { title: '配送员', dataIndex: 'courier', width: 80 },
  ];

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>履约监控</Typography.Title>
        <Typography.Paragraph type="secondary">实时查看仓配链路各节点积压情况</Typography.Paragraph>
      </div>

      <div className="fulfill-board">
        <div className="fulfill-cell">
          <div className="num">{dashboard.pendingPick}</div>
          <div className="label">待分拣</div>
        </div>
        <div className="fulfill-cell">
          <div className="num">{dashboard.picking}</div>
          <div className="label">拣货中</div>
        </div>
        <div className="fulfill-cell">
          <div className="num">{dashboard.pendingDelivery}</div>
          <div className="label">待配送</div>
        </div>
        <div className="fulfill-cell">
          <div className="num">{dashboard.delivering}</div>
          <div className="label">配送中</div>
        </div>
      </div>

      <Table rowKey="id" columns={columns} dataSource={orders} pagination={false} />
    </div>
  );
}
