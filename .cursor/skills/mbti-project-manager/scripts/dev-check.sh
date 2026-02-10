#!/bin/bash
# ========================================
# MBTI 开发环境检查脚本
# 用法: bash dev-check.sh
# 检查项: Node.js/pnpm/MongoDB/微信工具/环境变量
# ========================================

echo "╔══════════════════════════════════════════════╗"
echo "║      MBTI 开发环境检查                        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="/Users/karuo/Documents/开发/3、自营项目/MBTI"
PASS=0
FAIL=0

check() {
    local name="$1"
    local cmd="$2"
    local result
    
    if result=$(eval "$cmd" 2>/dev/null); then
        echo "  ✅ $name: $result"
        ((PASS++))
    else
        echo "  ❌ $name: 未安装或不可用"
        ((FAIL++))
    fi
}

# 基础工具
echo "📋 基础工具检查"
echo "────────────────────────────────"
check "Node.js" "node --version"
check "pnpm" "pnpm --version"
check "npm" "npm --version"
check "Git" "git --version | head -1"
check "TypeScript" "npx tsc --version 2>/dev/null || tsc --version"

# 数据库
echo ""
echo "📋 数据库检查"
echo "────────────────────────────────"
check "MongoDB" "mongosh --eval 'db.version()' --quiet 2>/dev/null || echo '未运行'"

# 微信开发者工具
echo ""
echo "📋 微信开发者工具"
echo "────────────────────────────────"
CLI="/Applications/wechatwebdevtools.app/Contents/MacOS/cli"
if [ -f "$CLI" ]; then
    echo "  ✅ 微信开发者工具: 已安装"
    ((PASS++))
else
    echo "  ❌ 微信开发者工具: 未安装"
    ((FAIL++))
fi

# 项目文件
echo ""
echo "📋 项目文件检查"
echo "────────────────────────────────"
[ -f "$PROJECT_DIR/package.json" ] && echo "  ✅ package.json" && ((PASS++)) || { echo "  ❌ package.json 不存在"; ((FAIL++)); }
[ -d "$PROJECT_DIR/node_modules" ] && echo "  ✅ node_modules (已安装依赖)" && ((PASS++)) || { echo "  ⚠️  node_modules 不存在，需要 pnpm install"; ((FAIL++)); }
[ -f "$PROJECT_DIR/.env.local" ] && echo "  ✅ .env.local (环境变量)" && ((PASS++)) || { echo "  ⚠️  .env.local 不存在，需要配置环境变量"; ((FAIL++)); }
[ -f "$PROJECT_DIR/miniprogram/app.json" ] && echo "  ✅ 小程序 app.json" && ((PASS++)) || { echo "  ❌ 小程序 app.json 不存在"; ((FAIL++)); }

# 环境变量检查
echo ""
echo "📋 环境变量检查（.env.local）"
echo "────────────────────────────────"
if [ -f "$PROJECT_DIR/.env.local" ]; then
    for var in MONGODB_URI JWT_SECRET GROQ_API_KEY NEXT_PUBLIC_API_URL; do
        if grep -q "^${var}=" "$PROJECT_DIR/.env.local" 2>/dev/null; then
            echo "  ✅ $var: 已配置"
            ((PASS++))
        else
            echo "  ⚠️  $var: 未配置"
            ((FAIL++))
        fi
    done
else
    echo "  ⚠️  .env.local 文件不存在"
    echo "  💡 请复制 .env.local.example 为 .env.local 并填写配置"
fi

# 端口检查
echo ""
echo "📋 端口占用检查"
echo "────────────────────────────────"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "  ⚠️  端口 3000 已被占用"
    lsof -i :3000 | head -2
else
    echo "  ✅ 端口 3000 可用"
    ((PASS++))
fi

# 总结
echo ""
echo "════════════════════════════════════════════════"
echo "  检查完成: ✅ $PASS 通过 / ❌ $FAIL 需处理"
echo "════════════════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
    echo ""
    echo "💡 快速修复:"
    echo "   pnpm install          # 安装依赖"
    echo "   cp .env.local.example .env.local  # 创建环境变量文件"
    echo "   pnpm dev              # 启动开发服务器"
fi
