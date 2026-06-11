/**
 * 邻选·管理 — 根组件与路由
 *
 * token 存 localStorage；未登录渲染 LoginPage，已登录走 AdminLayout 子路由。
 * 各业务页见 src/pages/*，数据来自 adminApi → server /admin/*
 */
import { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ProductsPage from './pages/Products';
import InventoryPage from './pages/Inventory';
import OrdersPage from './pages/Orders';
import FulfillmentPage from './pages/Fulfillment';
import CouriersPage from './pages/Couriers';
import WarehousePage from './pages/Warehouse';

const TOKEN_KEY = 'admin_token';
const NAME_KEY = 'admin_name';

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [adminName, setAdminName] = useState(() => localStorage.getItem(NAME_KEY) || '管理员');

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const handleLogin = (t: string, name: string) => {
    setToken(t);
    setAdminName(name);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(NAME_KEY, name);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem(NAME_KEY);
  };

  if (!token) {
    return (
      <ConfigProvider locale={zhCN}>
        <LoginPage onLogin={handleLogin} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout adminName={adminName} onLogout={handleLogout} />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="fulfillment" element={<FulfillmentPage />} />
            <Route path="couriers" element={<CouriersPage />} />
            <Route path="warehouse" element={<WarehousePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
