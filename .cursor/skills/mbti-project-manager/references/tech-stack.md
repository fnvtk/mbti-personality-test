# 技术栈详细参考

## Web端（Next.js 应用）

### 框架与语言
| 技术 | 版本 | 用途 |
|:---|:---|:---|
| Next.js | 14.2.16 | App Router 全栈框架 |
| React | ^18 | UI 渲染 |
| TypeScript | ^5 | 类型安全 |
| Tailwind CSS | ^3.4.17 | 原子化样式 |

### UI 组件库
- **Shadcn UI**（基于 Radix UI）：60+ 基础组件
- 组件目录：`components/ui/`
- 配置文件：`components.json`
- 图标库：`lucide-react ^0.454.0`
- 字体：`geist ^1.2.2`（Sans + Mono）

### 数据库
| 技术 | 用途 | 配置位置 |
|:---|:---|:---|
| PostgreSQL (Neon) | 生产环境主数据库 | `lib/config.ts` → `dbConfig` |
| MongoDB (Mongoose 8.0.3) | 开发环境 / 部分数据存储 | `.env.local` → `MONGODB_URI` |

### 数据模型（`lib/models/`）
```
User.ts        → 用户模型（用户信息、测试记录、VIP状态）
Order.ts       → 订单模型（支付订单、产品类型、状态）
TestResult.ts  → 测试结果模型（测试类型、得分、AI分析）
```

### AI 服务
| 服务 | SDK | 用途 |
|:---|:---|:---|
| Groq | `groq-sdk ^0.3.0` | LLM 分析（llama2-70b） |
| Coze | 自定义 HTTP | Bot 对话分析 |

### 认证与安全
- JWT (`jsonwebtoken ^9.0.2`)：用户认证
- bcryptjs (`^2.4.3`)：密码加密
- 配置：`lib/auth.ts`、`lib/jwt.ts`

### 存储与文件
| 技术 | 用途 |
|:---|:---|
| Vercel Blob | 图片上传存储 |
| html2canvas | 页面截图 / 分享图生成 |
| docx + file-saver | Word 报告导出 |

### 数据验证
- Zod (`^3.22.4`)：运行时 Schema 验证

### 图表
- Chart.js (`^4.4.1`) + react-chartjs-2：性格分析雷达图/柱状图

### 监控
- Vercel Analytics (`^1.1.1`)：访问分析

---

## 小程序端

### 技术栈
| 技术 | 说明 |
|:---|:---|
| 框架 | 微信原生小程序 |
| 语言 | JavaScript |
| 样式 | WXSS |
| 基础库 | 3.14.2 |

### AppID & 密钥
- AppID：`wx3d15ed02e98b04e3`
- AppSecret：`a3ccdf829584b7f85143b68c4b6f7528`

### 页面列表（13个）
```
pages/index/index          首页
pages/test/mbti            MBTI测试
pages/test/disc            DISC测试
pages/test/pdp             PDP测试
pages/result/mbti          MBTI结果
pages/result/disc          DISC结果
pages/result/pdp           PDP结果
pages/ai-test/index        AI测试首页
pages/ai-test/camera       AI拍照
pages/ai-test/result       AI分析结果
pages/purchase/index       购买页
pages/profile/index        个人中心
pages/history/index        历史记录
```

### 权限
- `scope.camera`：AI人脸性格分析拍照

### 关键配置
- 导航栏：白色背景 `#FFFFFF`，标题 "神仙团队AI性格测试"
- 背景色：`#FFF5F7`
- 样式版本：v2
- 懒加载：`requiredComponents`

---

## 依赖关系图

```
Web端 → Next.js API Routes → PostgreSQL/MongoDB
                            → Groq AI / Coze AI
                            → Vercel Blob

小程序 → Web端 API（ai-pandora.xyz）
       → 微信支付
       → 微信登录
```
