import React from 'react';
import { Calendar, MapPin, Users, Luggage, Plane, Phone, Mail, Star } from 'lucide-react';
import { PickupOrder, OrderStatus } from '../types';
import { formatAddress, getOrderStatusText, getOrderStatusColor } from '../utils/mockData';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface OrderCardProps {
  order: PickupOrder;
  showDriverInfo?: boolean;
  onAcceptOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  userRole?: 'customer' | 'driver';
}

export function OrderCard({ 
  order, 
  showDriverInfo = false, 
  onAcceptOrder, 
  onUpdateStatus,
  userRole = 'customer'
}: OrderCardProps) {
  
  const statusColor = getOrderStatusColor(order.status);
  const statusText = getOrderStatusText(order.status);
  
  const canAcceptOrder = userRole === 'driver' && order.status === OrderStatus.PENDING;
  const canUpdateStatus = userRole === 'driver' && order.driverId && order.status === OrderStatus.ACCEPTED;

  const handleAcceptOrder = () => {
    if (onAcceptOrder) {
      onAcceptOrder(order.id);
    }
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* 订单头部 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            订单 #{order.id.slice(-8)}
          </h3>
          <p className="text-sm text-gray-600">
            创建时间: {format(order.createdAt, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
            style={{ backgroundColor: statusColor }}
          >
            {statusText}
          </span>
          <span className="text-lg font-bold text-green-600">
            CHF {order.finalPrice || order.estimatedPrice}
          </span>
        </div>
      </div>

      {/* 客户信息 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">客户信息</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{order.customerPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{order.customerEmail}</span>
          </div>
        </div>
      </div>

      {/* 行程信息 */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">行程信息</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">接机地点</p>
              <p className="text-sm text-gray-600">{formatAddress(order.pickupLocation)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">目的地</p>
              <p className="text-sm text-gray-600">{formatAddress(order.destination)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">接机时间</p>
              <p className="text-sm text-gray-600">
                {format(order.pickupDateTime, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 航班信息（如果有） */}
      {(order.flightNumber || order.airline) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Plane className="w-4 h-4" />
            航班信息
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {order.flightNumber && (
              <div>
                <span className="font-medium">航班号: </span>
                <span>{order.flightNumber}</span>
              </div>
            )}
            {order.airline && (
              <div>
                <span className="font-medium">航空公司: </span>
                <span>{order.airline}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 乘客和行李信息 */}
      <div className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{order.passengerCount} 人</span>
          </div>
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-gray-500" />
            <span>{order.luggageCount} 件行李</span>
          </div>
        </div>
      </div>

      {/* 特殊要求和备注 */}
      {(order.specialRequirements || order.notes) && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          {order.specialRequirements && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">特殊要求: </span>
              <span className="text-sm text-gray-600">{order.specialRequirements}</span>
            </div>
          )}
          {order.notes && (
            <div>
              <span className="font-medium text-gray-700">备注: </span>
              <span className="text-sm text-gray-600">{order.notes}</span>
            </div>
          )}
        </div>
      )}

      {/* 司机信息（如果已接单且需要显示） */}
      {showDriverInfo && order.driver && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">司机信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{order.driver.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">
                      {order.driver.rating} ({order.driver.totalTrips} 次服务)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>电话: {order.driver.phone}</p>
                <p>邮箱: {order.driver.email}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">车辆信息</p>
              <div className="text-sm text-gray-600">
                <p>{order.driver.vehicleInfo.make} {order.driver.vehicleInfo.model}</p>
                <p>{order.driver.vehicleInfo.color} • {order.driver.vehicleInfo.year}</p>
                <p>车牌: {order.driver.vehicleInfo.licensePlate}</p>
                <p>载客量: {order.driver.vehicleInfo.capacity} 人</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {canAcceptOrder && (
          <button
            onClick={handleAcceptOrder}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            接受订单
          </button>
        )}
        
        {canUpdateStatus && (
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => handleUpdateStatus(OrderStatus.IN_PROGRESS)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
            >
              开始服务
            </button>
            <button
              onClick={() => handleUpdateStatus(OrderStatus.COMPLETED)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm"
            >
              完成订单
            </button>
          </div>
        )}
        
        {userRole === 'customer' && order.status === OrderStatus.PENDING && (
          <button
            onClick={() => handleUpdateStatus(OrderStatus.CANCELLED)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            取消订单
          </button>
        )}
      </div>

      {/* 时间戳信息 */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>创建: {format(order.createdAt, 'MM/dd HH:mm')}</span>
          {order.acceptedAt && (
            <span>接单: {format(order.acceptedAt, 'MM/dd HH:mm')}</span>
          )}
          {order.completedAt && (
            <span>完成: {format(order.completedAt, 'MM/dd HH:mm')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
