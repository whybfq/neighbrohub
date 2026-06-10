import { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography, message, Space } from 'antd';
import { adminApi } from '../../services/api';

export default function ProductsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.getProducts().then(setData).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (id: string) => {
    await adminApi.toggleProductStatus(id);
    message.success('状态已更新');
    load();
  };

  const columns = [
    { title: '商品ID', dataIndex: 'id', width: 80 },
    { title: '品类', dataIndex: 'category', width: 100 },
    { title: '品牌名称', dataIndex: 'brand', width: 110, ellipsis: true },
    { title: '商品名称', dataIndex: 'name', width: 120, ellipsis: true },
    { title: '包装规格', dataIndex: 'spec', width: 130, ellipsis: true },
    { title: '售价', dataIndex: 'price', width: 90, render: (v: number) => `¥${v}` },
    { title: '库存', dataIndex: 'stock', width: 80, align: 'right' as const },
    { title: '销量', dataIndex: 'sales', width: 80, align: 'right' as const },
    { title: '库位', dataIndex: 'storageZone', width: 90 },
    { title: '温区', dataIndex: 'tempZone', width: 80, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: string) => <Tag color={s === 'on' ? 'green' : 'default'}>{s === 'on' ? '上架' : '下架'}</Tag>,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right' as const,
      render: (_: unknown, row: any) => (
        <Button type="link" size="small" onClick={() => handleToggle(row.id)}>
          {row.status === 'on' ? '下架' : '上架'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>商品管理</Typography.Title>
        <Typography.Paragraph type="secondary">商品上下架同步至消费者端列表</Typography.Paragraph>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" disabled>新增商品（待接 API）</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />
    </div>
  );
}
