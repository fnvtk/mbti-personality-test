#!/bin/bash
# MBTI小程序上传脚本
# 使用方法: ./upload.sh

# 配置
APPID="wx3d15ed02e98b04e3"
VERSION="1.0.0"
DESC="MBTI/DISC/PDP性格测试系统 v1.0.0"
PROJECT_PATH="$(dirname "$0")"
PRIVATE_KEY_PATH="$PROJECT_PATH/private.wx3d15ed02e98b04e3.key"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           MBTI小程序代码上传工具                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "AppID: $APPID"
echo "版本: $VERSION"
echo "描述: $DESC"
echo ""

# 检查私钥文件
if [ ! -f "$PRIVATE_KEY_PATH" ]; then
    echo "⚠️  未找到私钥文件！"
    echo ""
    echo "请按以下步骤获取私钥:"
    echo "1. 登录微信公众平台: https://mp.weixin.qq.com"
    echo "2. 使用小程序管理员微信扫码登录"
    echo "3. 进入 "开发" → "开发管理" → "开发设置""
    echo "4. 找到 "小程序代码上传" 部分"
    echo "5. 点击 "生成" 按钮 (如已有密钥，点击 "重置")"
    echo "6. 下载私钥文件，保存为:"
    echo "   $PRIVATE_KEY_PATH"
    echo ""
    echo "或者配置IP白名单后使用微信开发者工具上传。"
    exit 1
fi

echo "✓ 找到私钥文件"
echo ""
echo "开始上传..."
echo ""

# 执行上传
miniprogram-ci upload \
  --appid "$APPID" \
  --project-path "$PROJECT_PATH" \
  --private-key-path "$PRIVATE_KEY_PATH" \
  --upload-version "$VERSION" \
  --upload-description "$DESC" \
  --robot 1

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    ✓ 上传成功！                           ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║  下一步操作:                                               ║"
    echo "║  1. 登录微信公众平台: https://mp.weixin.qq.com            ║"
    echo "║  2. 进入 "版本管理" → "开发版本"                         ║"
    echo "║  3. 选择该版本，点击 "提交审核"                          ║"
    echo "║  4. 审核通过后，点击 "发布" 即可上线                      ║"
    echo "╚════════════════════════════════════════════════════════════╝"
else
    echo ""
    echo "✗ 上传失败，请检查错误信息"
fi
