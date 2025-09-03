import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface AuthFormProps {
  onLogin: (user: any) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [userRole, setUserRole] = useState<'customer' | 'driver'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 检查Google登录回调
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    const authError = urlParams.get('error');

    if (authError) {
      setErrors({ general: 'Google登录失败，请重试' });
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        onLogin(user);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('解析Google登录数据失败:', error);
        setErrors({ general: '登录数据解析失败' });
      }
    }
  }, [onLogin]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.password.trim()) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = '请输入姓名';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = '请输入电话号码';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '密码确认不匹配';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // 登录
        const response = await api.login(formData.email, formData.password);
        onLogin(response.user);
      } else {
        // 注册
        const response = await api.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: userRole
        });
        onLogin(response.user);
      }
    } catch (error: any) {
      setErrors({ general: error.message || '操作失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'driver') => {
    setIsLoading(true);
    try {
      const email = role === 'customer' ? 'customer@example.com' : 'hans.mueller@example.com';
      const response = await api.login(email, 'password123');
      onLogin(response.user);
    } catch (error: any) {
      setErrors({ general: error.message || '演示登录失败' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif',
      padding: '1rem'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>EasyMove Zurich</h1>
          <p style={{ color: '#6b7280' }}>苏黎世接机服务平台</p>
        </div>

        {/* 切换登录/注册 */}
        <div style={{ display: 'flex', marginBottom: '2rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem' }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '0.25rem',
              backgroundColor: isLogin ? 'white' : 'transparent',
              color: isLogin ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              fontWeight: isLogin ? '500' : 'normal'
            }}
          >
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '0.25rem',
              backgroundColor: !isLogin ? 'white' : 'transparent',
              color: !isLogin ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              fontWeight: !isLogin ? '500' : 'normal'
            }}
          >
            注册
          </button>
        </div>

        {/* 角色选择（仅注册时显示） */}
        {!isLogin && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              选择身份
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setUserRole('customer')}
                style={{
                  padding: '0.75rem',
                  border: userRole === 'customer' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: userRole === 'customer' ? '#eff6ff' : 'white',
                  cursor: 'pointer'
                }}
              >
                👤 客户
              </button>
              <button
                type="button"
                onClick={() => setUserRole('driver')}
                style={{
                  padding: '0.75rem',
                  border: userRole === 'driver' ? '2px solid #2563eb' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: userRole === 'driver' ? '#eff6ff' : 'white',
                  cursor: 'pointer'
                }}
              >
                🚗 司机
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* 姓名（仅注册时显示） */}
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="请输入您的姓名"
              />
              {errors.name && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</p>
              )}
            </div>
          )}

          {/* 邮箱 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              邮箱地址 *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.email}</p>
            )}
          </div>

          {/* 电话（仅注册时显示） */}
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                电话号码 *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="+41 79 123 4567"
              />
              {errors.phone && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.phone}</p>
              )}
            </div>
          )}

          {/* 密码 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              密码 *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              placeholder="请输入密码"
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.password}</p>
            )}
          </div>

          {/* 确认密码（仅注册时显示） */}
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                确认密码 *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="请再次输入密码"
              />
              {errors.confirmPassword && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* 通用错误信息 */}
          {errors.general && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#dc2626', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        {/* Google登录 */}
        {isLogin && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              <span style={{ padding: '0 1rem', color: '#6b7280', fontSize: '0.875rem' }}>或</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = api.getGoogleAuthUrl()}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#374151',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 登录
            </button>
          </div>
        )}

        {/* 演示登录 */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginBottom: '1rem' }}>
            快速体验演示
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => handleDemoLogin('customer')}
              disabled={isLoading}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              👤 客户演示
            </button>
            <button
              onClick={() => handleDemoLogin('driver')}
              disabled={isLoading}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🚗 司机演示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
