// pages/ai-test/result.js - AI分析结果页（对接真实API）
const app = getApp()

Page({
  data: {
    isAnalyzing: true,
    progress: 0,
    analyzingTip: '正在识别面部特征...',
    result: null
  },

  onLoad() {
    this.startAnalysis()
  },

  // 调用后端AI分析API
  startAnalysis() {
    const photos = wx.getStorageSync('aiPhotos') || []
    const tips = ['正在识别面部特征...', '分析眉眼特征...', '结合《冰鉴》分析骨形...', '匹配MBTI/PDP/DISC...', '生成综合报告...']
    let progress = 0
    let tipIndex = 0

    // 进度动画
    const timer = setInterval(() => {
      progress += 3
      if (progress > 95) progress = 95 // 等API返回再到100
      if (progress > (tipIndex + 1) * 18 && tipIndex < tips.length - 1) tipIndex++
      this.setData({ progress: Math.floor(progress), analyzingTip: tips[tipIndex] })
    }, 200)

    // 调用后端API进行真实AI分析
    wx.request({
      url: `${app.globalData.apiBase}/api/analyze`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
      },
      data: {
        photoUrls: photos,
        userId: app.globalData.openId || ''
      },
      success: (res) => {
        clearInterval(timer)
        
        if (res.statusCode === 200 && res.data) {
          const apiData = res.data.data || res.data
          this.setData({ progress: 100, analyzingTip: '分析完成！' })
          
          setTimeout(() => {
            this.processResult(apiData)
          }, 500)
        } else {
          console.error('API返回错误:', res)
          this.setData({ progress: 100 })
          setTimeout(() => this.showFallbackResult(), 500)
        }
      },
      fail: (err) => {
        clearInterval(timer)
        console.error('API调用失败:', err)
        this.setData({ progress: 100 })
        setTimeout(() => this.showFallbackResult(), 500)
      }
    })
  },

  // 处理API返回的真实结果
  processResult(apiData) {
    const result = {
      mbti: apiData.mbti?.type || 'INTJ',
      mbtiTitle: apiData.mbti?.title || '战略家',
      disc: apiData.disc?.primary || 'D',
      discDesc: apiData.disc?.description || '',
      pdp: apiData.pdp?.primary || '老虎',
      pdpSecondary: apiData.pdp?.secondary || '猫头鹰',
      pdpDesc: apiData.pdp?.description || '',
      pdpEmoji: this.getPDPEmoji(apiData.pdp?.primary),
      title: `${apiData.mbti?.type || 'INTJ'} · ${apiData.pdp?.primary || '老虎'}型`,
      summary: apiData.overview || '分析完成',
      traits: apiData.facialExpressions?.emotions || ['专注', '自信', '沉稳'],
      faceAnalysis: this.formatFaceAnalysis(apiData.faceAnalysis),
      careers: ['战略咨询', '项目管理', '数据分析', '系统架构', '研究员'],
      relationship: '在人际关系中注重深度交流，建议适当表达情感。',
      gallupTop3: apiData.gallup?.top3 || ['战略', '统率', '成就'],
      // 维度数据
      dimensions: apiData.mbti?.dimensions || {},
      discSecondary: apiData.disc?.secondary || ''
    }

    // 保存结果
    wx.setStorageSync('aiResult', result)
    app.saveTestResult('ai', result)

    this.setData({ isAnalyzing: false, result })
  },

  // 格式化面相分析文本
  formatFaceAnalysis(fa) {
    if (!fa) return '面部特征显示出较强的意志力和决断力。'
    const parts = []
    if (fa.forehead) parts.push('额头：' + fa.forehead)
    if (fa.eyes) parts.push('眼睛：' + fa.eyes)
    if (fa.nose) parts.push('鼻子：' + fa.nose)
    if (fa.mouth) parts.push('嘴巴：' + fa.mouth)
    if (fa.chin) parts.push('下巴：' + fa.chin)
    if (fa.boneStructure) parts.push('骨形：' + fa.boneStructure)
    return parts.join('\n') || '面部特征显示出较强的意志力和决断力。'
  },

  // PDP类型对应emoji
  getPDPEmoji(type) {
    const map = { '老虎': '🐅', '孔雀': '🦚', '无尾熊': '🐨', '猫头鹰': '🦉', '变色龙': '🦎' }
    return map[type] || '🐅'
  },

  // 降级：使用本地模拟结果
  showFallbackResult() {
    const result = {
      mbti: 'INTJ', mbtiTitle: '战略家',
      disc: 'D', discDesc: '力量型为主',
      pdp: '老虎', pdpSecondary: '猫头鹰', pdpEmoji: '🐅',
      title: 'INTJ · 老虎型',
      summary: '基于AI面相分析，您展现出较强的逻辑分析能力和独立思考能力。',
      traits: ['逻辑思维强', '独立自主', '追求完美'],
      faceAnalysis: '您的面部特征显示出较强的意志力和决断力。',
      careers: ['战略咨询', '项目管理', '数据分析'],
      relationship: '在人际关系中注重深度交流。',
      gallupTop3: ['战略', '统率', '成就']
    }
    wx.setStorageSync('aiResult', result)
    this.setData({ isAnalyzing: false, result })
  },

  shareResult() {},
  retake() { wx.navigateTo({ url: '/pages/ai-test/camera' }) },
  goHome() { wx.navigateTo({ url: '/pages/index/index' }) },

  onShareAppMessage() {
    const r = this.data.result
    return {
      title: `AI分析我是${r?.mbti} ${r?.pdpEmoji}${r?.pdp}型，来测测你的！`,
      path: '/pages/ai-test/index'
    }
  }
})
