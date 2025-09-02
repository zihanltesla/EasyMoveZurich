import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { PickupOrder, OrderStatus, UserRole } from '../types';
import { OrderCard } from './OrderCard';
import { getOrderStatusText } from '../utils/mockData';

interface OrderListProps {
  orders: PickupOrder[];
  userRole?: 'customer' | 'driver';
  showDriverInfo?: boolean;
  onAcceptOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  title?: string;
}

type SortField = 'createdAt' | 'pickupDateTime' | 'estimatedPrice' | 'status';
type SortDirection = 'asc' | 'desc';

export function OrderList({ 
  orders, 
  userRole = 'customer',
  showDriverInfo = false,
  onAcceptOrder,
  onUpdateStatus,
  title = '订单列表'
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // 过滤和排序订单
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(term) ||
        order.customerPhone.includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.pickupLocation.street.toLowerCase().includes(term) ||
        order.destination.street.toLowerCase().includes(term) ||
        order.flightNumber?.toLowerCase().includes(term) ||
        order.airline?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'pickupDateTime':
          aValue = a.pickupDateTime.getTime();
          bValue = b.pickupDateTime.getTime();
          break;
        case 'estimatedPrice':
          aValue = a.finalPrice || a.estimatedPrice;
          bValue = b.finalPrice || b.estimatedPrice;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4 ml-1" /> : 
      <SortDesc className="w-4 h-4 ml-1" />;
  };

  // 统计信息
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === OrderStatus.PENDING).length;
    const accepted = orders.filter(o => o.status === OrderStatus.ACCEPTED).length;
    const inProgress = orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length;
    const completed = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    const cancelled = orders.filter(o => o.status === OrderStatus.CANCELLED).length;

    return { total, pending, accepted, inProgress, completed, cancelled };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* 标题和统计 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            共 {stats.total} 个订单 • 
            待接单 {stats.pending} • 
            已接单 {stats.accepted} • 
            进行中 {stats.inProgress} • 
            已完成 {stats.completed}
            {stats.cancelled > 0 && ` • 已取消 ${stats.cancelled}`}
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Filter className="w-4 h-4" />
          筛选和排序
        </button>
      </div>

      {/* 搜索和过滤器 */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索订单（客户姓名、电话、地址、航班号等）"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 状态过滤 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                订单状态
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value={OrderStatus.PENDING}>待接单</option>
                <option value={OrderStatus.ACCEPTED}>已接单</option>
                <option value={OrderStatus.IN_PROGRESS}>进行中</option>
                <option value={OrderStatus.COMPLETED}>已完成</option>
                <option value={OrderStatus.CANCELLED}>已取消</option>
              </select>
            </div>

            {/* 排序字段 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序方式
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">创建时间</option>
                <option value="pickupDateTime">接机时间</option>
                <option value="estimatedPrice">价格</option>
                <option value="status">状态</option>
              </select>
            </div>

            {/* 排序方向 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序方向
              </label>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as SortDirection)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>

          {/* 快速排序按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort('createdAt')}
              className={`flex items-center px-3 py-1 text-sm rounded-md border ${
                sortField === 'createdAt' 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              创建时间
              {getSortIcon('createdAt')}
            </button>
            
            <button
              onClick={() => handleSort('pickupDateTime')}
              className={`flex items-center px-3 py-1 text-sm rounded-md border ${
                sortField === 'pickupDateTime' 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              接机时间
              {getSortIcon('pickupDateTime')}
            </button>
            
            <button
              onClick={() => handleSort('estimatedPrice')}
              className={`flex items-center px-3 py-1 text-sm rounded-md border ${
                sortField === 'estimatedPrice' 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              价格
              {getSortIcon('estimatedPrice')}
            </button>
          </div>
        </div>
      )}

      {/* 订单列表 */}
      <div className="space-y-4">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">暂无订单</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? '没有找到符合条件的订单，请尝试调整搜索条件' 
                : '还没有任何订单，快来创建第一个订单吧！'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              userRole={userRole}
              showDriverInfo={showDriverInfo}
              onAcceptOrder={onAcceptOrder}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>

      {/* 显示结果统计 */}
      {filteredAndSortedOrders.length > 0 && filteredAndSortedOrders.length !== orders.length && (
        <div className="text-center text-sm text-gray-500 py-4">
          显示 {filteredAndSortedOrders.length} / {orders.length} 个订单
        </div>
      )}
    </div>
  );
}
