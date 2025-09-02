import { v4 as uuidv4 } from 'uuid';
import { Driver, PickupOrder, OrderStatus, UserRole, VehicleInfo } from '../types';

// 模拟司机数据
export const mockDrivers: Driver[] = [
  {
    id: uuidv4(),
    name: 'Hans Mueller',
    email: 'hans.mueller@email.com',
    phone: '+41 79 123 4567',
    role: UserRole.DRIVER,
    licenseNumber: 'CH-12345678',
    vehicleInfo: {
      make: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2022,
      color: 'Black',
      licensePlate: 'ZH 123456',
      capacity: 4
    },
    rating: 4.8,
    totalTrips: 156,
    isAvailable: true,
    createdAt: new Date('2023-01-15')
  },
  {
    id: uuidv4(),
    name: 'Maria Rossi',
    email: 'maria.rossi@email.com',
    phone: '+41 79 234 5678',
    role: UserRole.DRIVER,
    licenseNumber: 'CH-87654321',
    vehicleInfo: {
      make: 'BMW',
      model: '5 Series',
      year: 2021,
      color: 'Silver',
      licensePlate: 'ZH 654321',
      capacity: 4
    },
    rating: 4.9,
    totalTrips: 203,
    isAvailable: true,
    createdAt: new Date('2022-11-20')
  },
  {
    id: uuidv4(),
    name: 'Pierre Dubois',
    email: 'pierre.dubois@email.com',
    phone: '+41 79 345 6789',
    role: UserRole.DRIVER,
    licenseNumber: 'CH-11223344',
    vehicleInfo: {
      make: 'Audi',
      model: 'A6',
      year: 2023,
      color: 'Blue',
      licensePlate: 'ZH 789012',
      capacity: 4
    },
    rating: 4.7,
    totalTrips: 89,
    isAvailable: false,
    createdAt: new Date('2023-03-10')
  }
];

// 模拟订单数据
export const mockOrders: PickupOrder[] = [
  {
    id: uuidv4(),
    customerId: uuidv4(),
    customerName: 'John Smith',
    customerPhone: '+1 555 123 4567',
    customerEmail: 'john.smith@email.com',
    pickupLocation: {
      street: 'Zurich Airport, Terminal 1',
      city: 'Zurich',
      postalCode: '8058',
      country: 'Switzerland',
      coordinates: { lat: 47.4647, lng: 8.5492 }
    },
    destination: {
      street: 'Bahnhofstrasse 1',
      city: 'Zurich',
      postalCode: '8001',
      country: 'Switzerland',
      coordinates: { lat: 47.3769, lng: 8.5417 }
    },
    pickupDateTime: new Date('2024-01-15T14:30:00'),
    flightNumber: 'LX 1234',
    airline: 'Swiss International Air Lines',
    passengerCount: 2,
    luggageCount: 3,
    specialRequirements: 'Child seat required',
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-10T10:00:00'),
    updatedAt: new Date('2024-01-10T10:00:00'),
    estimatedPrice: 65,
    notes: 'Please wait at arrivals hall'
  },
  {
    id: uuidv4(),
    customerId: uuidv4(),
    driverId: mockDrivers[0].id,
    customerName: 'Emma Johnson',
    customerPhone: '+44 20 7123 4567',
    customerEmail: 'emma.johnson@email.com',
    pickupLocation: {
      street: 'Hotel Baur au Lac, Talstrasse 1',
      city: 'Zurich',
      postalCode: '8001',
      country: 'Switzerland',
      coordinates: { lat: 47.3669, lng: 8.5392 }
    },
    destination: {
      street: 'Zurich Airport, Terminal 2',
      city: 'Zurich',
      postalCode: '8058',
      country: 'Switzerland',
      coordinates: { lat: 47.4647, lng: 8.5492 }
    },
    pickupDateTime: new Date('2024-01-12T08:00:00'),
    flightNumber: 'BA 712',
    airline: 'British Airways',
    passengerCount: 1,
    luggageCount: 2,
    status: OrderStatus.ACCEPTED,
    createdAt: new Date('2024-01-08T15:30:00'),
    updatedAt: new Date('2024-01-09T09:15:00'),
    acceptedAt: new Date('2024-01-09T09:15:00'),
    estimatedPrice: 55,
    driver: mockDrivers[0],
    notes: 'Early morning pickup'
  },
  {
    id: uuidv4(),
    customerId: uuidv4(),
    driverId: mockDrivers[1].id,
    customerName: 'Michael Chen',
    customerPhone: '+86 138 0013 8000',
    customerEmail: 'michael.chen@email.com',
    pickupLocation: {
      street: 'Zurich Airport, Terminal 1',
      city: 'Zurich',
      postalCode: '8058',
      country: 'Switzerland',
      coordinates: { lat: 47.4647, lng: 8.5492 }
    },
    destination: {
      street: 'ETH Zurich, Rämistrasse 101',
      city: 'Zurich',
      postalCode: '8092',
      country: 'Switzerland',
      coordinates: { lat: 47.3763, lng: 8.5485 }
    },
    pickupDateTime: new Date('2024-01-05T16:45:00'),
    flightNumber: 'LX 188',
    airline: 'Swiss International Air Lines',
    passengerCount: 1,
    luggageCount: 1,
    status: OrderStatus.COMPLETED,
    createdAt: new Date('2024-01-02T12:00:00'),
    updatedAt: new Date('2024-01-05T17:30:00'),
    acceptedAt: new Date('2024-01-02T14:20:00'),
    completedAt: new Date('2024-01-05T17:30:00'),
    estimatedPrice: 45,
    finalPrice: 45,
    driver: mockDrivers[1]
  }
];

// 生成新订单ID的工具函数
export function generateOrderId(): string {
  return uuidv4();
}

// 计算预估价格的工具函数（简化版本）
export function calculateEstimatedPrice(
  pickupLocation: string,
  destination: string,
  passengerCount: number
): number {
  // 简化的价格计算逻辑
  const basePrice = 35;
  const distanceMultiplier = Math.random() * 0.5 + 0.8; // 模拟距离因子
  const passengerMultiplier = passengerCount > 2 ? 1.2 : 1;
  
  return Math.round(basePrice * distanceMultiplier * passengerMultiplier);
}

// 格式化地址的工具函数
export function formatAddress(address: any): string {
  return `${address.street}, ${address.city} ${address.postalCode}, ${address.country}`;
}

// 获取订单状态的中文显示
export function getOrderStatusText(status: OrderStatus): string {
  const statusMap = {
    [OrderStatus.PENDING]: '待接单',
    [OrderStatus.ACCEPTED]: '已接单',
    [OrderStatus.IN_PROGRESS]: '进行中',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELLED]: '已取消'
  };
  return statusMap[status];
}

// 获取订单状态的颜色
export function getOrderStatusColor(status: OrderStatus): string {
  const colorMap = {
    [OrderStatus.PENDING]: 'orange',
    [OrderStatus.ACCEPTED]: 'blue',
    [OrderStatus.IN_PROGRESS]: 'purple',
    [OrderStatus.COMPLETED]: 'green',
    [OrderStatus.CANCELLED]: 'red'
  };
  return colorMap[status];
}
