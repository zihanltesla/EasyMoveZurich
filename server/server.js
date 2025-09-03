require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// 导入模型
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://zihan:uu3dBpT6Bfh5qZxX@cluster0.f3wzcj3.mongodb.net/?retryWrites=true&w=majority';

// Google OAuth配置
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174';

mongoose
  .connect(MONGODB_URI, { dbName: 'easymove' })
  .then(async () => {
    console.log('📦 Connected to MongoDB (easymove)');

    // 打印连接信息，确认角色和库名
    try {
      const status = await mongoose.connection.db.admin().command({
        connectionStatus: 1,
        showPrivileges: true,
      });
      console.log('🔐 Authenticated roles:', status?.authInfo?.authenticatedUserRoles);
      console.log('📚 Using DB:', mongoose.connection.db.databaseName);
    } catch (e) {
      console.warn('⚠️ Could not fetch connectionStatus:', e.message);
    }

    console.log('✅ Server ready - Data initialization skipped for now');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 中间件
app.use(cors({
  origin: [CLIENT_URL, 'https://easymovezurich-production.up.railway.app'],
  credentials: true
}));
app.use(express.json());

// Session配置
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// Passport初始化
app.use(passport.initialize());
app.use(passport.session());

// Passport序列化用户
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth策略
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Google OAuth profile:', profile.id, profile.displayName, profile.emails[0].value);

    // 检查用户是否已存在
    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    });

    if (user) {
      // 用户已存在，更新Google ID（如果没有的话）
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      console.log('✅ Existing user logged in:', user.email);
      return done(null, user);
    }

    // 创建新用户
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      phone: '', // Google不提供电话号码
      role: 'customer',
      isEmailVerified: true // Google账户默认已验证
    });

    await user.save();
    console.log('✅ New user created via Google:', user.email);
    done(null, user);
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    done(error, null);
  }
}));


// 初始化示例数据
async function initializeData() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Initializing sample data...');
      
      const customerPassword = await bcrypt.hash('password123', 10);
      const customer = new User({
        name: 'Demo Customer',
        email: 'customer@example.com',
        phone: '+41 79 123 4567',
        password: customerPassword,
        role: 'customer'
      });
      await customer.save();

      const driverPassword = await bcrypt.hash('password123', 10);
      const driver = new User({
        name: 'Hans Mueller',
        email: 'hans.mueller@example.com',
        phone: '+41 79 234 5678',
        password: driverPassword,
        role: 'driver',
        driverInfo: {
          licenseNumber: 'CH-12345678',
          vehicleMake: 'Mercedes-Benz',
          vehicleModel: 'E-Class',
          vehicleYear: 2022,
          vehicleColor: 'Black',
          vehiclePlate: 'ZH 123456',
          vehicleCapacity: 4,
          rating: 4.8,
          totalTrips: 100,
          isAvailable: true
        }
      });
      await driver.save();

      console.log('✅ Sample data initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
}

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// API路由

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['customer', 'driver'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role
    };

    if (role === 'driver') {
      userData.driverInfo = {
        licenseNumber: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: new Date().getFullYear(),
        vehicleColor: '',
        vehiclePlate: '',
        vehicleCapacity: 4,
        rating: 5.0,
        totalTrips: 0,
        isAvailable: true
      };
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth路由
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // 生成JWT token
      const token = jwt.sign(
        { userId: req.user._id, email: req.user.email, role: req.user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // 重定向到前端，带上token
      const redirectUrl = `${CLIENT_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }))}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google callback error:', error);
      res.redirect(`${CLIENT_URL}?error=auth_failed`);
    }
  }
);

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt received');
    console.log('Request body:', { email: req.body.email, hasPassword: !!req.body.password });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('🔍 Searching for user:', email);
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 获取用户信息
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 更新用户信息
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 创建新订单
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      pickupCity,
      pickupPostalCode,
      destinationAddress,
      destinationCity,
      destinationPostalCode,
      pickupDateTime,
      flightNumber,
      airline,
      passengerCount,
      luggageCount,
      specialRequirements,
      notes
    } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !pickupAddress || 
        !destinationAddress || !pickupDateTime || !passengerCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 计算预估价格
    const basePrice = 35;
    const distanceMultiplier = Math.random() * 0.5 + 0.8;
    const passengerMultiplier = passengerCount > 2 ? 1.2 : 1;
    const estimatedPrice = Math.round(basePrice * distanceMultiplier * passengerMultiplier);

    const order = new Order({
      customerId: req.user.userId,
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      pickupCity: pickupCity || 'Zurich',
      pickupPostalCode,
      destinationAddress,
      destinationCity: destinationCity || 'Zurich',
      destinationPostalCode,
      pickupDateTime: new Date(pickupDateTime),
      flightNumber,
      airline,
      passengerCount,
      luggageCount: luggageCount || 0,
      specialRequirements,
      notes,
      estimatedPrice
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        estimatedPrice: order.estimatedPrice,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取订单列表
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { status, role } = req.query;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let query = {};
    let sortOptions = { createdAt: -1 };

    // 根据用户角色过滤订单
    if (userRole === 'customer') {
      query.customerId = userId;
    } else if (userRole === 'driver') {
      if (status === 'available') {
        // 司机查看可接订单 - 只显示待接单且未分配司机的订单
        query.status = 'pending';
        query.driverId = null;
        // 按接机时间排序，最近的在前面
        sortOptions = { pickupDateTime: 1 };
      } else {
        // 司机查看自己的订单
        query.driverId = userId;
      }
    }

    // 状态过滤
    if (status && status !== 'available') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('driverId', 'name phone email driverInfo')
      .populate('customerId', 'name phone email')
      .sort(sortOptions);

    // 为司机添加额外的订单信息
    const enrichedOrders = orders.map(order => {
      const orderObj = order.toObject();

      // 计算距离接机时间
      if (orderObj.pickupDateTime) {
        const now = new Date();
        const pickupTime = new Date(orderObj.pickupDateTime);
        const timeDiff = pickupTime.getTime() - now.getTime();
        const hoursUntilPickup = Math.round(timeDiff / (1000 * 60 * 60));
        orderObj.hoursUntilPickup = hoursUntilPickup;
        orderObj.isUrgent = hoursUntilPickup <= 2 && hoursUntilPickup > 0;
      }

      return orderObj;
    });

    res.json({
      orders: enrichedOrders,
      totalCount: enrichedOrders.length,
      availableCount: userRole === 'driver' && status === 'available' ? enrichedOrders.length : undefined
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 接受订单（司机）
app.put('/api/orders/:id/accept', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const driverId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can accept orders' });
    }

    // 检查司机是否有其他进行中的订单
    const activeOrder = await Order.findOne({
      driverId,
      status: { $in: ['accepted', 'in_progress'] }
    });

    if (activeOrder) {
      return res.status(400).json({
        error: 'You already have an active order. Please complete it before accepting a new one.',
        activeOrderId: activeOrder._id
      });
    }

    // 获取司机信息
    const driver = await User.findById(driverId);
    if (!driver || !driver.driverInfo) {
      return res.status(400).json({ error: 'Driver profile incomplete. Please update your driver information.' });
    }

    // 检查司机是否可用
    if (!driver.driverInfo.isAvailable) {
      return res.status(400).json({ error: 'Driver is currently unavailable' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: 'pending', driverId: null },
      {
        driverId,
        status: 'accepted',
        acceptedAt: new Date()
      },
      { new: true }
    ).populate('customerId', 'name phone email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found or already accepted by another driver' });
    }

    // 更新司机的总接单数
    await User.findByIdAndUpdate(driverId, {
      $inc: { 'driverInfo.totalTrips': 1 }
    });

    // 返回完整的订单信息，包括客户信息
    const enrichedOrder = {
      ...order.toObject(),
      driverInfo: {
        name: driver.name,
        phone: driver.phone,
        vehicleMake: driver.driverInfo.vehicleMake,
        vehicleModel: driver.driverInfo.vehicleModel,
        vehicleColor: driver.driverInfo.vehicleColor,
        vehiclePlate: driver.driverInfo.vehiclePlate,
        rating: driver.driverInfo.rating
      }
    };

    res.json({
      message: 'Order accepted successfully',
      order: enrichedOrder,
      customerInfo: {
        name: order.customerId.name,
        phone: order.customerId.phone,
        email: order.customerId.email
      }
    });
  } catch (error) {
    console.error('Accept order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 更新订单状态
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user.userId;

    if (!['in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        $or: [
          { customerId: userId },
          { driverId: userId }
        ]
      },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 司机设置可用状态
app.put('/api/driver/availability', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.userId;
    const userRole = req.user.role;
    const { isAvailable } = req.body;

    if (userRole !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can update availability' });
    }

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'isAvailable must be a boolean value' });
    }

    // 如果设置为不可用，检查是否有进行中的订单
    if (!isAvailable) {
      const activeOrder = await Order.findOne({
        driverId,
        status: { $in: ['accepted', 'in_progress'] }
      });

      if (activeOrder) {
        return res.status(400).json({
          error: 'Cannot set unavailable while you have active orders',
          activeOrderId: activeOrder._id
        });
      }
    }

    const driver = await User.findByIdAndUpdate(
      driverId,
      { 'driverInfo.isAvailable': isAvailable },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({
      message: `Driver availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: driver.driverInfo.isAvailable
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取司机统计信息
app.get('/api/driver/stats', authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== 'driver') {
      return res.status(403).json({ error: 'Only drivers can access driver stats' });
    }

    // 获取司机信息
    const driver = await User.findById(driverId).select('-password');
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // 获取订单统计
    const totalOrders = await Order.countDocuments({ driverId });
    const completedOrders = await Order.countDocuments({ driverId, status: 'completed' });
    const activeOrders = await Order.countDocuments({
      driverId,
      status: { $in: ['accepted', 'in_progress'] }
    });

    // 计算本月收入（简化版本）
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.find({
      driverId,
      status: 'completed',
      completedAt: { $gte: startOfMonth }
    });

    const monthlyEarnings = monthlyOrders.reduce((total, order) => {
      return total + (order.finalPrice || order.estimatedPrice);
    }, 0);

    // 获取最近的订单
    const recentOrders = await Order.find({ driverId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'name');

    res.json({
      driverInfo: {
        name: driver.name,
        rating: driver.driverInfo.rating,
        totalTrips: driver.driverInfo.totalTrips,
        isAvailable: driver.driverInfo.isAvailable,
        vehicleInfo: {
          make: driver.driverInfo.vehicleMake,
          model: driver.driverInfo.vehicleModel,
          color: driver.driverInfo.vehicleColor,
          plate: driver.driverInfo.vehiclePlate
        }
      },
      stats: {
        totalOrders,
        completedOrders,
        activeOrders,
        completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
        monthlyEarnings: Math.round(monthlyEarnings),
        monthlyTrips: monthlyOrders.length
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        customerName: order.customerId?.name || order.customerName,
        pickupAddress: order.pickupAddress,
        destinationAddress: order.destinationAddress,
        status: order.status,
        price: order.finalPrice || order.estimatedPrice,
        date: order.createdAt
      }))
    });
  } catch (error) {
    console.error('Get driver stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取所有用户（管理员功能）
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EasyMove Server is running' });
});

// 生产环境下服务静态文件
if (process.env.NODE_ENV === 'production') {
  // 服务静态文件
  app.use(express.static(path.join(__dirname, 'public')));

  // 所有非API路由都返回index.html (SPA路由支持)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 EasyMove Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});
