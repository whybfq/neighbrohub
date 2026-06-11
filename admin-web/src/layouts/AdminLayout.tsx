/**
 * 管理后台布局：左侧菜单对应 App.tsx 中 Route
 * menuItems.key 与 pages 目录一一对应
 */
import { useState } from 'react';
import { Layout, Menu, theme, Typography, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  CarOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MVP_COMMUNITY } from '../config/constants';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/products', icon: <ShoppingOutlined />, label: '商品管理' },
  { key: '/inventory', icon: <DatabaseOutlined />, label: '库存管理' },
  { key: '/orders', icon: <FileTextOutlined />, label: '订单中心' },
  { key: '/fulfillment', icon: <FileTextOutlined />, label: '履约监控' },
  { key: '/couriers', icon: <CarOutlined />, label: '配送员管理' },
  { key: '/warehouse', icon: <HomeOutlined />, label: '仓库设置' },
];

interface Props {
  adminName: string;
  onLogout: () => void;
}

export default function AdminLayout({ adminName, onLogout }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: themeToken } = theme.useToken();

  const selectedKey = menuItems.find((m) => m.key !== '/' && location.pathname.startsWith(m.key))?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Typography.Text strong style={{ fontSize: collapsed ? 14 : 16 }}>
            {collapsed ? '邻选' : '邻选·管理'}
          </Typography.Text>
          {!collapsed && (
            <Typography.Paragraph type="secondary" style={{ margin: '4px 0 0', fontSize: 12 }}>
              {MVP_COMMUNITY.name}
            </Typography.Paragraph>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography.Text type="secondary">
            {MVP_COMMUNITY.warehouseName} · 服务 {MVP_COMMUNITY.zones.join(' / ')}
          </Typography.Text>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: onLogout,
                },
              ],
            }}
          >
            <Space style={{ cursor: 'pointer' }}>
              <UserOutlined />
              <span>{adminName}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
