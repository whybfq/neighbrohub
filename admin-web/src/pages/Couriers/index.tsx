/** 配送员审核：通过 / 暂停，对应 couriers 表 */
import { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography, message, Space } from 'antd';
import { adminApi } from '../../services/api';

const statusMap: Record<string, { color: string; text: string }> = {
  active: { color: 'green', text: '正常接单' },
  pending: { color: 'orange', text: '待审核' },
  suspended: { color: 'red', text: '已暂停' },
};

export default function CouriersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.getCouriers()
      .then(setData)
      .catch((e: Error) => message.error(e.message || '加载配送员失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name', width: 90 },
    { title: '手机', dataIndex: 'phone', width: 120 },
    {
      title: '角色',
      dataIndex: 'roles',
      render: (roles: string[]) => roles.map((r) => <Tag key={r}>{r}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => {
        const m = statusMap[s] || { color: 'default', text: s };
        return <Tag color={m.color}>{m.text}</Tag>;
      },
    },
    { title: '持单', dataIndex: 'holdingCount', width: 70 },
    { title: '今日配送', dataIndex: 'todayDelivery', width: 90 },
    { title: '申请时间', dataIndex: 'appliedAt', width: 110 },
    {
      title: '操作',
      width: 180,
      render: (_: unknown, row: any) => (
        <Space>
          {row.status === 'pending' && (
            <Button type="link" size="small" onClick={async () => {
              await adminApi.approveCourier(row.id);
              message.success('已通过审核');
              load();
            }}>
              通过
            </Button>
          )}
          {row.status === 'active' && (
            <Button type="link" size="small" danger onClick={async () => {
              await adminApi.suspendCourier(row.id);
              message.warning('已暂停接单');
              load();
            }}>
              暂停
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>配送员管理</Typography.Title>
        <Typography.Paragraph type="secondary">审核配送员申请，管理接单状态（持单上限 100 单）</Typography.Paragraph>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
}
