# 核心代码摘要

> 从 `开发文档/_核心代码/` 提取的关键知识，开发时快速参考

## 一、MBTI 计算器

**文件**：`lib/mbti-calculator.ts`

### 核心接口
```typescript
interface IDimensionScore { E/I/S/N/T/F/J/P: number }  // 0-100
interface ITestAnswer { questionId, selectedOption, dimension }
```

### 计算流程
```
用户答案(30题) → calculateDimensionScores() → 加权得分标准化(0-100)
             → determineMBTIType() → 取每维度高分方向拼接(如INTJ)
             → calculateConfidence() → 50% + avgDiff × 0.9 (上限95%)
```

### 一键调用
```typescript
const result = MBTICalculator.calculateMBTIResult(answers)
// → { mbtiType, dimensionScores, confidence, description, dominantDimensions }
```

### 16型人格
| 分析师 | 外交官 | 守护者 | 探险家 |
|:---:|:---:|:---:|:---:|
| INTJ建筑师 | INFJ提倡者 | ISTJ物流师 | ISTP鉴赏家 |
| INTP逻辑学家 | INFP调停者 | ISFJ守卫者 | ISFP探险家 |
| ENTJ指挥官 | ENFJ主人公 | ESTJ总经理 | ESTP企业家 |
| ENTP辩论家 | ENFP竞选者 | ESFJ执政官 | ESFP表演者 |

---

## 二、微信支付

**文件**：`miniprogram/utils/payment.js` + `app/api/payment/`

### 支付流程
```
wxPay(options) → POST /api/payment/create → 微信统一下单 → prepay_id
              → wx.requestPayment(支付参数) → 支付回调 → 更新订单
```

### 核心函数
- `wxPay(options)` - 发起微信支付（核心）
- `purchaseVIP(type)` - 购买VIP（month/quarter/year/lifetime）
- `purchaseTestCount(count)` - 购买测试次数
- `checkVIP()` - 检查VIP状态
- `canTakeTest(type)` - 检查测试权限（VIP > 解锁 > 次数）
- `consumeTestCount()` - 消耗测试次数

### 商户配置
```
AppID: wx3d15ed02e98b04e3
商户号: 1318592501
API密钥: wx3e31b068be59ddc131b068be59ddc2
```

### 签名算法
```
参数ASCII排序 → key=value& 拼接 → 末尾 &key=API密钥 → MD5大写
```

---

## 三、AI 功能

**文件**：`lib/groq-service.ts` + `app/api/analyze/route.ts`

### 分析流程
```
用户拍照(3张) → POST /api/analyze → analyzePhotosWithGroq()
             → Groq API(llama3-8b) → JSON结果(MBTI+DISC+PDP+表情)
             → 保存MongoDB → 返回前端展示
```

### 关键配置
- 模型：`llama3-8b-8192`
- 温度：0.3（低温度=稳定输出）
- 超时：8秒（API）+ 10秒（路由）
- 降级：失败返回 `getMockAnalysisResult()` 模拟数据

### 返回结构
```json
{
  "overview": "性格概述",
  "mbti": { "type": "ENTJ", "title": "指挥官", "dimensions": {...} },
  "pdp": { "primary": "老虎", "secondary": "孔雀" },
  "disc": { "primary": "D型", "secondary": "I型" },
  "facialExpressions": { "emotions": ["自信", "专注", "亲和"] }
}
```

### 成本
- Groq llama3-8b：~¥0.001/次（几乎免费）

---

## 四、数据模型

**位置**：`lib/models/`

### User.ts
```typescript
{
  openId, nickname, avatar, phone, email,
  vipInfo: { isVIP, vipType, expireDate },
  testCount, unlockedTests: [String],
  testResults: [{ type, result, date }]
}
```

### Order.ts
```typescript
{
  orderId, userId, amount, description,
  productType, paymentMethod, status,
  createdAt, paidAt
}
```

### TestResult.ts
```typescript
{
  userId, testType, answers, result,
  confidence, createdAt
}
```
