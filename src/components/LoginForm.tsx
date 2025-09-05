import React, { useState } from 'react';
import { User, Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UserRole, User as UserType } from '../types';
import { useApp } from '../context/AppContext';
import { mockDrivers } from '../utils/mockData';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { setUser } = useApp();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 模拟用户数据
  const mockUsers = {
    [UserRole.CUSTOMER]: [
      {
        id: 'customer-1',
        name: 'John Smith',
        email: 'customer@example.com',
        phone: '+41 79 123 4567',
        role: UserRole.CUSTOMER,
        createdAt: new Date('2023-01-15')
      }
    ],
    [UserRole.DRIVER]: mockDrivers
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 模拟登录验证
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 查找用户
      const users = mockUsers[userRole];
      const user = users.find(u => u.email === email);

      if (!user) {
        setError('用户不存在或邮箱错误');
        return;
      }

      // 模拟密码验证（实际应用中应该进行安全的密码验证）
      if (password !== 'password123') {
        setError('密码错误');
        return;
      }

      // 登录成功
      setUser(user);
      onLogin(user);

    } catch (error) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = mockUsers[role][0];
    setUser(demoUser);
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo和标题 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            EasyMove Swiss
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            您的专业接机服务平台
          </p>
        </div>

        {/* 角色选择 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择登录身份
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserRole(UserRole.CUSTOMER)}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                  userRole === UserRole.CUSTOMER
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                客户
              </button>
              <button
                type="button"
                onClick={() => setUserRole(UserRole.DRIVER)}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                  userRole === UserRole.DRIVER
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Car className="w-5 h-5 mr-2" />
                司机
              </button>
            </div>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={userRole === UserRole.CUSTOMER ? "customer@example.com" : "hans.mueller@email.com"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="password123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 演示登录按钮 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              快速体验演示
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin(UserRole.CUSTOMER)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <User className="w-4 h-4 mr-2" />
                客户演示
              </button>
              <button
                onClick={() => handleDemoLogin(UserRole.DRIVER)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                <Car className="w-4 h-4 mr-2" />
                司机演示
              </button>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">演示账户信息：</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>客户：</strong> customer@example.com</p>
              <p><strong>司机：</strong> hans.mueller@email.com</p>
              <p><strong>密码：</strong> password123</p>
            </div>
          </div>
        </div>

        {/* 注册链接 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            还没有账户？{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
