#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🔍 EasyMove MongoDB 数据查看器');
console.log('================================\n');

const MONGODB_URI = 'mongodb+srv://liu3675716_db_user:zVzO66miyz8Vn88R@cluster0.f3wzcj3.mongodb.net/easymove?retryWrites=true&w=majority';

// 查看用户数据
console.log('👥 用户数据:');
const mongoCommand = `mongosh "${MONGODB_URI}" --quiet --eval "db.users.find({}, {password: 0}).pretty()"`;
exec(mongoCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ 查看用户数据失败:', error.message);
    return;
  }
  if (stderr) {
    console.error('⚠️ 警告:', stderr);
  }
  console.log(stdout);
  
  // 查看订单数据
  console.log('\n📋 订单数据:');
  const orderCommand = `mongosh "${MONGODB_URI}" --quiet --eval "db.orders.find().pretty()"`;
  exec(orderCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ 查看订单数据失败:', error.message);
      return;
    }
    if (stderr) {
      console.error('⚠️ 警告:', stderr);
    }
    console.log(stdout);
    
    // 统计信息
    console.log('\n📊 统计信息:');
    const statsCommand = `mongosh "${MONGODB_URI}" --quiet --eval "print('用户总数: ' + db.users.countDocuments()); print('订单总数: ' + db.orders.countDocuments()); print('待处理订单: ' + db.orders.countDocuments({status: 'pending'})); print('已完成订单: ' + db.orders.countDocuments({status: 'completed'}));"`;
    exec(statsCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 查看统计信息失败:', error.message);
        return;
      }
      if (stderr) {
        console.error('⚠️ 警告:', stderr);
      }
      console.log(stdout);
      
      console.log('\n✅ 数据查看完成！');
      console.log('\n💡 使用说明:');
      console.log('- 运行 "node mongodb-viewer.cjs" 查看所有数据');
      console.log('- 或者使用 "mongosh" 命令直接连接到MongoDB Atlas');
      console.log('- 连接字符串已配置在 .env 文件中');
    });
  });
});
