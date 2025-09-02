import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, ActionType, PickupOrder, User, Driver } from '../types';

// 初始状态
const initialState: AppState = {
  currentUser: null,
  orders: [],
  drivers: [],
  isLoading: false,
  error: null
};

// Reducer函数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case ActionType.SET_USER:
      return {
        ...state,
        currentUser: action.payload
      };
    
    case ActionType.SET_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    
    case ActionType.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
    case ActionType.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order
        )
      };
    
    case ActionType.SET_DRIVERS:
      return {
        ...state,
        drivers: action.payload
      };
    
    case ActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case ActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

// Context类型
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // 便捷方法
  setUser: (user: User | null) => void;
  addOrder: (order: PickupOrder) => void;
  updateOrder: (id: string, updates: Partial<PickupOrder>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

// 创建Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 便捷方法
  const setUser = (user: User | null) => {
    dispatch({ type: ActionType.SET_USER, payload: user });
  };

  const addOrder = (order: PickupOrder) => {
    dispatch({ type: ActionType.ADD_ORDER, payload: order });
  };

  const updateOrder = (id: string, updates: Partial<PickupOrder>) => {
    dispatch({ type: ActionType.UPDATE_ORDER, payload: { id, updates } });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: ActionType.SET_LOADING, payload: loading });
  };

  const setError = (error: string) => {
    dispatch({ type: ActionType.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionType.CLEAR_ERROR });
  };

  const value: AppContextType = {
    state,
    dispatch,
    setUser,
    addOrder,
    updateOrder,
    setLoading,
    setError,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// 导出Context以供测试使用
export { AppContext };
