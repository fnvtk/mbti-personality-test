// app.js - MBTI小程序主入口
App({
  globalData: {
    userInfo: null,
    openId: null,
    token: null,
    // API基础地址（需要替换为实际后端地址）
    apiBase: 'https://your-api-domain.com',
    // VIP信息
    vipInfo: null,
    // 测试次数
    testCount: 0,
    // 已解锁的测试
    unlockedTests: [],
    // 测试结果缓存
    mbtiResult: null,
    discResult: null,
    pdpResult: null,
    aiResult: null
  },

  onLaunch() {
    // 加载本地存储的数据
    this.loadStoredData()
    
    // 静默登录获取openId
    this.silentLogin()
  },

  // 加载本地存储数据
  loadStoredData() {
    // 用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
    
    // VIP信息
    const vipInfo = wx.getStorageSync('vipInfo')
    if (vipInfo) {
      this.globalData.vipInfo = vipInfo
    }
    
    // 测试次数
    const testCount = wx.getStorageSync('testCount')
    if (testCount) {
      this.globalData.testCount = testCount
    }
    
    // 已解锁测试
    const unlockedTests = wx.getStorageSync('unlockedTests')
    if (unlockedTests) {
      this.globalData.unlockedTests = unlockedTests
    }
    
    // 测试结果
    this.globalData.mbtiResult = wx.getStorageSync('mbtiResult') || null
    this.globalData.discResult = wx.getStorageSync('discResult') || null
    this.globalData.pdpResult = wx.getStorageSync('pdpResult') || null
    this.globalData.aiResult = wx.getStorageSync('aiResult') || null
  },

  // 静默登录
  silentLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送code到后端换取openId
          wx.request({
            url: `${this.globalData.apiBase}/api/wechat/login`,
            method: 'POST',
            data: { code: res.code },
            success: (response) => {
              if (response.statusCode === 200 && response.data.code === 200) {
                const { openId, token } = response.data.data
                this.globalData.openId = openId
                this.globalData.token = token
                wx.setStorageSync('openId', openId)
                wx.setStorageSync('token', token)
              }
            },
            fail: (err) => {
              console.error('登录失败:', err)
            }
          })
        }
      }
    })
  },

  // 获取用户信息
  getUserInfo(callback) {
    if (this.globalData.userInfo) {
      callback && callback(this.globalData.userInfo)
      return
    }
    
    wx.getUserProfile({
      desc: '用于展示用户头像和昵称',
      success: (res) => {
        this.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)
        callback && callback(res.userInfo)
      },
      fail: () => {
        callback && callback(null)
      }
    })
  },

  // 保存测试结果
  saveTestResult(type, result) {
    const key = `${type}Result`
    wx.setStorageSync(key, result)
    this.globalData[key] = result
    
    // 同步到服务器
    if (this.globalData.token) {
      wx.request({
        url: `${this.globalData.apiBase}/api/test/save`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${this.globalData.token}`
        },
        data: {
          type,
          result,
          timestamp: new Date().toISOString()
        }
      })
    }
  },

  // 获取测试结果
  getTestResult(type) {
    return this.globalData[`${type}Result`] || wx.getStorageSync(`${type}Result`) || null
  }
})
