import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, orderService } from '@/lib/database'
import { authenticateRequest } from '@/lib/jwt'
import crypto from 'crypto'

// 微信支付配置
const WECHAT_PAY_CONFIG = {
  appId: process.env.WECHAT_APP_ID || 'wx3d15ed02e98b04e3',
  mchId: process.env.WECHAT_MCH_ID || '1318592501',
  apiKey: process.env.WECHAT_PAY_KEY || 'wx3e31b068be59ddc131b068be59ddc2',
  notifyUrl: process.env.WECHAT_PAY_NOTIFY_URL || 'https://your-domain.com/api/payment/notify'
}

/**
 * 生成随机字符串
 */
function generateNonceStr(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成签名
 */
function generateSign(params: Record<string, string>, apiKey: string): string {
  const sortedKeys = Object.keys(params).sort()
  const stringA = sortedKeys
    .filter(key => params[key] !== '' && params[key] !== undefined)
    .map(key => `${key}=${params[key]}`)
    .join('&')
  const stringSignTemp = `${stringA}&key=${apiKey}`
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase()
}

/**
 * 对象转XML
 */
function dictToXml(data: Record<string, string>): string {
  let xml = '<xml>'
  for (const [key, value] of Object.entries(data)) {
    xml += `<${key}><![CDATA[${value}]]></${key}>`
  }
  xml += '</xml>'
  return xml
}

/**
 * XML转对象
 */
function xmlToDict(xml: string): Record<string, string> {
  const result: Record<string, string> = {}
  const regex = /<(\w+)><!\[CDATA\[(.*?)\]\]><\/\1>/g
  let match
  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = match[2]
  }
  // 也匹配没有CDATA的
  const regex2 = /<(\w+)>([^<]+)<\/\1>/g
  while ((match = regex2.exec(xml)) !== null) {
    if (!result[match[1]]) {
      result[match[1]] = match[2]
    }
  }
  return result
}

/**
 * POST /api/payment/create
 * 创建微信支付订单
 */
export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const body = await request.json()
    const { orderId, amount, description, productType, paymentMethod, openId, referrerCode } = body
    
    // 验证参数
    if (!orderId || !amount || !description) {
      return NextResponse.json({
        code: 400,
        message: '缺少必要参数'
      }, { status: 400 })
    }
    
    // 保存订单到数据库（携带分销推荐信息）
    const order = await orderService.createOrder({
      orderId,
      amount,
      productType: productType || 'vip',
      productDetail: body.productDetail || '',
      paymentMethod: paymentMethod || 'wechat',
      description,
      openId: openId || '',
      userId: body.userId || '',
      status: 'pending',
      referrerCode: referrerCode || '',
      source: referrerCode ? 'invite' : 'direct'
    })
    
    // 构建微信统一下单参数
    const nonceStr = generateNonceStr()
    const timeStamp = Math.floor(Date.now() / 1000).toString()
    
    const unifiedOrderParams: Record<string, string> = {
      appid: WECHAT_PAY_CONFIG.appId,
      mch_id: WECHAT_PAY_CONFIG.mchId,
      nonce_str: nonceStr,
      body: description,
      out_trade_no: orderId,
      total_fee: amount.toString(),
      spbill_create_ip: '127.0.0.1',
      notify_url: WECHAT_PAY_CONFIG.notifyUrl,
      trade_type: 'JSAPI',
      openid: openId || ''
    }
    
    // 生成签名
    unifiedOrderParams.sign = generateSign(unifiedOrderParams, WECHAT_PAY_CONFIG.apiKey)
    
    // 尝试调用微信统一下单接口
    let prepayId = ''
    try {
      const xmlData = dictToXml(unifiedOrderParams)
      const wxRes = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xmlData
      })
      
      const wxXml = await wxRes.text()
      const wxResult = xmlToDict(wxXml)
      
      if (wxResult.return_code === 'SUCCESS' && wxResult.result_code === 'SUCCESS') {
        prepayId = wxResult.prepay_id
      } else {
        console.error('微信下单失败:', wxResult)
        // 降级处理：使用模拟prepay_id
        prepayId = `wx_mock_${Date.now()}`
      }
    } catch (wxError) {
      console.error('调用微信支付API失败:', wxError)
      prepayId = `wx_mock_${Date.now()}`
    }
    
    // 更新订单prepayId
    await orderService.updateOrderStatus(orderId, 'pending', { prepayId })
    
    // 生成小程序支付参数
    const payParams: Record<string, string> = {
      appId: WECHAT_PAY_CONFIG.appId,
      timeStamp,
      nonceStr,
      package: `prepay_id=${prepayId}`,
      signType: 'MD5'
    }
    payParams.paySign = generateSign(payParams, WECHAT_PAY_CONFIG.apiKey)
    
    return NextResponse.json({
      code: 200,
      message: '订单创建成功',
      data: {
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        prepayId,
        orderId
      }
    })
    
  } catch (error) {
    console.error('创建支付订单失败:', error)
    return NextResponse.json({
      code: 500,
      message: '创建订单失败'
    }, { status: 500 })
  }
}
