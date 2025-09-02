const API_BASE_URL = 'http://localhost:3001/api';

// API响应类型
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'driver';
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
}

// 获取存储的token
const getToken = (): string | null => {
  return localStorage.getItem('easymove_token');
};

// 设置token
const setToken = (token: string): void => {
  localStorage.setItem('easymove_token', token);
};

// 移除token
const removeToken = (): void => {
  localStorage.removeItem('easymove_token');
};

// 通用API请求函数
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API方法
export const api = {
  // 用户认证
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  logout: (): void => {
    removeToken();
  },

  // 用户资料
  getProfile: async () => {
    return apiRequest('/user/profile');
  },

  updateProfile: async (profileData: UpdateProfileRequest) => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // 获取所有用户（管理功能）
  getAllUsers: async () => {
    return apiRequest('/users');
  },

  // 健康检查
  healthCheck: async () => {
    return apiRequest('/health');
  },

  // Token管理
  getStoredToken: getToken,
  setStoredToken: setToken,
  removeStoredToken: removeToken,
};
