// 微信小程序配置
// 用于小程序登录、分享等功能

export const WECHAT_CONFIG = {
  // 小程序AppID
  appId: 'wx3d15ed02e98b04e3',
  
  // 小程序密钥（仅后端使用，不要暴露到前端）
  appSecret: 'a3ccdf829584b7f85143b68c4b6f7528',
  
  // API基础URL
  apiBaseUrl: 'https://api.weixin.qq.com',
  
  // 登录接口
  loginUrl: '/sns/jscode2session',
  
  // 获取AccessToken接口
  tokenUrl: '/cgi-bin/token',
}

/**
 * 获取小程序AccessToken
 * 注意：AccessToken有效期为7200秒，需要缓存使用
 */
export async function getAccessToken() {
  const url = `${WECHAT_CONFIG.apiBaseUrl}${WECHAT_CONFIG.tokenUrl}?grant_type=client_credential&appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.errcode) {
    throw new Error(`获取AccessToken失败: ${data.errmsg}`)
  }
  
  return data.access_token
}

/**
 * 小程序登录 - code换取session
 * @param code 小程序登录code
 */
export async function code2Session(code: string) {
  const url = `${WECHAT_CONFIG.apiBaseUrl}${WECHAT_CONFIG.loginUrl}?appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}&js_code=${code}&grant_type=authorization_code`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.errcode) {
    throw new Error(`登录失败: ${data.errmsg}`)
  }
  
  return {
    openid: data.openid,
    sessionKey: data.session_key,
    unionid: data.unionid, // 如果绑定了开放平台
  }
}

/**
 * 生成小程序分享图片
 */
export function generateShareConfig(type: string, result: string) {
  return {
    title: `我的${type}类型是${result}，来测测你的吧！`,
    path: `/pages/index/index?share=true&type=${type}&result=${result}`,
    imageUrl: `/images/share-${type.toLowerCase()}.png`,
  }
}

export default WECHAT_CONFIG
