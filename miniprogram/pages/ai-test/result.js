// pages/ai-test/result.js
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

  // 模拟AI分析过程
  startAnalysis() {
    const tips = [
      '正在识别面部特征...',
      '分析眉眼特征...',
      '分析面部轮廓...',
      '匹配性格数据库...',
      '生成综合报告...'
    ]

    let progress = 0
    let tipIndex = 0

    const timer = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(timer)
        
        setTimeout(() => {
          this.showResult()
        }, 500)
      }

      if (progress > (tipIndex + 1) * 20 && tipIndex < tips.length - 1) {
        tipIndex++
      }

      this.setData({
        progress: Math.floor(progress),
        analyzingTip: tips[tipIndex]
      })
    }, 300)
  },

  // 显示分析结果
  showResult() {
    // 模拟AI分析结果
    const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
    const discTypes = ['D', 'I', 'S', 'C']
    const pdpTypes = [
      { type: '老虎型', emoji: '🐅' },
      { type: '孔雀型', emoji: '🦚' },
      { type: '考拉型', emoji: '🐨' },
      { type: '猫头鹰型', emoji: '🦉' },
      { type: '变色龙型', emoji: '🦎' }
    ]

    const mbti = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)]
    const disc = discTypes[Math.floor(Math.random() * discTypes.length)]
    const pdp = pdpTypes[Math.floor(Math.random() * pdpTypes.length)]

    const result = {
      mbti: mbti,
      disc: disc,
      pdp: pdp.type,
      pdpEmoji: pdp.emoji,
      title: `${mbti} · ${pdp.type}`,
      summary: `根据AI面相分析，您的MBTI类型为${mbti}，属于${pdp.type}性格。您具有独特的个人魅力和领导潜质，善于思考和分析问题。`,
      traits: ['逻辑思维强', '独立自主', '追求完美', '善于规划', '注重效率'],
      faceAnalysis: '您的面部特征显示出较强的意志力和决断力。眉眼有神，显示出敏锐的洞察力；鼻梁挺直，代表着坚定的性格；下颌轮廓分明，表明您是一个目标明确、执行力强的人。',
      careers: ['企业管理', '战略顾问', '产品经理', '数据分析', '投资顾问'],
      relationship: '在人际关系中，您倾向于建立深度而非广度的社交网络。您重视真诚和理性的交流，对亲密关系有较高的期望。建议适当表达情感，增进与他人的情感连接。'
    }

    // 保存结果
    wx.setStorageSync('aiResult', result)

    this.setData({
      isAnalyzing: false,
      result: result
    })
  },

  // 分享结果
  shareResult() {
    // 触发分享
  },

  // 重新分析
  retake() {
    wx.navigateTo({
      url: '/pages/ai-test/camera'
    })
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
      fail: () => {
        wx.navigateTo({
          url: '/pages/index/index'
        })
      }
    })
  },

  onShareAppMessage() {
    const result = this.data.result
    return {
      title: `AI分析我是${result?.mbti} ${result?.pdpEmoji}${result?.pdp}，来测测你的吧！`,
      path: '/pages/ai-test/index'
    }
  }
})
