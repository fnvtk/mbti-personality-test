# 页面地图

## Web端页面 (Next.js App Router)

### 用户端

| 路径 | 页面 | 说明 |
|:---|:---|:---|
| `/` | 首页 | 产品介绍、测试入口 |
| `/login` | 登录 | 用户登录页 |
| `/register` | 注册 | 用户注册页 |
| `/personality-tests` | 测试列表 | MBTI/DISC/PDP 选择 |
| `/test/mbti` | MBTI测试 | 30题MBTI测试 |
| `/test/disc` | DISC测试 | 20题DISC测试 |
| `/test/pdp` | PDP测试 | 20题PDP测试 |
| `/mbti-result` | MBTI结果 | 16型人格结果展示 |
| `/disc-result` | DISC结果 | 行为风格结果展示 |
| `/pdp-result` | PDP结果 | 动物性格结果展示 |
| `/ai-test` | AI测试 | AI人脸性格分析入口 |
| `/camera` | 拍照 | AI分析拍照页 |
| `/analysis` | 分析结果 | AI分析结果展示 |
| `/profile` | 个人中心 | 用户资料、设置 |
| `/dashboard` | 仪表盘 | 用户数据总览 |
| `/pricing` | 定价 | VIP套餐/单次购买 |
| `/payment` | 支付 | 微信支付页 |
| `/full-report` | 完整报告 | 付费完整报告 |
| `/report` | 报告 | 报告详情 |
| `/share` | 分享 | 测试结果分享页 |
| `/phone-verification` | 手机验证 | 手机号绑定 |
| `/consultant` | 咨询师 | 专业咨询入口 |
| `/deep-service` | 深度服务 | 付费深度分析 |

### 企业版

| 路径 | 页面 | 说明 |
|:---|:---|:---|
| `/enterprise*` | 企业首页 | 企业版介绍/入口 |
| `/enterprise-dashboard` | 企业仪表盘 | 团队数据分析 |
| `/recruiter` | 招聘者 | 招聘用性格评估 |
| `/resume-upload*` | 简历上传 | 候选人简历分析 |

### 管理后台

| 路径 | 页面 | 说明 |
|:---|:---|:---|
| `/admin/login` | 管理登录 | 管理员登录 |
| `/admin/dashboard` | 管理仪表盘 | 数据统计总览 |
| `/admin/users` | 用户管理 | 用户列表/编辑/统计 |
| `/admin/database` | 数据库管理 | 连接/同步/日志 |
| `/admin/enterprise` | 企业管理 | 企业版管理 |
| `/admin/pricing` | 定价管理 | 套餐/价格设置 |
| `/superadmin` | 超级管理员 | 最高权限管理 |

---

## 小程序页面

| 页面路径 | 页面 | 对应Web端 |
|:---|:---|:---|
| `pages/index/index` | 首页 | `/` |
| `pages/test/mbti` | MBTI测试 | `/test/mbti` |
| `pages/test/disc` | DISC测试 | `/test/disc` |
| `pages/test/pdp` | PDP测试 | `/test/pdp` |
| `pages/result/mbti` | MBTI结果 | `/mbti-result` |
| `pages/result/disc` | DISC结果 | `/disc-result` |
| `pages/result/pdp` | PDP结果 | `/pdp-result` |
| `pages/ai-test/index` | AI测试 | `/ai-test` |
| `pages/ai-test/camera` | AI拍照 | `/camera` |
| `pages/ai-test/result` | AI结果 | `/analysis` |
| `pages/purchase/index` | 购买 | `/pricing` |
| `pages/profile/index` | 个人中心 | `/profile` |
| `pages/history/index` | 历史 | `/dashboard` |

### TabBar 配置
- 首页（home）：`pages/index/index`
- 我的（user）：`pages/profile/index`
- 图标：`images/home.png` / `images/home-active.png` / `images/user.png` / `images/user-active.png`

---

## 第二期新增/修改页面

### 新增页面

| 路径 | 页面 | 说明 | 优先级 |
|:---|:---|:---|:---:|
| `/payment` | **支付页面** | 多种支付方式、订单详情、服务说明 | P1 |
| `/pricing` | **定价页面** | 个人版vs企业版功能对比、价格展示 | P1 |
| `/enterprise-apply` | **企业申请页** | 收集企业信息、需求描述、团队规模 | P1 |
| `/resume-analysis` | **简历分析页** | 简历+面部特征综合分析结果展示 | P1 |

### 现有页面修改

| 路径 | 修改内容 | 优先级 |
|:---|:---|:---:|
| `/report` | 加入**锁定内容区域** + 购买完整报告引导按钮 | **P0** |
| `/profile` | 增加**企业服务入口** + 订单记录 + 服务管理 | P2 |
| 首页 `/` | 企业版增加**上传简历**按钮 + 优化用户引导 | P2 |

### 关键操作点

| 操作点 | 页面 | 要求 |
|:---|:---|:---|
| 拍照流程 | AI测试页 | 3张角度照片（正面/左45°/右45°） |
| 登录卡点 | 报告页 | **必须登录才能查看报告** |
| 内容锁定 | 报告页 | 基础结果免费 + 高级内容锁定预览 |
| 付费引导 | 报告页 | 明确付费入口，¥198/¥1,980 |
| 微信引导 | 支付成功后 | 存客宝自动添加用户微信 |
