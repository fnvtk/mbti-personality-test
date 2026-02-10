# API 路由清单

所有 API 路由位于 `app/api/` 目录，使用 Next.js Route Handlers。

## 认证接口 (`/api/auth/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/auth/login` | POST | 用户登录（用户名/密码） |
| `/api/auth/wechat` | POST | 微信小程序登录（code换取openid） |
| `/api/validate-token` | POST | Token验证 |

## 用户接口 (`/api/user/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/user/profile` | GET/PUT | 获取/更新用户资料 |
| `/api/user/test-history` | GET | 获取测试历史列表 |

## 测试接口 (`/api/test/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/questions` | GET | 获取测试题目（query: type=mbti/disc/pdp） |
| `/api/test/submit` | POST | 提交测试答案 |
| `/api/test/result` | GET | 获取测试结果 |
| `/api/analyze` | POST | AI 分析测试结果 |

## 支付接口 (`/api/payment/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/payment/create` | POST | 创建支付订单（微信支付） |
| `/api/payment/notify` | POST | 微信支付回调通知 |
| `/api/payment/query` | GET | 查询订单状态 |

## 企业版接口 (`/api/enterprise/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/enterprise/login` | POST | 企业登录 |
| `/api/enterprise/payment` | POST | 企业支付 |

## 管理后台接口 (`/api/admin/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/admin/users` | GET | 用户列表（分页/筛选） |
| `/api/admin/orders` | GET | 订单列表 |
| `/api/admin/stats` | GET | 数据统计（用户数/订单数/收入） |

## 数据库接口 (`/api/database/`)

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/database/connect` | GET | 测试数据库连接 |
| `/api/database/status` | GET | 数据库状态 |
| `/api/database/sync` | POST | 数据同步 |
| `/api/database/logs` | GET | 数据库操作日志 |
| `/api/init-db` | POST | 初始化数据库表/集合 |

## 文件接口

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/upload` | POST | 文件上传（Vercel Blob） |

## 第二期新增接口（待开发）

### 定价接口

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/pricing` | GET | 获取定价配置（个人版+企业版） |
| `/api/pricing/enterprise` | GET | 获取企业版套餐详情 |

### 企业申请接口

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/enterprise/apply` | POST | 提交企业申请（企业信息/需求/规模） |
| `/api/enterprise/team` | GET | 获取团队成员列表 |
| `/api/enterprise/team/analysis` | POST | 生成团队分析报告 |
| `/api/enterprise/members` | GET/POST | 员工/应聘者管理 |

### 简历分析接口

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/resume/upload` | POST | 上传简历（PDF/Word） |
| `/api/resume/analyze` | POST | AI分析简历+面部匹配度 |
| `/api/resume/report` | GET | 获取求职者综合评估报告 |

### 超级管理员接口

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/superadmin/config` | GET/PUT | 系统参数配置 |
| `/api/superadmin/modules` | GET/PUT | 功能模块开关 |
| `/api/superadmin/version` | PUT | 切换个人版/企业版显示 |
| `/api/superadmin/ai-config` | GET/POST | AI 服务商配置管理（8家：OpenAI/Claude/DeepSeek/Kimi/Groq/Coze/Qwen/GLM） |
| `/api/superadmin/ai-balance` | POST | AI 服务商余额实时查询 + 告警通知 |

### 存客宝对接接口

| 路径 | 方法 | 功能 |
|:---|:---|:---|
| `/api/cunkebao/add-friend` | POST | 支付成功后自动添加用户微信 |

---

## 小程序调用说明

小程序通过 `wx.request` 调用以上 API，基础URL配置在 `miniprogram/app.js` 的 `BASE_URL`。

生产环境域名：`https://ai-pandora.xyz`
