# 微信支付能力参考

> 来源：项目核心代码文档 + 微信支付官方文档

## 一、支付架构

```
用户 → 小程序(wx.requestPayment) → 后端(Next.js API) → 微信支付平台
                                         ↓
                                    数据库(订单记录)
```

### 支付流程（时序）

```
1. 用户点击购买 → 小程序调用 POST /api/payment/create
2. 后端生成订单 → 调用微信统一下单接口
3. 微信返回 prepay_id → 后端签名返回支付参数
4. 小程序调用 wx.requestPayment() → 拉起支付界面
5. 用户确认支付 → 微信异步通知 POST /api/payment/notify
6. 后端验签 → 更新订单状态 → 返回成功
```

## 二、商户配置

| 配置项 | 值 |
|:---|:---|
| AppID | `wx3d15ed02e98b04e3` |
| 商户号 | `1318592501` |
| API密钥 | `wx3e31b068be59ddc131b068be59ddc2` |
| 回调地址 | `https://ai-pandora.xyz/api/payment/notify` |

## 三、核心文件

| 文件 | 位置 | 功能 |
|:---|:---|:---|
| 支付工具类 | `miniprogram/utils/payment.js` | 小程序端支付调用 |
| 创建订单API | `app/api/payment/create/route.ts` | 统一下单 |
| 支付回调API | `app/api/payment/notify/route.ts` | 异步通知处理 |
| 查询订单API | `app/api/payment/query/route.ts` | 订单状态查询 |
| 企业支付 | `lib/enterprise-payment.ts` | 企业版支付逻辑 |

## 四、定价体系（第二期·强制）

> 以下定价来自飞书需求文档，为正式商业化定价，替代第一期测试定价

### 个人版
| 服务 | 价格 | 代码中金额(分) | 说明 |
|:---|:---:|:---:|:---|
| 基础报告 | ¥198/次 | 19800 | AI分析+基础性格报告 |
| 深度报告 | ¥1,980/次 | 198000 | 完整多维度深度分析 |

### 企业版
| 套餐 | 价格 | 代码中金额(分) | 团队规模 |
|:---|:---:|:---:|:---:|
| 团队启动版 | ¥19,800 | 1980000 | 10人 |
| 团队成长版 | ¥39,800 | 3980000 | 10-30人 |
| 团队蜕变版 | ¥98,000 | 9800000 | 最多100人 |

### 企业版支付方式
- 微信支付
- 支付宝
- **对公转账**（需新增支持）

### 用户转化链路
```
免费体验 → 登录卡点 → 简要报告（基础免费+高级锁定）
→ 付费(¥198/¥1,980) → 完整报告 + 存客宝加微信
→ 企业版升级引导
```

### ~~第一期测试定价（已废弃）~~
<details>
<summary>点击展开旧定价</summary>

| 套餐 | 价格 |
|:---|:---:|
| 月度VIP | ¥19.9 |
| 单次测试 | ¥3.9-9.9 |
</details>

## 五、核心代码详解

### 5.1 小程序端 - 发起支付

```javascript
// miniprogram/utils/payment.js

/**
 * 核心支付函数
 * @param {Object} options
 *   - orderId: 订单ID
 *   - amount: 金额（分）
 *   - description: 商品描述
 *   - productType: 商品类型 (vip/test_count/single_test)
 */
function wxPay(options) {
  const { orderId, amount, description, productType, success, fail } = options
  
  // 1. 调用后端创建支付订单
  wx.request({
    url: `${app.globalData.apiBase}/api/payment/create`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${wx.getStorageSync('token')}`,
      'Content-Type': 'application/json'
    },
    data: { orderId, amount, description, productType, paymentMethod: 'wechat', openId: app.globalData.openId },
    success: (res) => {
      if (res.statusCode === 200 && res.data.code === 200) {
        const paymentData = res.data.data
        // 2. 调起微信支付
        wx.requestPayment({
          timeStamp: paymentData.timeStamp,
          nonceStr: paymentData.nonceStr,
          package: paymentData.package,
          signType: paymentData.signType || 'MD5',
          paySign: paymentData.paySign,
          success: (payRes) => {
            notifyPaymentSuccess(orderId, paymentData.prepayId)
            success && success(payRes)
          },
          fail: (payErr) => { fail && fail(payErr) }
        })
      }
    }
  })
}
```

### 5.2 后端 - 统一下单（待实现/优化）

```typescript
// app/api/payment/create/route.ts

const WECHAT_PAY_CONFIG = {
  appId: 'wx3d15ed02e98b04e3',
  mchId: '1318592501',
  apiKey: 'wx3e31b068be59ddc131b068be59ddc2',
  notifyUrl: 'https://ai-pandora.xyz/api/payment/notify'
}

export async function POST(request: NextRequest) {
  const { orderId, amount, description, openId } = await request.json()
  
  // 1. 生成统一下单XML参数
  const params = {
    appid: WECHAT_PAY_CONFIG.appId,
    mch_id: WECHAT_PAY_CONFIG.mchId,
    nonce_str: generateNonceStr(),
    body: description,
    out_trade_no: orderId,
    total_fee: amount,        // 单位：分
    spbill_create_ip: '127.0.0.1',
    notify_url: WECHAT_PAY_CONFIG.notifyUrl,
    trade_type: 'JSAPI',
    openid: openId
  }
  
  // 2. MD5签名
  params.sign = generateSign(params, WECHAT_PAY_CONFIG.apiKey)
  
  // 3. 调用微信统一下单 https://api.mch.weixin.qq.com/pay/unifiedorder
  const prepayResult = await callWechatUnifiedOrder(params)
  
  // 4. 组装小程序支付参数并签名
  const payParams = {
    timeStamp: String(Math.floor(Date.now() / 1000)),
    nonceStr: generateNonceStr(),
    package: `prepay_id=${prepayResult.prepay_id}`,
    signType: 'MD5'
  }
  payParams.paySign = generateSign(payParams, WECHAT_PAY_CONFIG.apiKey)
  
  return NextResponse.json({ code: 200, data: payParams })
}
```

### 5.3 签名算法

```typescript
/**
 * 微信支付签名（MD5）
 * 规则：参数按ASCII排序 → key=value& 拼接 → 末尾追加 &key=API密钥 → MD5大写
 */
function generateSign(params: Record<string, any>, apiKey: string): string {
  const sorted = Object.keys(params)
    .filter(k => params[k] !== '' && params[k] !== undefined && k !== 'sign')
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  
  const signStr = `${sorted}&key=${apiKey}`
  return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase()
}
```

### 5.4 回调验签

```typescript
// app/api/payment/notify/route.ts
export async function POST(request: NextRequest) {
  const xml = await request.text()
  const data = parseXML(xml)
  
  // 1. 验证签名
  const sign = data.sign
  delete data.sign
  const calculatedSign = generateSign(data, WECHAT_PAY_CONFIG.apiKey)
  
  if (sign !== calculatedSign) {
    return new Response('<xml><return_code>FAIL</return_code></xml>')
  }
  
  // 2. 更新订单状态
  if (data.result_code === 'SUCCESS') {
    await updateOrderStatus(data.out_trade_no, 'paid')
    await grantUserBenefits(data.out_trade_no)  // 发放权益
  }
  
  return new Response('<xml><return_code>SUCCESS</return_code></xml>')
}
```

## 六、权限检查逻辑

```javascript
// 检查用户是否可以进行测试
function canTakeTest(testType) {
  // 优先级：VIP > 单次解锁 > 次数包
  if (checkVIP()) return true                    // VIP无限测试
  if (unlockedTests.includes(testType)) return true  // 已单独解锁
  if (testCount > 0) return true                 // 有剩余次数
  return false                                   // 需要购买
}
```

## 七、开发注意事项

1. **金额单位**：微信支付金额单位为「分」，前端显示时除以100
2. **签名算法**：当前使用 MD5，微信推荐升级到 HMAC-SHA256
3. **证书管理**：退款等操作需要商户证书，需单独申请
4. **域名配置**：小程序后台需配置合法域名（ai-pandora.xyz）
5. **回调幂等**：支付回调可能重复推送，需做幂等处理
6. **异步通知**：支付结果以微信异步通知为准，不能仅依赖前端回调
7. **订单超时**：建议设置30分钟订单超时自动关闭

## 八、待实现项（第二期）

- [ ] 支付后端 `/api/payment/create` 完整实现（统一下单）
- [ ] 支付回调 `/api/payment/notify` 完整实现（验签+发权益）
- [ ] 新定价体系代码实现（个人¥198/¥1,980 + 企业三套餐）
- [ ] 支付宝支付对接
- [ ] 对公转账流程（企业版）
- [ ] 退款接口
- [ ] 订单超时自动关闭（30分钟）
- [ ] 升级签名算法到 HMAC-SHA256
- [ ] 支付日志记录
- [ ] 存客宝自动加微信（支付成功后触发）
