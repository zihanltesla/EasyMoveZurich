const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 中间件
app.use(cors());
app.use(express.json());

// 数据库初始化
const dbPath = path.join(__dirname, 'easymove.db');
const db = new sqlite3.Database(dbPath);

// 创建用户表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('customer', 'driver')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建司机额外信息表
  db.run(`
    CREATE TABLE IF NOT EXISTS driver_info (
      user_id TEXT PRIMARY KEY,
      license_number TEXT,
      vehicle_make TEXT,
      vehicle_model TEXT,
      vehicle_year INTEGER,
      vehicle_color TEXT,
      vehicle_plate TEXT,
      vehicle_capacity INTEGER,
      rating REAL DEFAULT 5.0,
      total_trips INTEGER DEFAULT 0,
      is_available BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 插入一些示例数据
  const sampleUsers = [
    {
      id: uuidv4(),
      name: 'Demo Customer',
      email: 'customer@example.com',
      phone: '+41 79 123 4567',
      password: bcrypt.hashSync('password123', 10),
      role: 'customer'
    },
    {
      id: uuidv4(),
      name: 'Hans Mueller',
      email: 'hans.mueller@example.com',
      phone: '+41 79 234 5678',
      password: bcrypt.hashSync('password123', 10),
      role: 'driver'
    }
  ];

  sampleUsers.forEach(user => {
    db.run(`
      INSERT OR IGNORE INTO users (id, name, email, phone, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [user.id, user.name, user.email, user.phone, user.password, user.role]);

    if (user.role === 'driver') {
      db.run(`
        INSERT OR IGNORE INTO driver_info (user_id, license_number, vehicle_make, vehicle_model, vehicle_year, vehicle_color, vehicle_plate, vehicle_capacity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [user.id, 'CH-12345678', 'Mercedes-Benz', 'E-Class', 2022, 'Black', 'ZH 123456', 4]);
    }
  });
});

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

    // 验证必填字段
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 验证角色
    if (!['customer', 'driver'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // 检查邮箱是否已存在
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // 创建新用户
      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(`
        INSERT INTO users (id, name, email, phone, password, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, name, email, phone, hashedPassword, role], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // 如果是司机，创建司机信息记录
        if (role === 'driver') {
          db.run(`
            INSERT INTO driver_info (user_id)
            VALUES (?)
          `, [userId]);
        }

        // 生成JWT token
        const token = jwt.sign(
          { userId, email, role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: userId,
            name,
            email,
            phone,
            role
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 用户登录
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // 生成JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取用户信息
app.get('/api/user/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  });
});

// 更新用户信息
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.userId;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    db.run(`
      UPDATE users 
      SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, phone, userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取所有用户（管理员功能）
app.get('/api/users', authenticateToken, (req, res) => {
  db.all(`
    SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
           d.license_number, d.vehicle_make, d.vehicle_model, d.rating, d.total_trips, d.is_available
    FROM users u
    LEFT JOIN driver_info d ON u.id = d.user_id
    ORDER BY u.created_at DESC
  `, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ users });
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EasyMove Server is running' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 EasyMove Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('📦 Database connection closed.');
    }
    process.exit(0);
  });
});
