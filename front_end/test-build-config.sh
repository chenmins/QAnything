#!/bin/bash

# 测试多版本构建配置
# Test multi-build configuration

echo "========================================="
echo "测试 Front_end 多版本构建"
echo "Testing Front_end Multi-Build Configuration"
echo "========================================="
echo ""

# 检查是否在 front_end 目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 front_end 目录下运行此脚本"
    echo "❌ Error: Please run this script in the front_end directory"
    exit 1
fi

# 检查必要文件是否存在
echo "1️⃣  检查配置文件..."
echo "Checking configuration files..."
echo ""

files=(
    ".env.production"
    ".env.production.bots"
    "src/router/routes.ts"
    "src/router/routes.bots.ts"
    "vite.config.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "2️⃣  检查 package.json 脚本..."
echo "Checking package.json scripts..."
echo ""

if grep -q '"build:bots"' package.json; then
    echo "✅ build:bots script found"
else
    echo "❌ build:bots script not found"
    exit 1
fi

echo ""
echo "3️⃣  检查环境变量配置..."
echo "Checking environment configuration..."
echo ""

# 检查 .env.production.bots 中是否有 VITE_APP_MODE=bots-only
if grep -q "VITE_APP_MODE=bots-only" .env.production.bots; then
    echo "✅ VITE_APP_MODE=bots-only found in .env.production.bots"
else
    echo "❌ VITE_APP_MODE=bots-only not found in .env.production.bots"
    exit 1
fi

echo ""
echo "4️⃣  检查路由配置..."
echo "Checking routes configuration..."
echo ""

# 检查 routes.bots.ts 中是否只包含 share 路由
if grep -q "path: '/bots/:botId/share'" src/router/routes.bots.ts; then
    echo "✅ Share route found in routes.bots.ts"
else
    echo "❌ Share route not found in routes.bots.ts"
    exit 1
fi

# 确保 routes.bots.ts 不包含管理路由
if grep -q "BotsManage" src/router/routes.bots.ts; then
    echo "⚠️  Warning: BotsManage found in routes.bots.ts (should not be there)"
    exit 1
else
    echo "✅ BotsManage not found in routes.bots.ts (correct)"
fi

echo ""
echo "5️⃣  检查 vite.config.ts 配置..."
echo "Checking vite.config.ts..."
echo ""

if grep -q "production-bots" vite.config.ts; then
    echo "✅ production-bots mode configuration found"
else
    echo "❌ production-bots mode configuration not found"
    exit 1
fi

if grep -q "dist/bots-only" vite.config.ts; then
    echo "✅ bots-only output directory configuration found"
else
    echo "❌ bots-only output directory configuration not found"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ 所有配置检查通过！"
echo "✅ All configuration checks passed!"
echo "========================================="
echo ""
echo "📦 可以执行的构建命令:"
echo "📦 Available build commands:"
echo ""
echo "   pnpm build         # 构建完整版本 → dist/qanything"
echo "   pnpm build:bots    # 构建分享版本 → dist/bots-only"
echo ""
echo "========================================="
