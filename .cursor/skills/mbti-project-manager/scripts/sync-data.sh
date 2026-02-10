#!/bin/bash
# ========================================
# MBTI 数据同步脚本
# 用法: bash sync-data.sh [web2mini|mini2web|check]
# 功能: Web端和小程序端题库数据同步检查
# ========================================

set -e

PROJECT_DIR="/Users/karuo/Documents/开发/3、自营项目/MBTI"
WEB_DATA="$PROJECT_DIR/data"
MINI_DATA="$PROJECT_DIR/miniprogram/utils"

ACTION="${1:-check}"

echo "╔══════════════════════════════════════════════╗"
echo "║      MBTI 数据同步工具                        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

case "$ACTION" in
    check)
        echo "📋 检查数据一致性..."
        echo ""
        
        # 检查 MBTI 题目数量
        WEB_MBTI=$(grep -c "dimension:" "$WEB_DATA/mbti-questions.ts" 2>/dev/null || echo "0")
        MINI_MBTI=$(grep -c "dimension:" "$MINI_DATA/questions.js" 2>/dev/null || echo "0")
        echo "  MBTI题目: Web端=${WEB_MBTI}题, 小程序=${MINI_MBTI}题"
        
        if [ "$WEB_MBTI" = "$MINI_MBTI" ]; then
            echo "  ✅ MBTI题目数量一致"
        else
            echo "  ⚠️  MBTI题目数量不一致，需要同步"
        fi
        
        # 检查 DISC 题目
        WEB_DISC=$(grep -c "dimension:" "$WEB_DATA/disc-questions.ts" 2>/dev/null || echo "0")
        echo "  DISC题目: Web端=${WEB_DISC}题"
        
        # 检查 PDP 题目
        WEB_PDP=$(grep -c "dimension:" "$WEB_DATA/pdp-questions.ts" 2>/dev/null || echo "0")
        echo "  PDP题目: Web端=${WEB_PDP}题"
        
        echo ""
        echo "  MBTI类型描述: "
        [ -f "$WEB_DATA/mbti-descriptions.ts" ] && echo "    ✅ Web端存在" || echo "    ❌ Web端缺失"
        [ -f "$MINI_DATA/descriptions.js" ] && echo "    ✅ 小程序端存在" || echo "    ❌ 小程序端缺失"
        ;;
        
    web2mini)
        echo "📤 从Web端同步数据到小程序端..."
        echo "⚠️  注意：Web端使用TypeScript，小程序使用JavaScript"
        echo "    需要手动转换类型标注"
        echo ""
        echo "需要同步的文件："
        echo "  $WEB_DATA/mbti-questions.ts → $MINI_DATA/questions.js"
        echo "  $WEB_DATA/mbti-descriptions.ts → $MINI_DATA/descriptions.js"
        echo ""
        echo "💡 建议手动检查后同步，避免类型转换问题"
        ;;
        
    *)
        echo "用法: bash sync-data.sh [check|web2mini]"
        echo ""
        echo "  check    - 检查Web端和小程序端数据一致性"
        echo "  web2mini - 从Web端同步到小程序端（需手动确认）"
        ;;
esac
