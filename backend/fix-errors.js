#!/usr/bin/env node

/**
 * TypeScript 错误修复脚本
 * 自动修复所有路由文件中的常见错误
 */

const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

// 需要修复的文件列表
const files = [
  'address.ts',
  'auth.ts',
  'cart.ts',
  'coupons.ts',
  'invite.ts',
  'orders.ts',
  'points.ts',
  'posts.ts',
  'products.ts',
  'reviews.ts',
  'users.ts',
  'wallet.ts'
];

files.forEach(filename => {
  const filePath = path.join(routesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filename}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. 修复未使用的 Request 导入
  if (content.includes("import { Router, Request, Response }") && 
      !content.includes("async (req: Request, res: Response)")) {
    content = content.replace(
      "import { Router, Request, Response } from 'express';",
      "import { Router, Response } from 'express';"
    );
    modified = true;
  }

  // 2. 添加返回类型 Promise<void>
  content = content.replace(
    /async \((req: (?:AuthRequest|Request), res: Response)\) => \{/g,
    'async ($1): Promise<void> => {'
  );
  modified = true;

  // 3. 修复 supabase.raw 问题
  if (content.includes('supabase.raw')) {
    // 替换积分更新
    content = content.replace(
      /points: supabase\.raw\(`points \+ \$\{(\w+)\}`\)/g,
      'points: (currentUser?.points || 0) + $1'
    );
    
    // 添加获取当前积分的代码
    if (content.includes('(currentUser?.points || 0)')) {
      const updateUserMatch = content.match(/\/\/ 更新用户积分[\s\S]*?await supabase/);
      if (updateUserMatch && !content.includes('const { data: currentUser }')) {
        content = content.replace(
          '// 更新用户积分',
          `// 更新用户积分
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();`
        );
      }
    }
    modified = true;
  }

  // 4. 修复未使用的变量（添加下划线前缀）
  content = content.replace(/const code = /g, 'const _code = ');
  content = content.replace(/const { data: inviteRecords,/g, 'const { data: _inviteRecords,');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修复: ${filename}`);
  } else {
    console.log(`⏭️  跳过: ${filename}`);
  }
});

console.log('\n🎉 修复完成！');
console.log('请运行 npm run build 验证修复结果');
