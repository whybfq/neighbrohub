import { useEffect, useState } from 'react';
import { Card, Descriptions, Typography, Spin, Tag } from 'antd';
import { adminApi } from '../../services/api';

export default function WarehousePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getWarehouse().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div>
      <div className="page-header">
        <Typography.Title level={2}>仓库设置</Typography.Title>
        <Typography.Paragraph type="secondary">MVP 单仓模式，覆盖山屿西山著东/西区</Typography.Paragraph>
      </div>
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="社区">{data.name}</Descriptions.Item>
          <Descriptions.Item label="服务分区">
            {data.zones.map((z: string) => (
              <Tag color="blue" key={z}>{z}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="前置仓">{data.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="仓 ID">{data.warehouseId}</Descriptions.Item>
          <Descriptions.Item label="地址">{data.address}</Descriptions.Item>
          <Descriptions.Item label="营业时间">{data.businessOpen} ~ {data.businessClose}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
