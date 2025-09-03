import { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { ProfileManager } from './components/ProfileManager';
import { CreateOrderForm } from './components/CreateOrderForm';
import { OrderListView } from './components/OrderListView';
import { api } from './services/api';
import { DriverDashboard } from './components/DriverDashboard';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'create-order' | 'orders' | 'driver-dashboard'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否有存储的token
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getStoredToken();
      if (token) {
        try {
          const response = await api.getProfile();
          setCurrentUser(response.user);
        } catch (error) {
          // Token无效，清除存储的token
          api.removeStoredToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleOrderCreated = () => {
    setCurrentView('dashboard');
  };

  // 加载状态
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态
  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // 已登录状态 - 根据当前视图显示不同内容
  if (currentView === 'create-order') {
    return (
      <CreateOrderForm
        currentUser={currentUser}
        onOrderCreated={handleOrderCreated}
        onCancel={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'orders') {
    return (
      <OrderListView
        currentUser={currentUser}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'driver-dashboard') {
    return (
      <DriverDashboard
        currentUser={currentUser}
        onViewOrders={() => setCurrentView('orders')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <div>
        {/* 导航栏 */}
        <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, color: '#2563eb' }}>EasyMove Zurich</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                {currentUser.role === 'driver' ? '司机端' : '客户端'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setCurrentView('dashboard')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                返回主页
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                退出
              </button>
            </div>
          </div>
        </nav>

        <ProfileManager currentUser={currentUser} onUserUpdate={handleUserUpdate} />
      </div>
    );
  }

  // 默认仪表板视图
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      {/* 导航栏 */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#2563eb' }}>EasyMove Zurich</h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              {currentUser.role === 'driver' ? '司机端' : '客户端'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>{currentUser.name}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('profile')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              账户管理
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div style={{ padding: '2rem' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>
            欢迎，{currentUser.name}！
          </h2>

          {currentUser.role === 'customer' ? (
            <div>
              <h3>客户功能</h3>
              <ul style={{ marginTop: '1rem' }}>
                <li>📝 预约接机服务</li>
                <li>📋 查看订单状态</li>
                <li>🔍 搜索历史订单</li>
                <li>⭐ 评价司机服务</li>
              </ul>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentView('create-order')}
                >
                  预约接机
                </button>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentView('orders')}
                >
                  {currentUser.role === 'customer' ? '我的订单' : '订单管理'}
                </button>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentView('profile')}
                >
                  管理账户
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3>司机功能</h3>
              <ul style={{ marginTop: '1rem' }}>
                <li>🚗 查看可接订单</li>
                <li>✅ 一键接单</li>
                <li>📊 收入统计</li>
                <li>🔄 更新订单状态</li>
              </ul>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentView('driver-dashboard')}
                >
                  司机控制台
                </button>
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentView('profile')}
                >
                  管理账户
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
