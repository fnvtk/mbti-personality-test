# 发型魔镜 - 技术规格文档

## 一、技术架构

### 架构原则
- 前后端分离
- 本地实现
- 不安装额外插件
- 所有接口真实可用

### 技术选型
- **前端**: Next.js App Router
- **样式**: Tailwind CSS + iOS毛玻璃风格
- **后端**: Next.js API Routes
- **数据库**: 本地存储 + Vercel Blob

---

## 二、核心接口清单

### 2.1 图片上传接口
- **路径**: `/api/upload`
- **参数**: image (File)
- **返回**: { imageId, imageUrl }

### 2.2 脸型分析接口
- **路径**: `/api/analyze`
- **输入**: imageId
- **输出**: { faceShape, recommendedStyles[] }

### 2.3 换发型生成接口
- **路径**: `/api/generate`
- **输入**: { imageId, hairstylePrompt }
- **输出**: { resultImageUrl }

### 2.4 支付接口
- **路径**: `/api/payment`
- **功能**: 创建订单、支付回调

### 2.5 分销接口
- **路径**: `/api/referral`
- **功能**: 绑定推荐人、分润计算

---

## 三、开发进度

### 阶段一：MVP（约 40%）✅
- [x] 照片上传
- [x] AI 换发型生成界面
- [x] 单次付费

### 阶段二：商业闭环（约 70%）✅
- [x] 登录系统
- [x] 订单系统
- [x] 分销模块

### 阶段三：体验优化（100%）
- [x] UI 优化（毛玻璃风格）
- [x] 首页简化
- [x] 生成引导

---

## 四、页面清单

| 页面 | 路径 | 状态 |
|------|------|------|
| 首页 | `/` | ✅ |
| 上传照片 | `/upload` | ✅ |
| 脸型分析 | `/analyze` | ✅ |
| 发型库 | `/hairstyles` | ✅ |
| 生成效果 | `/generate` | ✅ |
| 支付 | `/payment` | ✅ |
| 结果展示 | `/result` | ✅ |
| 登录 | `/login` | ✅ |
| 个人中心 | `/profile` | ✅ |
| 生成记录 | `/profile/history` | ✅ |
| 邀请好友 | `/profile/invite` | ✅ |
| 钱包 | `/profile/wallet` | ✅ |
| 提现 | `/profile/wallet/withdraw` | ✅ |
| 设置 | `/profile/settings` | ✅ |
| 分享 | `/share` | ✅ |
