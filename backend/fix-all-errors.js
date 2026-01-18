const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复 TypeScript 错误...\n');

// 修复 orders.ts 中的 supabase.raw
const ordersPath = path.join(__dirname, 'src', 'routes', 'orders.ts');
let ordersContent = fs.readFileSync(ordersPath, 'utf8');

// 替换 supabase.raw 为正确的更新方式
ordersContent = ordersContent.replace(
  /\/\/ 增加积分（每元1积分）\s+const points = Math\.floor\(order\.final_amount\);\s+await supabase\s+\.from\('users'\)\s+\.update\(\{\s+points: supabase\.raw\(`points \+ \$\{points\}`\),\s+\}\)\s+\.eq\('id', userId\);/,
  `// 增加积分（每元1积分）
    const points = Math.floor(order.final_amount);
    
    // 获取当前积分
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    
    // 更新积分
    await supabase
      .from('users')
      .update({
        points: (currentUser?.points || 0) + points,
      })
      .eq('id', userId);`
);

// 添加返回类型
ordersContent = ordersContent.replace(
  /router\.(get|post|put|delete)\('([^']+)', (authMiddleware, )?async \(req: (AuthRequest|Request), res: Response\) => \{/g,
  "router.$1('$2', $3async (req: $4, res: Response): Promise<void> => {"
);

fs.writeFileSync(ordersPath, ordersContent, 'utf8');
console.log('✅ 已修复: orders.ts');

// 修复 points.ts
const pointsPath = path.join(__dirname, 'src', 'routes', 'points.ts');
let pointsContent = fs.readFileSync(pointsPath, 'utf8');

pointsContent = pointsContent.replace(
  /\/\/ 更新用户积分\s+await supabase\s+\.from\('users'\)\s+\.update\(\{\s+points: supabase\.raw\(`points \+ \$\{totalPoints\}`\),\s+\}\)\s+\.eq\('id', userId\);/,
  `// 更新用户积分
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    
    await supabase
      .from('users')
      .update({
        points: (currentUser?.points || 0) + totalPoints,
      })
      .eq('id', userId);`
);

pointsContent = pointsContent.replace(
  /router\.(get|post)\('([^']+)', (authMiddleware, )?async \(req: (AuthRequest|Request), res: Response\) => \{/g,
  "router.$1('$2', $3async (req: $4, res: Response): Promise<void> => {"
);

fs.writeFileSync(pointsPath, pointsContent, 'utf8');
console.log('✅ 已修复: points.ts');

// 修复 reviews.ts
const reviewsPath = path.join(__dirname, 'src', 'routes', 'reviews.ts');
let reviewsContent = fs.readFileSync(reviewsPath, 'utf8');

reviewsContent = reviewsContent.replace(
  /\/\/ 评价后赠送积分\s+const bonusPoints = 10;\s+await supabase\s+\.from\('users'\)\s+\.update\(\{\s+points: supabase\.raw\(`points \+ \$\{bonusPoints\}`\),\s+\}\)\s+\.eq\('id', userId\);/,
  `// 评价后赠送积分
    const bonusPoints = 10;
    
    const { data: currentUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    
    await supabase
      .from('users')
      .update({
        points: (currentUser?.points || 0) + bonusPoints,
      })
      .eq('id', userId);`
);

reviewsContent = reviewsContent.replace(
  /router\.(get|post)\('([^']+)', (authMiddleware, )?async \(req: (AuthRequest|Request), res: Response\) => \{/g,
  "router.$1('$2', $3async (req: $4, res: Response): Promise<void> => {"
);

fs.writeFileSync(reviewsPath, reviewsContent, 'utf8');
console.log('✅ 已修复: reviews.ts');

// 修复所有其他路由文件
const routeFiles = [
  'address.ts',
  'auth.ts',
  'cart.ts',
  'coupons.ts',
  'invite.ts',
  'posts.ts',
  'products.ts',
  'users.ts',
  'wallet.ts'
];

routeFiles.forEach(filename => {
  const filePath = path.join(__dirname, 'src', 'routes', filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 添加返回类型
  content = content.replace(
    /router\.(get|post|put|delete)\('([^']+)', (authMiddleware, )?async \(req: (AuthRequest|Request), res: Response\) => \{/g,
    "router.$1('$2', $3async (req: $4, res: Response): Promise<void> => {"
  );
  
  // 移除未使用的 Request 导入
  if (!content.includes('req: Request')) {
    content = content.replace(
      "import { Router, Request, Response } from 'express';",
      "import { Router, Response } from 'express';"
    );
  }
  
  // 修复未使用的变量
  content = content.replace(/const code = /g, 'const _code = ');
  content = content.replace(/const { data: inviteRecords,/g, 'const { data: _inviteRecords,');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已修复: ${filename}`);
});

console.log('\n🎉 所有文件修复完成！');
console.log('\n请运行以下命令验证：');
console.log('  npm run build\n');
