# 多阶段构建 - 前端构建阶段
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# 复制前端依赖文件
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY index.html ./

# 安装前端依赖
RUN npm ci

# 复制前端源码
COPY src/ ./src/
COPY public/ ./public/

# 构建前端
RUN npm run build

# 后端运行阶段
FROM node:18-alpine AS production
WORKDIR /app

# 安装后端依赖
COPY server/package*.json ./
RUN npm ci --only=production

# 复制后端源码
COPY server/ ./

# 从前端构建阶段复制构建产物
COPY --from=frontend-build /app/frontend/dist ./public

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "server.js"]
