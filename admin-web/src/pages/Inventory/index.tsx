/** 库存查询 + 入库记录 Tab */
import { useEffect, useState } from 'react';
import { Table, Typography, Tabs, Tag, message } from 'antd';
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
      .catch((e: Error) => message.error(e.message || '加载库存失败'))
      .finally(() => setLoading(false));
  }, []);

  const invColumns = [
    { title: 'SKU', dataIndex: 'skuId', width: 80, fixed: 'left' as const },
    { title: '品类', dataIndex: 'category', width: 100 },
    { title: '品牌名称', dataIndex: 'brand', width: 110, ellipsis: true },
    { title: '商品名称', dataIndex: 'name', width: 120, ellipsis: true },
    { title: '包装规格', dataIndex: 'spec', width: 140, ellipsis: true },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 90,
      align: 'right' as const,
      render: (v: number, row: any) => (
        <span style={{ fontWeight: 600, color: v > 0 ? '#1677ff' : '#ff4d4f' }}>
          {v ?? row.available ?? 0}
        </span>
      ),
    },
    { title: '库位', dataIndex: 'location', width: 90 },
    { title: '温区', dataIndex: 'tempZone', width: 80, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: '预占',
      dataIndex: 'reserved',
      width: 70,
      align: 'right' as const,
      render: (v: number) => (v > 0 ? <span style={{ color: '#fa8c16' }}>{v}</span> : '—'),
    },
  ];

  const inboundColumns = [
    { title: '单号', dataIndex: 'id', width: 90 },
    { title: '品类', dataIndex: 'category', width: 100 },
    { title: '品牌名称', dataIndex: 'brand', width: 110 },
    { title: '商品名称', dataIndex: 'skuName', width: 120 },
    { title: '包装规格', dataIndex: 'spec', width: 140 },
    { title: '数量', dataIndex: 'qty', width: 80, align: 'right' as const },
    { title: '库位', dataIndex: 'location', width: 90 },
    { title: '操作人', dataIndex: 'operator', width: 90 },
    { title: '时间', dataIndex: 'time', width: 160 },
  ];

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>库存管理</Typography.Title>
        <Typography.Paragraph type="secondary">
          山屿西山著地下仓 · 按品类 / 品牌 / 规格查看库存数量
        </Typography.Paragraph>
      </div>
      <Tabs
        items={[
          {
            key: 'inventory',
            label: '库存查询',
            children: (
              <Table
                rowKey="skuId"
                columns={invColumns}
                dataSource={inventory}
                loading={loading}
                pagination={false}
                scroll={{ x: 1020 }}
              />
            ),
          },
          {
            key: 'inbound',
            label: '入库记录',
            children: (
              <Table
                rowKey="id"
                columns={inboundColumns}
                dataSource={inbound}
                loading={loading}
                pagination={false}
                scroll={{ x: 1020 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
