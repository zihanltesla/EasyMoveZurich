#!/bin/bash

echo "🚀 EasyMove Zurich 部署脚本"
echo "=========================="

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  检测到未提交的更改，正在提交..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 推送到GitHub
echo "📤 推送代码到GitHub..."
git push origin main

echo "✅ 代码已推送到GitHub"
echo ""
echo "🎯 接下来请选择部署平台："
echo "1. Railway (推荐) - https://railway.app"
echo "2. Render - https://render.com"
echo "3. Vercel (仅前端) - https://vercel.com"
echo ""
echo "📋 环境变量配置："
echo "MONGODB_URI=mongodb+srv://liu3675716_db_user:zVzO66miyz8Vn88R@cluster0.f3wzcj3.mongodb.net/easymove?retryWrites=true&w=majority"
echo "JWT_SECRET=your-secret-key-change-in-production"
echo "NODE_ENV=production"
echo ""
echo "📖 详细部署说明请查看 DEPLOYMENT.md 文件"
