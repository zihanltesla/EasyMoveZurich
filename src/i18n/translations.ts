export interface Translations {
  // 通用
  common: {
    loading: string;
    submit: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    save: string;
    edit: string;
    delete: string;
    search: string;
    filter: string;
    clear: string;
    close: string;
    yes: string;
    no: string;
  };

  // 认证相关
  auth: {
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    role: string;
    customer: string;
    driver: string;
    loginTitle: string;
    registerTitle: string;
    welcomeBack: string;
    createAccount: string;
    googleLogin: string;
    alreadyHaveAccount: string;
    noAccount: string;
    loginNow: string;
    registerNow: string;
    forgotPassword: string;
  };

  // 应用标题和描述
  app: {
    title: string;
    subtitle: string;
    description: string;
    welcome: string;
  };

  // 导航和菜单
  nav: {
    dashboard: string;
    profile: string;
    orders: string;
    createOrder: string;
    driverDashboard: string;
    myOrders: string;
    availableOrders: string;
  };

  // 订单相关
  order: {
    createOrder: string;
    orderDetails: string;
    customerInfo: string;
    tripInfo: string;
    pickupAddress: string;
    destinationAddress: string;
    pickupTime: string;
    passengerCount: string;
    luggageCount: string;
    flightInfo: string;
    flightNumber: string;
    airline: string;
    specialRequirements: string;
    notes: string;
    estimatedPrice: string;
    finalPrice: string;
    status: string;
    pending: string;
    accepted: string;
    inProgress: string;
    completed: string;
    cancelled: string;
    acceptOrder: string;
    updateStatus: string;
  };

  // 司机相关
  driver: {
    driverDashboard: string;
    totalOrders: string;
    completionRate: string;
    monthlyEarnings: string;
    driverRating: string;
    availability: string;
    available: string;
    unavailable: string;
    viewAvailableOrders: string;
    recentOrders: string;
    vehicleInfo: string;
    driverStats: string;
  };

  // 表单验证和错误信息
  validation: {
    required: string;
    invalidEmail: string;
    passwordMismatch: string;
    minLength: string;
    invalidPhone: string;
    futureTime: string;
    serverError: string;
    loginFailed: string;
    registerFailed: string;
  };

  // 成功消息
  success: {
    loginSuccess: string;
    registerSuccess: string;
    orderCreated: string;
    orderAccepted: string;
    statusUpdated: string;
    profileUpdated: string;
  };

  // 占位符文本
  placeholders: {
    email: string;
    password: string;
    name: string;
    phone: string;
    pickupAddress: string;
    destinationAddress: string;
    flightNumber: string;
    airline: string;
    specialRequirements: string;
    notes: string;
  };
}

export const zhTranslations: Translations = {
  common: {
    loading: '加载中...',
    submit: '提交',
    cancel: '取消',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    search: '搜索',
    filter: '筛选',
    clear: '清除',
    close: '关闭',
    yes: '是',
    no: '否',
  },

  auth: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    email: '邮箱地址',
    password: '密码',
    confirmPassword: '确认密码',
    name: '姓名',
    phone: '电话号码',
    role: '角色',
    customer: '客户',
    driver: '司机',
    loginTitle: '登录',
    registerTitle: '注册',
    welcomeBack: '欢迎回来！请登录您的账户',
    createAccount: '创建您的新账户',
    googleLogin: '使用 Google 登录',
    alreadyHaveAccount: '已有账户？',
    noAccount: '还没有账户？',
    loginNow: '立即登录',
    registerNow: '立即注册',
    forgotPassword: '忘记密码？',
  },

  app: {
    title: 'EasyMove Zurich',
    subtitle: '苏黎世专业接机服务平台',
    description: '连接乘客与司机的智能预约系统',
    welcome: '欢迎使用',
  },

  nav: {
    dashboard: '控制台',
    profile: '个人资料',
    orders: '订单管理',
    createOrder: '预约接机',
    driverDashboard: '司机控制台',
    myOrders: '我的订单',
    availableOrders: '可接订单',
  },

  order: {
    createOrder: '创建订单',
    orderDetails: '订单详情',
    customerInfo: '客户信息',
    tripInfo: '行程信息',
    pickupAddress: '接机地址',
    destinationAddress: '目的地地址',
    pickupTime: '接机时间',
    passengerCount: '乘客数量',
    luggageCount: '行李数量',
    flightInfo: '航班信息',
    flightNumber: '航班号',
    airline: '航空公司',
    specialRequirements: '特殊要求',
    notes: '备注信息',
    estimatedPrice: '预估价格',
    finalPrice: '最终价格',
    status: '状态',
    pending: '待接单',
    accepted: '已接单',
    inProgress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    acceptOrder: '接受订单',
    updateStatus: '更新状态',
  },

  driver: {
    driverDashboard: '司机控制台',
    totalOrders: '总订单数',
    completionRate: '完成率',
    monthlyEarnings: '本月收入',
    driverRating: '司机评分',
    availability: '接单状态',
    available: '可接单',
    unavailable: '暂停中',
    viewAvailableOrders: '查看可接订单',
    recentOrders: '最近订单',
    vehicleInfo: '车辆信息',
    driverStats: '司机统计',
  },

  validation: {
    required: '此字段为必填项',
    invalidEmail: '请输入有效的邮箱地址',
    passwordMismatch: '密码不匹配',
    minLength: '密码至少需要6个字符',
    invalidPhone: '请输入有效的电话号码',
    futureTime: '接机时间必须是未来时间',
    serverError: '服务器错误，请重试',
    loginFailed: '登录失败',
    registerFailed: '注册失败',
  },

  success: {
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    orderCreated: '订单创建成功',
    orderAccepted: '订单接受成功',
    statusUpdated: '状态更新成功',
    profileUpdated: '资料更新成功',
  },

  placeholders: {
    email: 'your@example.com',
    password: '请输入密码',
    name: '请输入姓名',
    phone: '+41 79 123 4567',
    pickupAddress: '例如：苏黎世机场 1号航站楼',
    destinationAddress: '例如：班霍夫大街 1号',
    flightNumber: '例如：LX 1234',
    airline: '例如：瑞士国际航空',
    specialRequirements: '例如：需要儿童座椅、轮椅无障碍等',
    notes: '其他需要说明的信息...',
  },
};

export const enTranslations: Translations = {
  common: {
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
  },

  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    phone: 'Phone Number',
    role: 'Role',
    customer: 'Customer',
    driver: 'Driver',
    loginTitle: 'Login',
    registerTitle: 'Register',
    welcomeBack: 'Welcome back! Please login to your account',
    createAccount: 'Create your new account',
    googleLogin: 'Sign in with Google',
    alreadyHaveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    loginNow: 'Login now',
    registerNow: 'Register now',
    forgotPassword: 'Forgot password?',
  },

  app: {
    title: 'EasyMove Zurich',
    subtitle: 'Professional Airport Transfer Service in Zurich',
    description: 'Smart booking system connecting passengers with drivers',
    welcome: 'Welcome to',
  },

  nav: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    orders: 'Orders',
    createOrder: 'Book Transfer',
    driverDashboard: 'Driver Dashboard',
    myOrders: 'My Orders',
    availableOrders: 'Available Orders',
  },

  order: {
    createOrder: 'Create Order',
    orderDetails: 'Order Details',
    customerInfo: 'Customer Information',
    tripInfo: 'Trip Information',
    pickupAddress: 'Pickup Address',
    destinationAddress: 'Destination Address',
    pickupTime: 'Pickup Time',
    passengerCount: 'Number of Passengers',
    luggageCount: 'Number of Luggage',
    flightInfo: 'Flight Information',
    flightNumber: 'Flight Number',
    airline: 'Airline',
    specialRequirements: 'Special Requirements',
    notes: 'Additional Notes',
    estimatedPrice: 'Estimated Price',
    finalPrice: 'Final Price',
    status: 'Status',
    pending: 'Pending',
    accepted: 'Accepted',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    acceptOrder: 'Accept Order',
    updateStatus: 'Update Status',
  },

  driver: {
    driverDashboard: 'Driver Dashboard',
    totalOrders: 'Total Orders',
    completionRate: 'Completion Rate',
    monthlyEarnings: 'Monthly Earnings',
    driverRating: 'Driver Rating',
    availability: 'Availability Status',
    available: 'Available',
    unavailable: 'Unavailable',
    viewAvailableOrders: 'View Available Orders',
    recentOrders: 'Recent Orders',
    vehicleInfo: 'Vehicle Information',
    driverStats: 'Driver Statistics',
  },

  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordMismatch: 'Passwords do not match',
    minLength: 'Password must be at least 6 characters',
    invalidPhone: 'Please enter a valid phone number',
    futureTime: 'Pickup time must be in the future',
    serverError: 'Server error, please try again',
    loginFailed: 'Login failed',
    registerFailed: 'Registration failed',
  },

  success: {
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    orderCreated: 'Order created successfully',
    orderAccepted: 'Order accepted successfully',
    statusUpdated: 'Status updated successfully',
    profileUpdated: 'Profile updated successfully',
  },

  placeholders: {
    email: 'your@example.com',
    password: 'Enter your password',
    name: 'Enter your full name',
    phone: '+41 79 123 4567',
    pickupAddress: 'e.g., Zurich Airport Terminal 1',
    destinationAddress: 'e.g., Bahnhofstrasse 1',
    flightNumber: 'e.g., LX 1234',
    airline: 'e.g., Swiss International Air Lines',
    specialRequirements: 'e.g., Child seat, wheelchair accessible, etc.',
    notes: 'Any additional information...',
  },
};

export const deTranslations: Translations = {
  common: {
    loading: 'Laden...',
    submit: 'Senden',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    back: 'Zurück',
    next: 'Weiter',
    save: 'Speichern',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    search: 'Suchen',
    filter: 'Filtern',
    clear: 'Löschen',
    close: 'Schließen',
    yes: 'Ja',
    no: 'Nein',
  },

  auth: {
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    name: 'Vollständiger Name',
    phone: 'Telefonnummer',
    role: 'Rolle',
    customer: 'Kunde',
    driver: 'Fahrer',
    loginTitle: 'Anmelden',
    registerTitle: 'Registrieren',
    welcomeBack: 'Willkommen zurück! Bitte melden Sie sich in Ihrem Konto an',
    createAccount: 'Erstellen Sie Ihr neues Konto',
    googleLogin: 'Mit Google anmelden',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    noAccount: 'Haben Sie noch kein Konto?',
    loginNow: 'Jetzt anmelden',
    registerNow: 'Jetzt registrieren',
    forgotPassword: 'Passwort vergessen?',
  },

  app: {
    title: 'EasyMove Zurich',
    subtitle: 'Professioneller Flughafentransfer-Service in Zürich',
    description: 'Intelligentes Buchungssystem, das Passagiere mit Fahrern verbindet',
    welcome: 'Willkommen bei',
  },

  nav: {
    dashboard: 'Dashboard',
    profile: 'Profil',
    orders: 'Bestellungen',
    createOrder: 'Transfer buchen',
    driverDashboard: 'Fahrer-Dashboard',
    myOrders: 'Meine Bestellungen',
    availableOrders: 'Verfügbare Bestellungen',
  },

  order: {
    createOrder: 'Bestellung erstellen',
    orderDetails: 'Bestelldetails',
    customerInfo: 'Kundeninformationen',
    tripInfo: 'Reiseinformationen',
    pickupAddress: 'Abholadresse',
    destinationAddress: 'Zieladresse',
    pickupTime: 'Abholzeit',
    passengerCount: 'Anzahl Passagiere',
    luggageCount: 'Anzahl Gepäckstücke',
    flightInfo: 'Fluginformationen',
    flightNumber: 'Flugnummer',
    airline: 'Fluggesellschaft',
    specialRequirements: 'Besondere Anforderungen',
    notes: 'Zusätzliche Notizen',
    estimatedPrice: 'Geschätzter Preis',
    finalPrice: 'Endpreis',
    status: 'Status',
    pending: 'Ausstehend',
    accepted: 'Angenommen',
    inProgress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    acceptOrder: 'Bestellung annehmen',
    updateStatus: 'Status aktualisieren',
  },

  driver: {
    driverDashboard: 'Fahrer-Dashboard',
    totalOrders: 'Gesamtbestellungen',
    completionRate: 'Abschlussrate',
    monthlyEarnings: 'Monatliche Einnahmen',
    driverRating: 'Fahrerbewertung',
    availability: 'Verfügbarkeitsstatus',
    available: 'Verfügbar',
    unavailable: 'Nicht verfügbar',
    viewAvailableOrders: 'Verfügbare Bestellungen anzeigen',
    recentOrders: 'Aktuelle Bestellungen',
    vehicleInfo: 'Fahrzeuginformationen',
    driverStats: 'Fahrerstatistiken',
  },

  validation: {
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    minLength: 'Passwort muss mindestens 6 Zeichen lang sein',
    invalidPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
    futureTime: 'Abholzeit muss in der Zukunft liegen',
    serverError: 'Serverfehler, bitte versuchen Sie es erneut',
    loginFailed: 'Anmeldung fehlgeschlagen',
    registerFailed: 'Registrierung fehlgeschlagen',
  },

  success: {
    loginSuccess: 'Anmeldung erfolgreich',
    registerSuccess: 'Registrierung erfolgreich',
    orderCreated: 'Bestellung erfolgreich erstellt',
    orderAccepted: 'Bestellung erfolgreich angenommen',
    statusUpdated: 'Status erfolgreich aktualisiert',
    profileUpdated: 'Profil erfolgreich aktualisiert',
  },

  placeholders: {
    email: 'ihre@beispiel.com',
    password: 'Geben Sie Ihr Passwort ein',
    name: 'Geben Sie Ihren vollständigen Namen ein',
    phone: '+41 79 123 4567',
    pickupAddress: 'z.B. Flughafen Zürich Terminal 1',
    destinationAddress: 'z.B. Bahnhofstrasse 1',
    flightNumber: 'z.B. LX 1234',
    airline: 'z.B. Swiss International Air Lines',
    specialRequirements: 'z.B. Kindersitz, rollstuhlgerecht, etc.',
    notes: 'Weitere Informationen...',
  },
};
