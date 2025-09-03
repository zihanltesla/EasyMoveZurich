import React, { useState } from 'react';
import { api, type CreateOrderRequest } from '../services/api';

interface CreateOrderFormProps {
  currentUser: any;
  onOrderCreated: () => void;
  onCancel: () => void;
}

export function CreateOrderForm({ currentUser, onOrderCreated, onCancel }: CreateOrderFormProps) {
  const [formData, setFormData] = useState<CreateOrderRequest>({
    customerName: currentUser.name || '',
    customerPhone: currentUser.phone || '',
    customerEmail: currentUser.email || '',
    pickupAddress: '',
    pickupCity: 'Zurich',
    pickupPostalCode: '',
    destinationAddress: '',
    destinationCity: 'Zurich',
    destinationPostalCode: '',
    pickupDateTime: '',
    flightNumber: '',
    airline: '',
    passengerCount: 1,
    luggageCount: 0,
    specialRequirements: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    console.log('🔍 开始验证表单数据:', formData);
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '请输入客户姓名';
      console.log('❌ 客户姓名为空');
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '请输入联系电话';
      console.log('❌ 联系电话为空');
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = '请输入邮箱地址';
      console.log('❌ 邮箱地址为空');
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = '请输入有效的邮箱地址';
      console.log('❌ 邮箱格式无效');
    }
    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = '请输入接机地址';
      console.log('❌ 接机地址为空');
    }
    if (!formData.destinationAddress.trim()) {
      newErrors.destinationAddress = '请输入目的地地址';
      console.log('❌ 目的地地址为空');
    }
    if (!formData.pickupDateTime) {
      newErrors.pickupDateTime = '请选择接机时间';
      console.log('❌ 接机时间为空');
    } else {
      const pickupTime = new Date(formData.pickupDateTime);
      const now = new Date();
      if (pickupTime <= now) {
        newErrors.pickupDateTime = '接机时间必须是未来时间';
        console.log('❌ 接机时间不是未来时间');
      }
    }
    if (formData.passengerCount < 1 || formData.passengerCount > 8) {
      newErrors.passengerCount = '乘客数量应在1-8人之间';
      console.log('❌ 乘客数量无效');
    }

    console.log('🔍 验证错误:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 表单验证结果:', isValid ? '通过' : '失败');
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 表单提交开始');

    console.log('📝 验证表单...');
    if (!validateForm()) {
      console.log('❌ 表单验证失败');
      return;
    }
    console.log('✅ 表单验证通过');

    setIsLoading(true);

    try {
      console.log('📤 提交订单数据:', formData);
      const response = await api.createOrder(formData);
      console.log('📥 订单创建响应:', response);

      const orderId = response.order.id || response.order._id;
      alert(`订单创建成功！\n订单号：${orderId.slice(-8)}\n预估价格：CHF ${response.order.estimatedPrice}`);

      console.log('🎉 订单创建成功，调用回调函数');
      onOrderCreated();
    } catch (error: any) {
      console.error('❌ 创建订单错误:', error);
      setErrors({ general: error.message || '创建订单失败，请重试' });
    } finally {
      setIsLoading(false);
      console.log('🏁 表单提交结束');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0, color: '#1f2937' }}>预约接机服务</h1>
            <button
              onClick={onCancel}
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

          <form onSubmit={handleSubmit}>
            {/* 客户信息 */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                客户信息
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    姓名 *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.customerName ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="请输入您的姓名"
                  />
                  {errors.customerName && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    联系电话 *
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.customerPhone ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="+41 79 123 4567"
                  />
                  {errors.customerPhone && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.customerPhone}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    邮箱地址 *
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.customerEmail ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="your.email@example.com"
                  />
                  {errors.customerEmail && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.customerEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 行程信息 */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                行程信息
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    📍 接机地址 *
                  </label>
                  <input
                    type="text"
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.pickupAddress ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="例如：苏黎世机场 1号航站楼"
                  />
                  {errors.pickupAddress && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.pickupAddress}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    🏁 目的地地址 *
                  </label>
                  <input
                    type="text"
                    value={formData.destinationAddress}
                    onChange={(e) => handleInputChange('destinationAddress', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.destinationAddress ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="例如：班霍夫大街 1号"
                  />
                  {errors.destinationAddress && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.destinationAddress}</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    🕐 接机时间 *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.pickupDateTime}
                    onChange={(e) => handleInputChange('pickupDateTime', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.pickupDateTime ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {errors.pickupDateTime && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.pickupDateTime}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    👥 乘客数量 *
                  </label>
                  <select
                    value={formData.passengerCount}
                    onChange={(e) => handleInputChange('passengerCount', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: errors.passengerCount ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}人</option>
                    ))}
                  </select>
                  {errors.passengerCount && (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.passengerCount}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    🧳 行李数量
                  </label>
                  <select
                    value={formData.luggageCount}
                    onChange={(e) => handleInputChange('luggageCount', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}件</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 航班信息（可选） */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                航班信息（可选）
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    ✈️ 航班号
                  </label>
                  <input
                    type="text"
                    value={formData.flightNumber}
                    onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="例如：LX 1234"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                    航空公司
                  </label>
                  <input
                    type="text"
                    value={formData.airline}
                    onChange={(e) => handleInputChange('airline', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                    placeholder="例如：瑞士国际航空"
                  />
                </div>
              </div>
            </div>

            {/* 特殊要求和备注 */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                特殊要求和备注
              </h2>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  特殊要求
                </label>
                <input
                  type="text"
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                  placeholder="例如：需要儿童座椅、轮椅无障碍等"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  💬 备注信息
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="其他需要说明的信息..."
                />
              </div>
            </div>

            {/* 通用错误信息 */}
            {errors.general && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}>
                {errors.general}
              </div>
            )}

            {/* 提交按钮 */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {isLoading ? '提交中...' : '提交订单'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}