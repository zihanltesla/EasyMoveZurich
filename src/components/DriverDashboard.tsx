import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DriverDashboardProps {
  currentUser: any;
  onViewOrders: () => void;
  onLogout: () => void;
}

interface DriverStats {
  driverInfo: {
    name: string;
    rating: number;
    totalTrips: number;
    isAvailable: boolean;
    vehicleInfo: {
      make: string;
      model: string;
      color: string;
      plate: string;
    };
  };
  stats: {
    totalOrders: number;
    completedOrders: number;
    activeOrders: number;
    completionRate: number;
    monthlyEarnings: number;
    monthlyTrips: number;
  };
  recentOrders: Array<{
    id: string;
    customerName: string;
    pickupAddress: string;
    destinationAddress: string;
    status: string;
    price: number;
    date: string;
  }>;
}

export function DriverDashboard({ currentUser, onViewOrders, onLogout }: DriverDashboardProps) {
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    loadDriverStats();
  }, []);

  const loadDriverStats = async () => {
    try {
      setLoading(true);
      const response = await api.getDriverStats();
      setStats(response);
    } catch (error: any) {
      console.error('Failed to load driver stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!stats) return;

    try {
      setUpdatingAvailability(true);
      const newAvailability = !stats.driverInfo.isAvailable;
      await api.updateDriverAvailability(newAvailability);

      // 更新本地状态
      setStats(prev => prev ? {
        ...prev,
        driverInfo: {
          ...prev.driverInfo,
          isAvailable: newAvailability
        }
      } : null);

      alert(`状态已更新为${newAvailability ? '可接单' : '暂停接单'}`);
    } catch (error: any) {
      alert('更新状态失败：' + error.message);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#f59e0b',
      'accepted': '#3b82f6',
      'in_progress': '#8b5cf6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'pending': '待接单',
      'accepted': '已接单',
      'in_progress': '进行中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚗</div>
          <p>加载司机信息中...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <p>无法加载司机信息</p>
          <button
            onClick={loadDriverStats}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, color: '#1f2937' }}>司机控制台</h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                欢迎回来，{stats.driverInfo.name}！
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* 可用状态切换 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>接单状态:</span>
                <button
                  onClick={toggleAvailability}
                  disabled={updatingAvailability}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: stats.driverInfo.isAvailable ? '#10b981' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '1rem',
                    cursor: updatingAvailability ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {updatingAvailability ? '更新中...' : (stats.driverInfo.isAvailable ? '🟢 可接单' : '🔴 暂停中')}
                </button>
              </div>
              <button
                onClick={onLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>总订单数</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>
                  {stats.stats.totalOrders}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>📋</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>完成率</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>
                  {stats.stats.completionRate}%
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>✅</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>本月收入</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>
                  CHF {stats.stats.monthlyEarnings}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>💰</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>司机评分</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>
                  {stats.driverInfo.rating.toFixed(1)} ⭐
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>🌟</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => onViewOrders()}
            style={{
              padding: '1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            🔍 查看可接订单
          </button>

          <button
            onClick={() => onViewOrders()}
            style={{
              padding: '1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            📋 我的订单
          </button>
        </div>

        {/* 最近订单 */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#1f2937' }}>最近订单</h2>

          {stats.recentOrders.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>暂无订单记录</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: '500', color: '#1f2937' }}>
                      {order.customerName}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      {order.pickupAddress} → {order.destinationAddress}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(order.date).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontWeight: '600' }}>
                      CHF {order.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
