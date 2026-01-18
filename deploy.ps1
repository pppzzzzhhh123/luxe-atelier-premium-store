# 🚀 快速部署脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LUXE 后端快速部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 编译后端
Write-Host "步骤 1/4: 编译后端代码..." -ForegroundColor Yellow
Set-Location "c:\Users\pizhe\Downloads\luxe-atelier-premium-store\backend"

try {
    npm run build
    Write-Host "✅ 后端编译成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 后端编译失败" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# 步骤 2: 返回项目根目录
Write-Host "步骤 2/4: 准备提交代码..." -ForegroundColor Yellow
Set-Location "c:\Users\pizhe\Downloads\luxe-atelier-premium-store"

# 步骤 3: Git 提交
Write-Host "步骤 3/4: 提交代码到 Git..." -ForegroundColor Yellow

try {
    # 查看修改
    Write-Host "修改的文件：" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # 添加所有修改
    git add .
    Write-Host "✅ 文件已添加到暂存区" -ForegroundColor Green
    
    # 提交
    $commitMessage = "修复：添加 /api/users/me 端点和地址 API 兼容性"
    git commit -m $commitMessage
    Write-Host "✅ 代码已提交" -ForegroundColor Green
    
    # 推送
    Write-Host "正在推送到 GitHub..." -ForegroundColor Cyan
    git push origin main
    Write-Host "✅ 代码已推送到 GitHub" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Git 操作失败" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. Git 未安装或未配置" -ForegroundColor Yellow
    Write-Host "2. 没有权限推送到仓库" -ForegroundColor Yellow
    Write-Host "3. 网络连接问题" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请手动执行以下命令：" -ForegroundColor Cyan
    Write-Host "git add ." -ForegroundColor White
    Write-Host "git commit -m '修复：添加 /api/users/me 端点和地址 API 兼容性'" -ForegroundColor White
    Write-Host "git push origin main" -ForegroundColor White
    exit 1
}

Write-Host ""

# 步骤 4: 等待部署
Write-Host "步骤 4/4: 等待 Vercel 自动部署..." -ForegroundColor Yellow
Write-Host "Vercel 正在自动部署，请等待 2-3 分钟..." -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  部署已触发！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "下一步操作：" -ForegroundColor Cyan
Write-Host "1. 访问 Vercel Dashboard 查看部署状态：" -ForegroundColor White
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Blue
Write-Host ""
Write-Host "2. 等待部署完成后，测试健康检查：" -ForegroundColor White
Write-Host "   https://luxe-pi-kohl.vercel.app/health" -ForegroundColor Blue
Write-Host ""
Write-Host "3. 测试用户接口（应该返回 401，不是 404）：" -ForegroundColor White
Write-Host "   https://luxe-pi-kohl.vercel.app/api/users/me" -ForegroundColor Blue
Write-Host ""
Write-Host "4. 打开前端测试所有功能：" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Blue
Write-Host ""

Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
