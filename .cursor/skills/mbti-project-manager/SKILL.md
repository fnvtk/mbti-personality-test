---
name: mbti-project-manager
description: 「灵犀」- MBTI性格测试系统的全栈项目管理中枢。管理 Web端（Next.js）和微信小程序双端的开发、构建、部署全流程。包含项目管理、进度跟踪、文档维护、核心代码知识、微信支付、AI分析、经验沉淀、脚本工具。触发词：MBTI、灵犀、性格测试、神仙团队、小程序、miniprogram、DISC、PDP、AI人脸分析、微信支付、项目进度、开发文档。每次对话结束时自动更新进度文档并沉淀经验。
---

# 灵犀 | MBTI 性格测试系统 · 项目管理中枢

> **心有灵犀一点通** —— 洞察人格，理解人心
> 本 Skill 是 MBTI 项目的**唯一开发入口**，所有开发任务必须先经过灵犀。

---

## 执行铁律（学自卡若AI，不可跳过）

### 统一执行流程
```
思考(深度理解+分配) → 拆解(计划) → 读取(上下文) → 按步执行 → 每步总结 → 验证结果
```

### 开发八律
1. **先读后写**：先读 SKILL.md → references → 源代码 → 再编码
2. **先做再说**：能执行就执行，禁止只写方案不跑代码
3. **先做→再总结→再完善→经验迭代**
4. **验证不通过**：回溯→查文档→修正→再验证（最多5轮）
5. **风险操作先备份**：数据库变更、批量修改等先备份
6. **编码规范强制**：TypeScript + 中文注释 + Shadcn UI + Skeleton骨架屏
7. **附件必存档**：对话中出现截图/图片/附件 → 存入 `开发文档/附件/` + 登记索引
8. **每次对话结束**：更新进度 + 沉淀经验 + 复盘总结

### 附件管理规则（强制）
对话中出现截图、图片、设计稿等附件时：
1. **保存**：存入 `开发文档/附件/` 对应子目录（截图/原型/其它）
2. **命名**：`YYYYMMDD_中文描述.扩展名`（如 `20260210_支付流程截图.png`）
3. **登记**：在 `开发文档/附件/附件索引.md` 追加一行记录
4. **禁止**：纯英文命名、无意义命名（image1.png 等）

```
附件目录：
开发文档/附件/
├── 附件索引.md      ← 所有附件登记表
├── 截图/            ← UI截图、Bug截图、对话截图
├── 原型/            ← 原型图、设计稿
└── 其它/            ← 文档、PDF等
```

### 对话结束必执行
1. **更新进度**：更新 `references/project-progress.md`（状态+变更日志）
2. **沉淀经验**：有价值的解决方案存入 `references/experience-log.md`
3. **存档附件**：本次对话中有截图/附件 → 保存到 `开发文档/附件/` 并登记
4. **复盘总结**：按以下格式输出

```
【灵犀·复盘】
目标&结果：本次要做什么 → 实际完成什么
过程：关键步骤 1/2/3
反思：遇到什么问题，怎么解决的
总结：一句话总结
下一步：接下来要做什么
```

---

## 项目概览

| 属性 | 值 |
|:---|:---|
| **代号** | 灵犀 |
| **产品名** | 神仙团队AI性格测试 |
| **项目路径** | `/Users/karuo/Documents/开发/3、自营项目/MBTI` |
| **Web技术栈** | Next.js 14 + TypeScript + Tailwind CSS + Shadcn UI |
| **小程序** | 微信原生（AppID: `wx3d15ed02e98b04e3`） |
| **数据库** | PostgreSQL (Neon,生产) + MongoDB (开发) |
| **AI服务** | Groq (llama3-8b) + Coze API |
| **部署** | Vercel (Web, `ai-pandora.xyz`) + 微信平台 (小程序) |
| **当前版本** | v1.0.2 → **目标 v2.0（第二期·商业化闭环）** |
| **总完成度** | ~40%（第二期标准） |

## 第二期核心目标（强制遵循）

> 需求基准：[feishu-requirements.md](references/feishu-requirements.md) —— **所有开发必须完全符合此方向**

### 商业化闭环
```
免费体验（拍照+AI分析）→ 登录卡点 → 简要报告（锁定高级内容）
→ 付费引导（¥198基础/¥1,980深度）→ 完整报告 + 存客宝加微信
→ 企业版升级引导（团队测试/简历分析）
```

### 定价体系
| 版本 | 服务 | 价格 |
|:---|:---|:---:|
| **个人版** | 基础报告 | ¥198/次 |
| **个人版** | 深度报告 | ¥1,980/次 |
| **企业版** | 团队启动版（10人） | ¥19,800 |
| **企业版** | 团队成长版（10-30人） | ¥39,800 |
| **企业版** | 团队蜕变版（≤100人） | ¥98,000 |

### 第二期新增功能
- **支付系统**：微信支付 + 支付宝 + 对公转账
- **登录卡点**：报告页必须登录
- **内容锁定**：基础免费 + 高级内容付费解锁
- **企业申请**：`/enterprise-apply` 收集企业信息
- **简历分析**：PDF/Word上传 + AI匹配度分析
- **团队分析**：性格组合/冲突/优劣/角色建议
- **企业后台**：员工管理/测试结果/报告/权限
- **超级管理员**：版本切换/模块开关/系统配置

---

## 项目结构

```
MBTI/
├── app/                    # Next.js App Router
│   ├── api/                #   后端 API Routes
│   │   ├── auth/           #     认证（login/wechat）
│   │   ├── payment/        #     支付（create/notify/query）
│   │   ├── test/           #     测试（submit/result）
│   │   ├── user/           #     用户（profile/test-history）
│   │   ├── admin/          #     管理（users/orders/stats）
│   │   ├── analyze/        #     AI分析
│   │   └── database/       #     数据库管理
│   ├── test/               #   测试页(mbti/disc/pdp)
│   ├── *-result/           #   结果页
│   ├── admin/              #   管理后台
│   └── enterprise*/        #   企业版
├── miniprogram/            # 微信小程序（13页）
│   ├── pages/              #   所有小程序页面
│   └── utils/              #   payment.js / questions.js
├── components/ui/          # Shadcn UI 组件库（60+）
├── data/                   # 题库数据（mbti/disc/pdp）
├── lib/                    # 核心库
│   ├── models/             #   User / Order / TestResult
│   ├── mbti-calculator.ts  #   MBTI算法
│   ├── groq-service.ts     #   AI服务
│   ├── config.ts           #   配置中心
│   └── wechat-config.ts    #   微信配置
├── scripts/                # 项目脚本
├── 开发文档/               # 10分类完整文档
└── .cursor/skills/         # 灵犀 Skill
```

---

## 功能模块 & 状态看板

### 第一期（已完成）
| 模块 | 状态 |
|:---|:---:|
| MBTI/DISC/PDP 测试逻辑 | ✅ |
| AI人脸分析(Groq) | ✅(90%) |
| 前端H5全部页面 | ✅ |
| 小程序13页 | ✅ |
| JWT认证 + 管理后台 | ✅ |

### 第二期（当前开发中）
| 模块 | 状态 | 优先级 |
|:---|:---:|:---:|
| MongoDB部署 | ⏳ | **P0** |
| 支付后端(create/notify/query) | ⏳ | **P0** |
| 新定价体系(¥198/¥1,980) | ⏳ | **P0** |
| 登录卡点 + 内容锁定 + 付费引导 | ⏳ | **P0** |
| 微信登录对接 | ⏳ | **P0** |
| 存客宝自动加微信 | ⏳ | **P0** |
| `/payment` 支付页 | ⏳ | P1 |
| `/pricing` 定价页 | ⏳ | P1 |
| `/enterprise-apply` 企业申请 | ⏳ | P1 |
| 企业版定价+支付(对公转账) | ⏳ | P1 |
| 简历上传+分析 | ⏳ | P1 |
| 团队分析(性格/冲突/角色) | ⏳ | P1 |
| 企业管理后台(员工/结果/报告/权限) | ⏳ | P1 |
| 超级管理员(版本切换/模块开关) | ⏳ | P1 |
| AI真实图像(Gemini Vision) | ⏳ | P2 |
| 分享海报 | ⏳ | P2 |
| 小程序审核 | ⏳ | P2 |

> 详细进度（33项任务）见 [references/project-progress.md](references/project-progress.md)

---

## 核心代码速查

### MBTI计算器 (`lib/mbti-calculator.ts`)
```
答案 → calculateDimensionScores() → 加权标准化(0-100)
     → determineMBTIType() → 取高分方向拼4字母(如INTJ)
     → calculateConfidence() → 50% + avgDiff×0.9 (上限95%)
一键调用: MBTICalculator.calculateMBTIResult(answers)
```

### 微信支付（[详见 wechat-payment.md](references/wechat-payment.md)）
```
小程序wxPay() → POST /api/payment/create → 微信统一下单
→ prepay_id → wx.requestPayment() → 回调 /api/payment/notify
商户号: 1318592501 | 签名: MD5(ASCII排序+key)
```

### AI分析 (`lib/groq-service.ts`)
```
3张照片 → POST /api/analyze → Groq llama3-8b → JSON(MBTI+DISC+PDP)
8秒超时 | 失败返回模拟数据 | 成本~¥0.001/次
```

> 完整代码摘要见 [references/core-code-summary.md](references/core-code-summary.md)

---

## 开发工作流

### 新功能流程（每次必遵）
```
① 读灵犀 SKILL.md          → 了解全局
② 读 project-progress.md   → 了解当前进度
③ 读对应 references/       → 了解技术细节
④ 读 开发文档/ 对应目录    → 需求/架构/接口规范
⑤ 读源代码                 → 理解现有实现
⑥ 拆解 + 编码              → 遵循编码规范
⑦ 测试验证                 → pnpm dev / 微信工具
⑧ 更新文档 + 进度          → 同步所有变更
```

### 编码规范
| 规则 | 要求 |
|:---|:---|
| 语言 | TypeScript（Web）/ JavaScript（小程序） |
| 组件 | 优先用 `components/ui/` Shadcn 组件 |
| 样式 | Tailwind CSS，主题色 `#FFF5F7`，iOS毛玻璃风格 |
| 加载 | **必须** Skeleton 骨架屏（禁止白屏） |
| 路由 | 添加 transition 动画 |
| 注释 | **全部中文注释** |
| 安全 | 敏感信息走环境变量，禁止硬编码 |
| 字体 | San Francisco 风格栈 |

### 常用命令
```bash
pnpm dev          # 开发 http://localhost:3000
pnpm build        # 构建
pnpm lint         # 检查
pnpm start        # 生产
```

---

## 部署

### Web → Vercel（推 main 自动部署，域名 ai-pandora.xyz）

### 小程序 → 微信平台
```bash
bash .cursor/skills/mbti-project-manager/scripts/deploy-miniprogram.sh "版本" "描述"
```
上传后 → mp.weixin.qq.com → 版本管理 → 体验版/审核

> 详细部署见 [references/deployment.md](references/deployment.md)

---

## 项目管理（学自卡若AI·水泉）

### 进度跟踪
- **进度文档**：[references/project-progress.md](references/project-progress.md)
- 每次对话结束 → 自动更新状态+变更日志

### 执行计划
```
Phase 1 (Week 1-2) - P0 商业化基础
├── MongoDB部署 + 支付后端 + 新定价体系
├── 登录卡点 + 报告锁定 + 付费引导
└── 微信登录 + 存客宝对接

Phase 2 (Week 3-4) - P1 企业版
├── 企业申请 + 定价 + 支付(含对公转账)
├── 简历上传 + AI分析 + 团队分析
└── 企业管理后台 + 超级管理员

Phase 3 (Week 5) - P2 优化
├── AI真实图像 + 分享海报
└── 部署上线 + 小程序审核
```

### 开发文档维护
```
开发文档/
├── 1、需求/        ← 业务+技术需求
├── 2、架构/        ← 系统架构+技术选型
├── 3、原型/        ← 原型设计
├── 4、前端/        ← 前端规范
├── 5、接口/        ← 接口定义
├── 6、后端/        ← 后端规范
├── 7、数据库/      ← 数据库规范
├── 8、部署/        ← 部署流程
├── 9、手册/        ← 使用手册
├── 10、项目管理/   ← 与灵犀联动
└── _核心代码/      ← 算法+支付+AI+计划
```

### 风险管理（学自卡若AI·风险等级）
| 操作 | 等级 | 处理 |
|:---|:---:|:---|
| 读取/查询 | 🟢 安全 | 直接执行 |
| 修改代码/配置 | 🟡 谨慎 | 先读后改，确认影响 |
| 数据库变更/批量删除 | 🔴 危险 | 先备份，再操作 |

---

## 经验沉淀（学自卡若AI·经验库）

### 沉淀规则
- 完成功能开发/Bug修复/踩坑解决 → 存入 `references/experience-log.md`
- 每条含：日期 + 问题 + 解决方案 + 关键步骤
- 下次遇到类似问题 → **先查经验日志**

### 经验日志
- 位置：[references/experience-log.md](references/experience-log.md)
- 上限：50条，超过则整合相似条目

---

## 配置速查

### 环境变量 (`.env.local`)
| 变量 | 必需 | 用途 |
|:---|:---:|:---|
| `MONGODB_URI` | ✅ | MongoDB |
| `NEXT_PUBLIC_API_URL` | ✅ | API URL |
| `JWT_SECRET` | ✅ | JWT签名 |
| `GROQ_API_KEY` | ✅ | Groq AI |
| `COZE_API_KEY` | 可选 | Coze AI |
| `BLOB_READ_WRITE_TOKEN` | 可选 | Vercel Blob |

### 关键配置
| 文件 | 用途 |
|:---|:---|
| `lib/config.ts` | DB/API/Auth/AI配置 |
| `vercel.json` | Vercel部署 |
| `miniprogram/app.json` | 小程序页面+权限 |

---

## 脚本工具

| 脚本 | 用途 |
|:---|:---|
| `scripts/deploy-miniprogram.sh [版本] [描述]` | 小程序一键上传 |
| `scripts/dev-check.sh` | 开发环境检查 |
| `scripts/sync-data.sh [check]` | 双端题库一致性检查 |

路径：`.cursor/skills/mbti-project-manager/scripts/`

---

## 参考文档（按需加载）

| 文档 | 内容 | 何时加载 |
|:---|:---|:---|
| [tech-stack.md](references/tech-stack.md) | 技术栈+依赖+数据模型 | 技术选型 |
| [api-routes.md](references/api-routes.md) | API路由清单 | 接口开发 |
| [deployment.md](references/deployment.md) | 部署流程+检查清单 | 部署上线 |
| [pages-map.md](references/pages-map.md) | Web+小程序页面地图 | 页面开发 |
| [wechat-payment.md](references/wechat-payment.md) | 微信支付知识库 | 支付开发 |
| [core-code-summary.md](references/core-code-summary.md) | 核心代码摘要 | 功能理解 |
| [project-progress.md](references/project-progress.md) | 项目进度+任务 | **每次必读** |
| [experience-log.md](references/experience-log.md) | 经验沉淀日志 | 遇到问题时 |
| [feishu-requirements.md](references/feishu-requirements.md) | 飞书需求文档 | 需求确认 |

---

## 问题速查

| 问题 | 排查 |
|:---|:---|
| 小程序API失败 | `app.js` 中 `apiBase` + 后台域名配置 |
| Web构建失败 | `pnpm lint` 排查TS错误 |
| DB连不上 | `.env.local` 连接串 |
| 支付失败 | 商户号/API密钥/回调地址 |
| AI返回模拟数据 | `GROQ_API_KEY` 未配置 |
| 小程序上传失败 | 微信开发者工具是否登录 |

---

> **灵犀** —— 不只是工具，是会持续进化的项目管家。
