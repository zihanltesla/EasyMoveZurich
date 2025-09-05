import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useTranslation } from '../i18n/i18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AuthFormProps {
  onLogin: (user: any) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const { t } = useTranslation();
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
      setErrors({ general: t.validation.loginFailed });
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
        console.error('Google login data parsing failed:', error);
        setErrors({ general: t.validation.serverError });
      }
    }
  }, [onLogin, t.validation.loginFailed, t.validation.serverError]);

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
      newErrors.email = t.validation.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.validation.invalidEmail;
    }

    if (!formData.password.trim()) {
      newErrors.password = t.validation.required;
    } else if (formData.password.length < 6) {
      newErrors.password = t.validation.minLength;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = t.validation.required;
      }

      if (!formData.phone.trim()) {
        newErrors.phone = t.validation.required;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t.validation.passwordMismatch;
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
        // Login
        const response = await api.login(formData.email, formData.password);
        onLogin(response.user);
      } else {
        // Register
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
      setErrors({ general: error.message || t.validation.serverError });
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
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      fontFamily: 'Arial, sans-serif',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 动态背景元素 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* 科技感几何元素 */}
      {/* 六边形网格 */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        animation: 'rotate 30s linear infinite'
      }} />

      {/* 旋转的三角形 */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        animation: 'rotate 20s linear infinite reverse'
      }} />

      {/* 科技线条 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '8%',
        width: '150px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        animation: 'pulse 3s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '12%',
        width: '100px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.8), transparent)',
        animation: 'pulse 3s ease-in-out infinite 1s'
      }} />

      {/* 方形网格 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '60px',
        height: '60px',
        border: '2px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.05)',
        transform: 'rotate(45deg)',
        animation: 'float 15s ease-in-out infinite'
      }} />

      {/* 小粒子效果 */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '20%',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.8)',
        animation: 'twinkle 2s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '25%',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        background: 'rgba(102, 126, 234, 0.9)',
        animation: 'twinkle 2.5s ease-in-out infinite 0.5s'
      }} />
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '80%',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: 'rgba(118, 75, 162, 0.8)',
        animation: 'twinkle 3s ease-in-out infinite 1s'
      }} />

      {/* 数字雨效果线条 */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '25%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'slideDown 8s linear infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '0',
        right: '30%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(180deg, transparent, rgba(102, 126, 234, 0.4), transparent)',
        animation: 'slideDown 10s linear infinite 2s'
      }} />

      {/* 电路板风格连接线 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '0',
        width: '200px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(102, 126, 234, 0.6), transparent)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '180px',
        width: '1px',
        height: '80px',
        background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.6), transparent)',
        animation: 'pulse 4s ease-in-out infinite 0.5s'
      }} />

      {/* 科技感圆环 */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.2)',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        animation: 'rotate 25s linear infinite'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60px',
          height: '60px',
          marginTop: '-30px',
          marginLeft: '-30px',
          borderRadius: '50%',
          border: '1px solid rgba(102, 126, 234, 0.4)',
          animation: 'rotate 15s linear infinite reverse'
        }} />
      </div>

      {/* 数据流动效果 */}
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '5%',
        width: '100px',
        height: '20px',
        background: 'linear-gradient(90deg, transparent, rgba(118, 75, 162, 0.3), rgba(102, 126, 234, 0.5), transparent)',
        borderRadius: '10px',
        animation: 'pulse 2s ease-in-out infinite'
      }} />

      {/* 语言切换器 */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        zIndex: 20
      }}>
        <LanguageSwitcher />
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(30px) rotate(240deg); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
          50% { opacity: 1; transform: scaleX(1.2); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes slideDown {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes matrixRain {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100vh + 100px)); opacity: 0; }
        }
      `}</style>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        maxWidth: '420px',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>🚗</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            {t.app.title}
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            {t.app.subtitle}
          </p>
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
            {t.auth.login}
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
            {t.auth.register}
          </button>
        </div>

        {/* Role selection (only shown during registration) */}
        {!isLogin && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              {t.auth.role}
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
                👤 {t.auth.customer}
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
                🚗 {t.auth.driver}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {/* Name (only shown during registration) */}
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {t.auth.name} *
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
                placeholder={t.placeholders.name}
              />
              {errors.name && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              {t.auth.email} *
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
              placeholder={t.placeholders.email}
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.email}</p>
            )}
          </div>

          {/* Phone (only shown during registration) */}
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {t.auth.phone} *
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
                placeholder={t.placeholders.phone}
              />
              {errors.phone && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.phone}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              {t.auth.password} *
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
              placeholder={t.placeholders.password}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (only shown during registration) */}
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {t.auth.confirmPassword} *
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
                placeholder={t.placeholders.password}
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
            {isLoading ? t.common.loading : (isLogin ? t.auth.login : t.auth.register)}
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#374151',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t.auth.googleLogin}
            </button>
          </div>
        )}

        {/* 切换登录/注册 */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {isLogin ? t.auth.noAccount : t.auth.alreadyHaveAccount}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginLeft: '0.25rem',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? t.auth.registerNow : t.auth.loginNow}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
