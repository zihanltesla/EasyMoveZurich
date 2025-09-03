# 🚀 EasyMove Zurich 部署指南

## 📋 部署前准备

### 1. 确保代码已推送到GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. 环境变量准备
你需要以下环境变量：
- `MONGODB_URI`: MongoDB Atlas连接字符串
- `JWT_SECRET`: JWT密钥
- `PORT`: 端口号（默认3001）

---

## 🎯 方案1：Railway 部署（推荐）

### 步骤1：注册Railway
1. 访问 [railway.app](https://railway.app)
2. 使用GitHub账户登录

### 步骤2：创建项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的 `EasyMoveZurich` 仓库

### 步骤3：配置环境变量
在Railway项目设置中添加：
```
MONGODB_URI=mongodb+srv://liu3675716_db_user:zVzO66miyz8Vn88R@cluster0.f3wzcj3.mongodb.net/easymove?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
PORT=3001
```

### 步骤4：部署
Railway会自动检测并部署你的应用！

---

## 🎯 方案2：Render 部署

### 步骤1：注册Render
1. 访问 [render.com](https://render.com)
2. 使用GitHub账户登录

### 步骤2：创建Web Service
1. 点击 "New +" → "Web Service"
2. 连接你的GitHub仓库
3. 配置如下：
   - **Name**: easymove-zurich
   - **Environment**: Node
   - **Build Command**: `npm run build:production`
   - **Start Command**: `npm start`

### 步骤3：配置环境变量
添加环境变量：
```
MONGODB_URI=mongodb+srv://liu3675716_db_user:zVzO66miyz8Vn88R@cluster0.f3wzcj3.mongodb.net/easymove?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

---

## 🎯 方案3：Vercel + Railway 分离部署

### 前端部署到Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 导入GitHub仓库
3. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 后端部署到Railway
1. 在Railway创建新项目
2. 只部署 `server` 文件夹
3. 配置环境变量

---

## 🔧 本地测试生产构建

```bash
# 构建前端
npm run build

# 启动生产服务器
cd server
NODE_ENV=production npm start
```

---

## 📊 部署后验证

### 1. 检查健康状态
访问：`https://your-app-url.com/api/health`

### 2. 测试功能
- 用户注册/登录
- 创建订单
- 司机接单
- 数据库连接

### 3. 监控日志
在部署平台查看应用日志，确保没有错误。

---

## 🔒 安全建议

### 1. 更新JWT密钥
```bash
# 生成新的JWT密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. 配置CORS
在生产环境中限制CORS来源。

### 3. 环境变量安全
- 不要在代码中硬编码敏感信息
- 使用平台的环境变量功能

---

## 🚨 常见问题

### Q: 部署失败怎么办？
A: 检查构建日志，通常是依赖问题或环境变量配置错误。

### Q: 数据库连接失败？
A: 确认MongoDB Atlas的IP白名单设置为 `0.0.0.0/0`（允许所有IP）。

### Q: 前端无法连接后端？
A: 检查API基础URL配置，确保指向正确的后端地址。

---

## 📞 支持

如果遇到部署问题，请检查：
1. GitHub仓库是否公开
2. 环境变量是否正确配置
3. MongoDB Atlas是否允许外部连接
4. 构建日志中的错误信息
