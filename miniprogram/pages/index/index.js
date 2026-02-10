// pages/index/index.js - 首页逻辑
const app = getApp()

Page({
  data: {
    bossTeam: [
      { type: "ENTJ", name: "镇山的虎", emoji: "🐯" },
      { type: "ESTJ", name: "敏捷的豹", emoji: "🐆" },
      { type: "INTJ", name: "远见的鹰", emoji: "🦅" },
      { type: "ISTP", name: "善战的狼", emoji: "🐺" },
      { type: "ENTP", name: "狡诈的狐", emoji: "🦊" }
    ],
    realTeam: [
      { type: "ENFP", name: "装饭的桶", emoji: "🪣" },
      { type: "ENFJ", name: "看门的狗", emoji: "🐕" },
      { type: "ENTP", name: "搅屎的棍", emoji: "🥢" },
      { type: "ISTJ", name: "生产的驴", emoji: "🫏" },
      { type: "ESFP", name: "出头的鸟", emoji: "🐦" },
      { type: "INTP", name: "划水的鱼", emoji: "🐟" },
      { type: "ISFJ", name: "做猴的鸡", emoji: "🐔" },
      { type: "ESTP", name: "害群的马", emoji: "🐴" },
      { type: "INFP", name: "退堂的鼓", emoji: "🥁" }
    ]
  },

  onLoad() {},
  onShow() {},

  goToAITest() {
    wx.navigateTo({ url: '/pages/ai-test/index' })
  },
  goToMBTI() {
    wx.navigateTo({ url: '/pages/test/mbti' })
  },
  goToDISC() {
    wx.navigateTo({ url: '/pages/test/disc' })
  },
  goToPDP() {
    wx.navigateTo({ url: '/pages/test/pdp' })
  },
  goToProfile() {
    wx.navigateTo({ url: '/pages/profile/index' })
  },
  goToPricing() {
    wx.navigateTo({ url: '/pages/purchase/index' })
  },

  onShareAppMessage() {
    return {
      title: '神仙团队AI性格测试 - 发现你的MBTI类型',
      path: '/pages/index/index'
    }
  }
})
