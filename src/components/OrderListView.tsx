import React, { useState, useEffect } from 'react';
import { api, type Order } from '../services/api';

interface OrderListViewProps {
  currentUser: any;
  onBack: () => void;
}

export function OrderListView({ currentUser, onBack }: OrderListViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filter !== 'all') {
        params.status = filter;
      }
      
      // 如果是司机且选择了"可接订单"
      if (currentUser.role === 'driver' && filter === 'available') {
        params.status = 'available';
      }

      const response = await api.getOrders(params);
      setOrders(response.orders || []);
    } catch (error: any) {
      setError(error.message || '加载订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await api.acceptOrder(orderId);
      alert('订单接受成功！');
      loadOrders(); // 重新加载订单列表
    } catch (error: any) {
      alert('接受订单失败：' + error.message);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      alert('订单状态更新成功！');
      loadOrders(); // 重新加载订单列表
    } catch (error: any) {
      alert('更新状态失败：' + error.message);
    }
  };

  const getOrderId = (order: Order) => {
    return order._id || order.id || '';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': '待接单',
      'accepted': '已接单',
      'in_progress': '进行中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'pending': '#f59e0b',
      'accepted': '#3b82f6',
      'in_progress': '#8b5cf6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    };
    return colorMap[status] || '#6b7280';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
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
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳</div>
          <p>加载订单中...</p>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, color: '#1f2937' }}>
              {currentUser.role === 'customer' ? '我的订单' : '订单管理'}
            </h1>
            <button
              onClick={onBack}
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
              返回
            </button>
          </div>

          {/* 过滤器 */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {currentUser.role === 'customer' ? (
              <>
                <button
                  onClick={() => setFilter('all')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: filter === 'all' ? '#2563eb' : '#f3f4f6',
                    color: filter === 'all' ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  全部订单
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: filter === 'pending' ? '#2563eb' : '#f3f4f6',
                    color: filter === 'pending' ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  待接单
                </button>
                <button
                  onClick={() => setFilter('accepted')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: filter === 'accepted' ? '#2563eb' : '#f3f4f6',
                    color: filter === 'accepted' ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  已接单
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: filter === 'completed' ? '#2563eb' : '#f3f4f6',
                    color: filter === 'completed' ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  已完成
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setFilter('available')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: filter === 'available' ? '#2563eb' : '#f3f4f6',
                    color: filter === 'available' ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  可接订单
                </button>
                <button
                  onClick={() => setFilter('accepted')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: filter === 'accepted' ? '#2563eb' : '#f3f4f6',
                    color: filter === 'accepted' ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  我的订单
                </button>
              </>
            )}
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            color: '#dc2626', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '3rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#6b7280', margin: 0 }}>暂无订单</h3>
            <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              {filter === 'available' ? '当前没有可接的订单' : '还没有任何订单记录'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.125rem' }}>
                      订单 #{getOrderId(order).slice(-8)}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      创建时间：{formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937', fontSize: '1.125rem', fontWeight: '600' }}>
                      CHF {order.estimatedPrice}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.875rem', fontWeight: '600' }}>
                      📍 接机信息
                    </h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                      {order.pickupAddress}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                      🕐 {formatDateTime(order.pickupDateTime)}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.875rem', fontWeight: '600' }}>
                      🏁 目的地
                    </h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                      {order.destinationAddress}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>客户：</span>
                    <span style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>
                      {order.customerName}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>乘客：</span>
                    <span style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>
                      {order.passengerCount}人
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>行李：</span>
                    <span style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>
                      {order.luggageCount}件
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                {currentUser.role === 'driver' && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {order.status === 'pending' && filter === 'available' && (
                      <button
                        onClick={() => handleAcceptOrder(getOrderId(order))}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        接受订单
                      </button>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(getOrderId(order), 'in_progress')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        开始服务
                      </button>
                    )}
                    {order.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(getOrderId(order), 'completed')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        完成订单
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
