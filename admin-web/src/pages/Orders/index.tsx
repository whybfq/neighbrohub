/** 订单中心：按状态筛选，展示拣货员/配送员 */
import { useEffect, useState } from 'react';
import { Table, Tag, Typography, Select, Space, message } from 'antd';
import { adminApi } from '../../services/api';
import { ORDER_STATUS_COLOR, ORDER_STATUS_TEXT } from '../../config/constants';

export default function OrdersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');

  const load = (s = status) => {
    setLoading(true);
    adminApi.getOrders(s)
      .then(setData)
      .catch((e: Error) => message.error(e.message || '加载订单失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 140 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => <Tag color={ORDER_STATUS_COLOR[s]}>{ORDER_STATUS_TEXT[s] || s}</Tag>,
    },
    { title: '分区', dataIndex: 'zone', width: 70, render: (z: string) => <Tag color="blue">{z}</Tag> },
    { title: '地址', dataIndex: 'address', width: 130 },
    { title: '用户', dataIndex: 'customer', width: 80 },
    { title: '金额', dataIndex: 'amount', width: 90, render: (v: number) => `¥${v}` },
    { title: '件数', dataIndex: 'itemCount', width: 60 },
    { title: '分拣员', dataIndex: 'picker', width: 80 },
    { title: '配送员', dataIndex: 'courier', width: 80 },
    { title: '下单时间', dataIndex: 'createdAt', width: 170 },
  ];

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>订单中心</Typography.Title>
        <Typography.Paragraph type="secondary">按状态筛选，查看东/西区订单履约情况</Typography.Paragraph>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={status}
          style={{ width: 160 }}
          onChange={(v) => {
            setStatus(v);
            load(v);
          }}
          options={[
            { value: 'all', label: '全部状态' },
            ...Object.entries(ORDER_STATUS_TEXT).map(([value, label]) => ({ value, label })),
          ]}
        />
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 1100 }} />
    </div>
  );
}
