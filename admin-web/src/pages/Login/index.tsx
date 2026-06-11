/** 登录页：POST /admin/login，DEV 环境预填 admin/admin123 */
import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { adminApi } from '../../services/api';
import { MVP_COMMUNITY } from '../../config/constants';

interface Props {
  onLogin: (token: string, name: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await adminApi.login(values.username, values.password);
      message.success('登录成功');
      onLogin(res.token, res.name);
    } catch (e: any) {
      message.error(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Typography.Title level={3} className="login-title">
          邻选·管理
        </Typography.Title>
        <Typography.Text type="secondary" className="login-subtitle">
          {MVP_COMMUNITY.name} · {MVP_COMMUNITY.warehouseName}
        </Typography.Text>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={import.meta.env.DEV ? { username: 'admin', password: 'admin123' } : undefined}>
          <Form.Item name="username" label="账号" rules={[{ required: true }]}>
            <Input size="large" placeholder="运营管理员账号" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password size="large" placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
        {import.meta.env.DEV && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          本地开发演示账号：admin / admin123（生产请配置 ADMIN_PASSWORD）
        </Typography.Text>
        )}
      </div>
    </div>
  );
}
