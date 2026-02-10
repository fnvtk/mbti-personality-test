#!/bin/bash
# ========================================
# MBTI小程序部署脚本
# 用法: bash deploy-miniprogram.sh [版本号] [描述]
# 示例: bash deploy-miniprogram.sh "1.0.3" "修复支付问题"
# ========================================

set -e

# 配置
APPID="wx3d15ed02e98b04e3"
PROJECT_PATH="/Users/karuo/Documents/开发/3、自营项目/MBTI/miniprogram"
CLI="/Applications/wechatwebdevtools.app/Contents/MacOS/cli"
VERSION="${1:-1.0.0}"
DESC="${2:-MBTI/DISC/PDP性格测试系统 v${VERSION}}"

echo "╔══════════════════════════════════════════════╗"
echo "║      MBTI 小程序部署脚本                      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  AppID:   $APPID"
echo "  版本:    $VERSION"
echo "  描述:    $DESC"
echo "  项目路径: $PROJECT_PATH"
echo ""

# 检查微信开发者工具
if [ ! -f "$CLI" ]; then
    echo "❌ 未找到微信开发者工具CLI"
    echo "   请确认已安装微信开发者工具"
    echo "   下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    exit 1
fi

# 检查项目目录
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ 项目目录不存在: $PROJECT_PATH"
    exit 1
fi

# 检查 app.json
if [ ! -f "$PROJECT_PATH/app.json" ]; then
    echo "❌ 未找到 app.json"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 上传
echo "📦 正在上传小程序..."
"$CLI" upload \
    --project "$PROJECT_PATH" \
    -v "$VERSION" \
    -d "$DESC"

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║              ✅ 上传成功！                    ║"
    echo "╠══════════════════════════════════════════════╣"
    echo "║  下一步:                                      ║"
    echo "║  1. 打开 https://mp.weixin.qq.com            ║"
    echo "║  2. 版本管理 → 开发版本                       ║"
    echo "║  3. 设为体验版测试                            ║"
    echo "║  4. 测试通过后提交审核                         ║"
    echo "╚══════════════════════════════════════════════╝"
    
    # 自动打开微信公众平台
    read -p "是否打开微信公众平台？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://mp.weixin.qq.com/"
    fi
else
    echo ""
    echo "❌ 上传失败，请检查错误信息"
    exit 1
fi
