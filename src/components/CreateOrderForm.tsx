import React, { useState } from 'react';
import { Calendar, MapPin, Plane, Users, Luggage, MessageSquare } from 'lucide-react';
import { CreateOrderForm as CreateOrderFormType, OrderStatus } from '../types';
import { useApp } from '../context/AppContext';
import { generateOrderId, calculateEstimatedPrice } from '../utils/mockData';

interface CreateOrderFormProps {
  onSubmit?: (order: any) => void;
  onCancel?: () => void;
}

export function CreateOrderForm({ onSubmit, onCancel }: CreateOrderFormProps) {
  const { addOrder } = useApp();
  
  const [formData, setFormData] = useState<CreateOrderFormType>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupLocation: {
      street: '',
      city: 'Zurich',
      postalCode: '',
      country: 'Switzerland'
    },
    destination: {
      street: '',
      city: 'Zurich',
      postalCode: '',
      country: 'Switzerland'
    },
    pickupDateTime: '',
    flightNumber: '',
    airline: '',
    passengerCount: 1,
    luggageCount: 1,
    specialRequirements: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '请输入客户姓名';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '请输入联系电话';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = '请输入邮箱地址';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = '请输入有效的邮箱地址';
    }
    if (!formData.pickupLocation.street.trim()) {
      newErrors['pickupLocation.street'] = '请输入接机地址';
    }
    if (!formData.destination.street.trim()) {
      newErrors['destination.street'] = '请输入目的地地址';
    }
    if (!formData.pickupDateTime) {
      newErrors.pickupDateTime = '请选择接机时间';
    }
    if (formData.passengerCount < 1 || formData.passengerCount > 8) {
      newErrors.passengerCount = '乘客数量应在1-8人之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedPrice = calculateEstimatedPrice(
        formData.pickupLocation.street,
        formData.destination.street,
        formData.passengerCount
      );

      const newOrder = {
        id: generateOrderId(),
        customerId: generateOrderId(), // 临时生成，实际应该从用户登录状态获取
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        pickupLocation: formData.pickupLocation,
        destination: formData.destination,
        pickupDateTime: new Date(formData.pickupDateTime),
        flightNumber: formData.flightNumber || undefined,
        airline: formData.airline || undefined,
        passengerCount: formData.passengerCount,
        luggageCount: formData.luggageCount,
        specialRequirements: formData.specialRequirements || undefined,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedPrice,
        notes: formData.notes || undefined
      };

      addOrder(newOrder);
      
      if (onSubmit) {
        onSubmit(newOrder);
      }

      // 重置表单
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        pickupLocation: {
          street: '',
          city: 'Zurich',
          postalCode: '',
          country: 'Switzerland'
        },
        destination: {
          street: '',
          city: 'Zurich',
          postalCode: '',
          country: 'Switzerland'
        },
        pickupDateTime: '',
        flightNumber: '',
        airline: '',
        passengerCount: 1,
        luggageCount: 1,
        specialRequirements: '',
        notes: ''
      });

    } catch (error) {
      console.error('创建订单失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">预约接机服务</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 客户信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">客户信息</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入您的姓名"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              联系电话 *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+41 79 123 4567"
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址 *
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
            )}
          </div>
        </div>

        {/* 行程信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">行程信息</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              接机地址 *
            </label>
            <input
              type="text"
              value={formData.pickupLocation.street}
              onChange={(e) => handleInputChange('pickupLocation.street', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors['pickupLocation.street'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例如：苏黎世机场 1号航站楼"
            />
            {errors['pickupLocation.street'] && (
              <p className="text-red-500 text-sm mt-1">{errors['pickupLocation.street']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              目的地地址 *
            </label>
            <input
              type="text"
              value={formData.destination.street}
              onChange={(e) => handleInputChange('destination.street', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors['destination.street'] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例如：班霍夫大街 1号"
            />
            {errors['destination.street'] && (
              <p className="text-red-500 text-sm mt-1">{errors['destination.street']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              接机时间 *
            </label>
            <input
              type="datetime-local"
              value={formData.pickupDateTime}
              onChange={(e) => handleInputChange('pickupDateTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pickupDateTime ? 'border-red-500' : 'border-gray-300'
              }`}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.pickupDateTime && (
              <p className="text-red-500 text-sm mt-1">{errors.pickupDateTime}</p>
            )}
          </div>
        </div>

        {/* 航班信息（可选） */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">航班信息（可选）</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Plane className="inline w-4 h-4 mr-1" />
                航班号
              </label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：LX 1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                航空公司
              </label>
              <input
                type="text"
                value={formData.airline}
                onChange={(e) => handleInputChange('airline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：瑞士国际航空"
              />
            </div>
          </div>
        </div>

        {/* 乘客和行李信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">乘客和行李信息</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="inline w-4 h-4 mr-1" />
                乘客数量 *
              </label>
              <select
                value={formData.passengerCount}
                onChange={(e) => handleInputChange('passengerCount', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.passengerCount ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num}人</option>
                ))}
              </select>
              {errors.passengerCount && (
                <p className="text-red-500 text-sm mt-1">{errors.passengerCount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Luggage className="inline w-4 h-4 mr-1" />
                行李数量
              </label>
              <select
                value={formData.luggageCount}
                onChange={(e) => handleInputChange('luggageCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num}件</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 特殊要求和备注 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              特殊要求
            </label>
            <input
              type="text"
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：需要儿童座椅、轮椅无障碍等"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageSquare className="inline w-4 h-4 mr-1" />
              备注信息
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="其他需要说明的信息..."
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '提交中...' : '提交订单'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
