import { useEffect, useState } from 'react';
import { Table, Typography, Tabs, Tag } from 'antd';
import { adminApi } from '../../services/api';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [inbound, setInbound] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getInventory(), adminApi.getInboundRecords()])
      .then(([inv, ib]) => {
        setInventory(inv);
        setInbound(ib);
      })
      .finally(() => setLoading(false));
  }, []);

  const invColumns = [
    { title: 'SKU', dataIndex: 'skuId', width: 90 },
    { title: '商品', dataIndex: 'name' },
    { title: '库位', dataIndex: 'location', width: 90 },
    { title: '温区', dataIndex: 'tempZone', width: 80, render: (v: string) => <Tag>{v}</Tag> },
    { title: '可用库存', dataIndex: 'available', width: 100 },
    { title: '预占', dataIndex: 'reserved', width: 80 },
  ];

  const inboundColumns = [
    { title: '单号', dataIndex: 'id', width: 90 },
    { title: '商品', dataIndex: 'skuName' },
    { title: '数量', dataIndex: 'qty', width: 80 },
    { title: '库位', dataIndex: 'location', width: 90 },
    { title: '操作人', dataIndex: 'operator', width: 90 },
    { title: '时间', dataIndex: 'time', width: 160 },
  ];

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>库存管理</Typography.Title>
        <Typography.Paragraph type="secondary">山屿西山著地下仓 · 库存查询与入库记录</Typography.Paragraph>
      </div>
      <Tabs
        items={[
          {
            key: 'inventory',
            label: '库存查询',
            children: <Table rowKey="skuId" columns={invColumns} dataSource={inventory} loading={loading} pagination={false} />,
          },
          {
            key: 'inbound',
            label: '入库记录',
            children: <Table rowKey="id" columns={inboundColumns} dataSource={inbound} loading={loading} pagination={false} />,
          },
        ]}
      />
    </div>
  );
}
