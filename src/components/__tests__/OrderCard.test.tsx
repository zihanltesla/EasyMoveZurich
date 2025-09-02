import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderCard } from '../OrderCard';
import { OrderStatus, UserRole } from '../../types';
import { mockOrders } from '../../utils/mockData';

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => {
    if (formatStr.includes('yyyy年MM月dd日')) {
      return '2024年01月15日 14:30';
    }
    return '01/15 14:30';
  })
}));

// Mock date-fns/locale
vi.mock('date-fns/locale', () => ({
  zhCN: {}
}));

describe('OrderCard', () => {
  const mockOrder = mockOrders[0];

  it('renders order information correctly', () => {
    render(
      <OrderCard 
        order={mockOrder}
        userRole="customer"
      />
    );

    // 检查订单号是否显示
    expect(screen.getByText(/订单 #/)).toBeInTheDocument();
    
    // 检查客户信息
    expect(screen.getByText(mockOrder.customerName)).toBeInTheDocument();
    expect(screen.getByText(mockOrder.customerPhone)).toBeInTheDocument();
    expect(screen.getByText(mockOrder.customerEmail)).toBeInTheDocument();
    
    // 检查价格信息
    expect(screen.getByText(`CHF ${mockOrder.estimatedPrice}`)).toBeInTheDocument();
  });

  it('shows accept button for drivers when order is pending', () => {
    const onAcceptOrder = vi.fn();
    
    render(
      <OrderCard 
        order={mockOrder}
        userRole="driver"
        onAcceptOrder={onAcceptOrder}
      />
    );

    const acceptButton = screen.getByText('接受订单');
    expect(acceptButton).toBeInTheDocument();
    
    fireEvent.click(acceptButton);
    expect(onAcceptOrder).toHaveBeenCalledWith(mockOrder.id);
  });

  it('shows driver info when showDriverInfo is true and driver exists', () => {
    const orderWithDriver = {
      ...mockOrder,
      status: OrderStatus.ACCEPTED,
      driver: {
        id: 'driver-1',
        name: 'Test Driver',
        email: 'driver@test.com',
        phone: '+41 79 123 4567',
        role: UserRole.DRIVER,
        licenseNumber: 'CH-12345678',
        vehicleInfo: {
          make: 'BMW',
          model: '5 Series',
          year: 2022,
          color: 'Black',
          licensePlate: 'ZH 123456',
          capacity: 4
        },
        rating: 4.8,
        totalTrips: 100,
        isAvailable: true,
        createdAt: new Date()
      }
    };

    render(
      <OrderCard 
        order={orderWithDriver}
        showDriverInfo={true}
        userRole="customer"
      />
    );

    expect(screen.getByText('司机信息')).toBeInTheDocument();
    expect(screen.getByText('Test Driver')).toBeInTheDocument();
    expect(screen.getByText('BMW 5 Series')).toBeInTheDocument();
  });

  it('shows flight information when available', () => {
    const orderWithFlight = {
      ...mockOrder,
      flightNumber: 'LX 1234',
      airline: 'Swiss International Air Lines'
    };

    render(
      <OrderCard 
        order={orderWithFlight}
        userRole="customer"
      />
    );

    expect(screen.getByText('航班信息')).toBeInTheDocument();
    expect(screen.getByText('LX 1234')).toBeInTheDocument();
    expect(screen.getByText('Swiss International Air Lines')).toBeInTheDocument();
  });

  it('shows special requirements and notes when available', () => {
    const orderWithExtras = {
      ...mockOrder,
      specialRequirements: 'Child seat required',
      notes: 'Please wait at arrivals hall'
    };

    render(
      <OrderCard 
        order={orderWithExtras}
        userRole="customer"
      />
    );

    expect(screen.getByText('Child seat required')).toBeInTheDocument();
    expect(screen.getByText('Please wait at arrivals hall')).toBeInTheDocument();
  });

  it('calls onUpdateStatus when status update buttons are clicked', () => {
    const onUpdateStatus = vi.fn();
    const acceptedOrder = {
      ...mockOrder,
      status: OrderStatus.ACCEPTED,
      driverId: 'driver-1'
    };

    render(
      <OrderCard 
        order={acceptedOrder}
        userRole="driver"
        onUpdateStatus={onUpdateStatus}
      />
    );

    const startButton = screen.getByText('开始服务');
    const completeButton = screen.getByText('完成订单');

    fireEvent.click(startButton);
    expect(onUpdateStatus).toHaveBeenCalledWith(acceptedOrder.id, OrderStatus.IN_PROGRESS);

    fireEvent.click(completeButton);
    expect(onUpdateStatus).toHaveBeenCalledWith(acceptedOrder.id, OrderStatus.COMPLETED);
  });

  it('shows cancel button for customers with pending orders', () => {
    const onUpdateStatus = vi.fn();

    render(
      <OrderCard 
        order={mockOrder}
        userRole="customer"
        onUpdateStatus={onUpdateStatus}
      />
    );

    const cancelButton = screen.getByText('取消订单');
    expect(cancelButton).toBeInTheDocument();
    
    fireEvent.click(cancelButton);
    expect(onUpdateStatus).toHaveBeenCalledWith(mockOrder.id, OrderStatus.CANCELLED);
  });
});
