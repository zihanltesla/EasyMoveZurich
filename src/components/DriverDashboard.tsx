import React, { useState, useEffect } from 'react';
import { Car, Clock, CheckCircle, DollarSign, Star, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderList } from './OrderList';
import { OrderStatus, Driver, PickupOrder } from '../types';
import { mockDrivers, mockOrders } from '../utils/mockData';

interface DriverDashboardProps {
  driver?: Driver;
}

export function DriverDashboard({ driver }: DriverDashboardProps) {
  const { state, updateOrder, dispatch } = useApp();
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(driver || null);
  const [availableOrders, setAvailableOrders] = useState<PickupOrder[]>([]);
  const [myOrders, setMyOrders] = useState<PickupOrder[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);

  // 模拟司机登录（实际应用中应该从认证系统获取）
  useEffect(() => {
    if (!currentDriver) {
      // 模拟登录第一个司机
      setCurrentDriver(mockDrivers[0]);
    }
  }, [currentDriver]);

  // 初始化订单数据
  useEffect(() => {
    if (state.orders.length === 0) {
      dispatch({ type: 'SET_ORDERS', payload: mockOrders });
    }
  }, [state.orders.length, dispatch]);

  // 更新订单列表
  useEffect(() => {
    if (currentDriver) {
      // 可接单的订单（待接单状态）
      const available = state.orders.filter(order => 
        order.status === OrderStatus.PENDING
      );
      setAvailableOrders(available);

      // 我的订单（已接单、进行中、已完成）
      const mine = state.orders.filter(order => 
        order.driverId === currentDriver.id
      );
      setMyOrders(mine);
    }
  }, [state.orders, currentDriver]);

  const handleAcceptOrder = (orderId: string) => {
    if (!currentDriver) return;

    const orderToUpdate = state.orders.find(order => order.id === orderId);
    if (!orderToUpdate) return;

    // 更新订单状态为已接单
    updateOrder(orderId, {
      status: OrderStatus.ACCEPTED,
      driverId: currentDriver.id,
      driver: currentDriver,
      acceptedAt: new Date(),
      updatedAt: new Date()
    });

    // 显示成功消息（实际应用中可以使用toast通知）
    alert(`成功接单！订单 #${orderId.slice(-8)} 已分配给您。`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrder(orderId, {
      status: newStatus,
      updatedAt: new Date(),
      ...(newStatus === OrderStatus.COMPLETED && { completedAt: new Date() })
    });

    const statusText = {
      [OrderStatus.IN_PROGRESS]: '开始服务',
      [OrderStatus.COMPLETED]: '完成订单',
      [OrderStatus.CANCELLED]: '取消订单'
    }[newStatus];

    alert(`订单状态已更新为：${statusText}`);
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // 实际应用中应该更新服务器上的司机状态
  };

  // 计算统计数据
  const stats = {
    totalEarnings: myOrders
      .filter(order => order.status === OrderStatus.COMPLETED)
      .reduce((sum, order) => sum + (order.finalPrice || order.estimatedPrice), 0),
    completedTrips: myOrders.filter(order => order.status === OrderStatus.COMPLETED).length,
    activeOrders: myOrders.filter(order => 
      order.status === OrderStatus.ACCEPTED || order.status === OrderStatus.IN_PROGRESS
    ).length,
    availableOrders: availableOrders.length
  };

  if (!currentDriver) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">加载中...</h2>
          <p className="text-gray-500">正在获取司机信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 司机信息头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  欢迎回来，{currentDriver.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{currentDriver.rating} 评分</span>
                  </div>
                  <span>•</span>
                  <span>{currentDriver.totalTrips} 次服务</span>
                  <span>•</span>
                  <span>{currentDriver.vehicleInfo.make} {currentDriver.vehicleInfo.model}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">在线状态:</span>
                <button
                  onClick={toggleAvailability}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isAvailable 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {isAvailable ? '在线' : '离线'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今日收入</p>
                <p className="text-2xl font-bold text-green-600">CHF {stats.totalEarnings}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">完成订单</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completedTrips}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">进行中订单</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">可接订单</p>
                <p className="text-2xl font-bold text-purple-600">{stats.availableOrders}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* 车辆信息卡片 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">车辆信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">车辆</p>
              <p className="font-medium">
                {currentDriver.vehicleInfo.make} {currentDriver.vehicleInfo.model} ({currentDriver.vehicleInfo.year})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">车牌号</p>
              <p className="font-medium">{currentDriver.vehicleInfo.licensePlate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">载客量</p>
              <p className="font-medium">{currentDriver.vehicleInfo.capacity} 人</p>
            </div>
          </div>
        </div>

        {/* 订单列表标签页 */}
        <div className="space-y-8">
          {/* 可接订单 */}
          {isAvailable && (
            <div>
              <OrderList
                orders={availableOrders}
                userRole="driver"
                title="可接订单"
                onAcceptOrder={handleAcceptOrder}
                showDriverInfo={false}
              />
            </div>
          )}

          {/* 我的订单 */}
          <div>
            <OrderList
              orders={myOrders}
              userRole="driver"
              title="我的订单"
              onUpdateStatus={handleUpdateOrderStatus}
              showDriverInfo={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
