#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始部署构建...');

try {
  // 1. 安装前端依赖
  console.log('📦 安装前端依赖...');
  execSync('npm ci', { stdio: 'inherit' });

  // 2. 构建前端（跳过TypeScript检查）
  console.log('🔨 构建前端应用...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });

  // 3. 安装后端依赖
  console.log('📦 安装后端依赖...');
  execSync('cd server && npm ci --production', { stdio: 'inherit' });

  // 4. 复制构建产物到服务器
  console.log('📁 复制构建产物...');
  if (fs.existsSync('server/public')) {
    execSync('rm -rf server/public', { stdio: 'inherit' });
  }
  execSync('cp -r dist server/public', { stdio: 'inherit' });

  console.log('✅ 部署构建完成！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
