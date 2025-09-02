# EasyMove Zurich - 苏黎世接机服务平台

一个现代化的React接机预约平台，为客户和司机提供便捷的接机服务管理。

## 🚀 功能特性

### 客户端功能
- 📝 **预约接机服务** - 填写详细的接机需求表单
- 📋 **订单管理** - 查看所有订单状态和详情
- 🔍 **订单搜索和筛选** - 快速找到特定订单
- 📱 **响应式设计** - 支持手机、平板和桌面设备
- ✈️ **航班信息** - 可选填写航班号和航空公司
- 👥 **乘客和行李管理** - 指定乘客数量和行李件数

### 司机端功能
- 🚗 **司机仪表板** - 查看收入、完成订单等统计信息
- 📋 **可接订单列表** - 浏览所有待接单的订单
- ✅ **一键接单** - 快速接受订单
- 📊 **订单状态管理** - 更新订单进度（进行中、已完成）
- 🔄 **在线状态切换** - 控制是否接收新订单
- 🚙 **车辆信息展示** - 显示车辆详细信息

### 通用功能
- 🔐 **用户认证** - 区分客户和司机角色
- 🎨 **现代化UI** - 使用Tailwind CSS设计
- 📱 **移动端优化** - 完全响应式设计
- 🔄 **实时状态更新** - 订单状态实时同步
- 🌍 **多语言支持** - 中文界面

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **路由**: React Router DOM
- **状态管理**: React Context + useReducer
- **图标**: Lucide React
- **日期处理**: date-fns
- **唯一ID**: UUID

## 📦 安装和运行

### 环境要求
- Node.js 20.19+ 或 22.12+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/zihanltesla/EasyMoveZurich.git
   cd EasyMoveZurich
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   访问 http://localhost:5173 (或显示的端口)

## 🎯 使用指南

### 快速体验

应用提供了演示账户，可以快速体验不同角色的功能：

**客户演示账户**
- 邮箱: customer@example.com
- 密码: password123

**司机演示账户**
- 邮箱: hans.mueller@email.com
- 密码: password123

### 客户使用流程

1. **登录** - 选择"客户"身份登录
2. **预约接机** - 点击"预约接机"按钮
3. **填写信息** - 完整填写接机需求表单
4. **提交订单** - 确认信息后提交
5. **等待接单** - 司机会看到并接受订单
6. **跟踪进度** - 在订单列表中查看状态更新

### 司机使用流程

1. **登录** - 选择"司机"身份登录
2. **查看可接订单** - 浏览待接单列表
3. **接受订单** - 点击"接受订单"按钮
4. **开始服务** - 更新订单状态为"进行中"
5. **完成服务** - 标记订单为"已完成"

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── CreateOrderForm.tsx    # 创建订单表单
│   ├── CustomerDashboard.tsx  # 客户仪表板
│   ├── DriverDashboard.tsx    # 司机仪表板
│   ├── LoginForm.tsx          # 登录表单
│   ├── OrderCard.tsx          # 订单卡片
│   └── OrderList.tsx          # 订单列表
├── context/             # React Context
│   └── AppContext.tsx         # 应用状态管理
├── types/               # TypeScript类型定义
│   └── index.ts               # 所有类型定义
├── utils/               # 工具函数
│   └── mockData.ts            # 模拟数据和工具函数
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🎨 设计特色

- **现代化界面** - 简洁美观的Material Design风格
- **响应式布局** - 适配各种屏幕尺寸
- **直观的用户体验** - 清晰的信息层次和操作流程
- **状态可视化** - 不同颜色表示订单状态
- **交互反馈** - 悬停效果和动画过渡

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 📝 待实现功能

- [ ] 真实的用户认证系统
- [ ] 后端API集成
- [ ] 地图集成（Google Maps/OpenStreetMap）
- [ ] 实时位置跟踪
- [ ] 推送通知
- [ ] 支付集成
- [ ] 评价系统
- [ ] 多语言支持
- [ ] 单元测试
- [ ] E2E测试

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**Zihan Liu** - [zihanltesla](https://github.com/zihanltesla)

## 🙏 致谢

- React团队提供的优秀框架
- Tailwind CSS的美观样式系统
- Lucide提供的精美图标
- 所有开源贡献者的努力

---

**EasyMove Zurich** - 让接机服务变得简单高效 🚗✈️
