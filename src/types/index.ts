// 用户角色枚举
export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver'
}

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',        // 待接单
  ACCEPTED = 'accepted',      // 已接单
  IN_PROGRESS = 'in_progress', // 进行中
  COMPLETED = 'completed',    // 已完成
  CANCELLED = 'cancelled'     // 已取消
}

// 用户接口
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// 客户接口
export interface Customer extends User {
  role: UserRole.CUSTOMER;
}

// 司机接口
export interface Driver extends User {
  role: UserRole.DRIVER;
  licenseNumber: string;
  vehicleInfo: VehicleInfo;
  rating: number;
  totalTrips: number;
  isAvailable: boolean;
}

// 车辆信息接口
export interface VehicleInfo {
  make: string;        // 品牌
  model: string;       // 型号
  year: number;        // 年份
  color: string;       // 颜色
  licensePlate: string; // 车牌号
  capacity: number;    // 载客量
}

// 地址接口
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// 接机订单接口
export interface PickupOrder {
  id: string;
  customerId: string;
  driverId?: string;
  
  // 客户信息
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  
  // 接机详情
  pickupLocation: Address;
  destination: Address;
  pickupDateTime: Date;
  
  // 航班信息（可选）
  flightNumber?: string;
  airline?: string;
  
  // 乘客信息
  passengerCount: number;
  luggageCount: number;
  specialRequirements?: string;
  
  // 订单状态和时间
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  
  // 价格信息
  estimatedPrice: number;
  finalPrice?: number;
  
  // 司机信息（接单后）
  driver?: Driver;
  
  // 备注
  notes?: string;
}

// 创建订单的表单数据
export interface CreateOrderForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: Omit<Address, 'coordinates'>;
  destination: Omit<Address, 'coordinates'>;
  pickupDateTime: string; // ISO string format
  flightNumber?: string;
  airline?: string;
  passengerCount: number;
  luggageCount: number;
  specialRequirements?: string;
  notes?: string;
}

// 应用状态接口
export interface AppState {
  currentUser: User | null;
  orders: PickupOrder[];
  drivers: Driver[];
  isLoading: boolean;
  error: string | null;
}

// 操作类型
export enum ActionType {
  SET_USER = 'SET_USER',
  SET_ORDERS = 'SET_ORDERS',
  ADD_ORDER = 'ADD_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  SET_DRIVERS = 'SET_DRIVERS',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR'
}

// Action接口
export type AppAction = 
  | { type: ActionType.SET_USER; payload: User | null }
  | { type: ActionType.SET_ORDERS; payload: PickupOrder[] }
  | { type: ActionType.ADD_ORDER; payload: PickupOrder }
  | { type: ActionType.UPDATE_ORDER; payload: { id: string; updates: Partial<PickupOrder> } }
  | { type: ActionType.SET_DRIVERS; payload: Driver[] }
  | { type: ActionType.SET_LOADING; payload: boolean }
  | { type: ActionType.SET_ERROR; payload: string }
  | { type: ActionType.CLEAR_ERROR };
