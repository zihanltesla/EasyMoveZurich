import React, { useState, useEffect } from 'react';
import { Plus, User, Clock, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderList } from './OrderList';
import { CreateOrderForm } from './CreateOrderForm';
import { OrderStatus, Customer, PickupOrder } from '../types';
import { mockOrders } from '../utils/mockData';

interface CustomerDashboardProps {
  customer?: Customer;
}

export function CustomerDashboard({ customer }: CustomerDashboardProps) {
  const { state, updateOrder, dispatch } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [myOrders, setMyOrders] = useState<PickupOrder[]>([]);

  // 初始化订单数据
  useEffect(() => {
    if (state.orders.length === 0) {
      dispatch({ type: 'SET_ORDERS', payload: mockOrders });
    }
  }, [state.orders.length, dispatch]);

  // 更新我的订单列表（实际应用中应该根据客户ID过滤）
  useEffect(() => {
    // 模拟：显示所有订单（实际应用中应该只显示当前客户的订单）
    setMyOrders(state.orders);
  }, [state.orders]);

  const handleCreateOrder = (newOrder: PickupOrder) => {
    setShowCreateForm(false);
    // 订单已经在CreateOrderForm中添加到状态中
    alert(`订单创建成功！订单号：#${newOrder.id.slice(-8)}`);
  };

  const handleCancelOrder = (orderId: string) => {
    const confirmCancel = window.confirm('确定要取消这个订单吗？');
    if (confirmCancel) {
      updateOrder(orderId, {
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
      });
      alert('订单已取消');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === OrderStatus.CANCELLED) {
      handleCancelOrder(orderId);
    }
  };

  // 计算统计数据
  const stats = {
    totalOrders: myOrders.length,
    pendingOrders: myOrders.filter(order => order.status === OrderStatus.PENDING).length,
    activeOrders: myOrders.filter(order => 
      order.status === OrderStatus.ACCEPTED || order.status === OrderStatus.IN_PROGRESS
    ).length,
    completedOrders: myOrders.filter(order => order.status === OrderStatus.COMPLETED).length,
    totalSpent: myOrders
      .filter(order => order.status === OrderStatus.COMPLETED)
      .reduce((sum, order) => sum + (order.finalPrice || order.estimatedPrice), 0)
  };

  // 获取最近的订单
  const recentOrders = myOrders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  // 获取即将到来的接机
  const upcomingPickups = myOrders
    .filter(order => 
      order.status === OrderStatus.ACCEPTED || order.status === OrderStatus.IN_PROGRESS
    )
    .sort((a, b) => a.pickupDateTime.getTime() - b.pickupDateTime.getTime());

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreateOrderForm
            onSubmit={handleCreateOrder}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 客户信息头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  欢迎使用 EasyMove Zurich
                </h1>
                <p className="text-gray-600">您的专业接机服务平台</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              预约接机
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总订单数</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">待接单</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">进行中</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeOrders}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已完成</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* 即将到来的接机 */}
        {upcomingPickups.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">即将到来的接机</h3>
            <div className="space-y-4">
              {upcomingPickups.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.pickupLocation.street} → {order.destination.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.pickupDateTime.toLocaleDateString('zh-CN')} {order.pickupDateTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {order.driver && (
                        <p className="text-sm text-green-600">
                          司机：{order.driver.name} • {order.driver.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">CHF {order.finalPrice || order.estimatedPrice}</p>
                    <p className="text-sm text-gray-500">订单 #{order.id.slice(-8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 最近订单概览 */}
        {recentOrders.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">最近订单</h3>
              <button 
                onClick={() => {/* 滚动到完整订单列表 */}}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                查看全部
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      order.status === OrderStatus.COMPLETED ? 'bg-green-500' :
                      order.status === OrderStatus.IN_PROGRESS ? 'bg-blue-500' :
                      order.status === OrderStatus.ACCEPTED ? 'bg-purple-500' :
                      order.status === OrderStatus.PENDING ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.pickupLocation.street.length > 30 
                          ? order.pickupLocation.street.substring(0, 30) + '...' 
                          : order.pickupLocation.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.createdAt.toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">CHF {order.finalPrice || order.estimatedPrice}</p>
                    <p className="text-sm text-gray-500">#{order.id.slice(-8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 完整订单列表 */}
        <div>
          <OrderList
            orders={myOrders}
            userRole="customer"
            title="我的订单"
            onUpdateStatus={handleUpdateOrderStatus}
            showDriverInfo={true}
          />
        </div>

        {/* 空状态 */}
        {myOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">还没有订单</h3>
            <p className="text-gray-500 mb-6">
              开始您的第一次接机预约，享受便捷的专业服务
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              立即预约接机
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
