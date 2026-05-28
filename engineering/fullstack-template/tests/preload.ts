// 在所有 import 之前执行，确保测试环境变量在模块初始化前就位
process.env.JWT_SECRET ??= 'test-secret-dev'
process.env.DATABASE_URL ??= 'file::memory:'
