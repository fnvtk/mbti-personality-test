// pages/result/pdp.js
Page({
  data: {
    result: null,
    typeList: [
      { type: 'Tiger', emoji: '🐅', label: '老虎型', colorClass: 'fill-tiger' },
      { type: 'Peacock', emoji: '🦚', label: '孔雀型', colorClass: 'fill-peacock' },
      { type: 'Koala', emoji: '🐨', label: '考拉型', colorClass: 'fill-koala' },
      { type: 'Owl', emoji: '🦉', label: '猫头鹰型', colorClass: 'fill-owl' },
      { type: 'Chameleon', emoji: '🦎', label: '变色龙型', colorClass: 'fill-chameleon' }
    ]
  },

  onLoad() {
    const result = wx.getStorageSync('pdpResult')
    if (result) {
      this.setData({ result })
    } else {
      wx.showToast({ title: '暂无测试结果', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  retakeTest() {
    wx.removeStorageSync('pdpResult')
    wx.redirectTo({ url: '/pages/test/pdp' })
  },

  onShareAppMessage() {
    const result = this.data.result
    return {
      title: `我的PDP类型是${result?.description?.type}${result?.description?.emoji}，来测测你的吧！`,
      path: '/pages/index/index'
    }
  }
})
