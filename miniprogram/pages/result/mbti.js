// pages/result/mbti.js
Page({
  data: {
    result: null,
    dimensions: []
  },

  onLoad() {
    const result = wx.getStorageSync('mbtiResult')
    if (result) {
      const dimensions = [
        { key: 'EI', left: '外向(E)', right: '内向(I)', ...result.dimensionScores.EI },
        { key: 'SN', left: '感觉(S)', right: '直觉(N)', ...result.dimensionScores.SN },
        { key: 'TF', left: '思考(T)', right: '情感(F)', ...result.dimensionScores.TF },
        { key: 'JP', left: '判断(J)', right: '知觉(P)', ...result.dimensionScores.JP }
      ]
      this.setData({ result, dimensions })
    } else {
      wx.showToast({ title: '暂无测试结果', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  retakeTest() {
    wx.removeStorageSync('mbtiResult')
    wx.redirectTo({ url: '/pages/test/mbti' })
  },

  onShareAppMessage() {
    const result = this.data.result
    return {
      title: `我的MBTI类型是${result?.mbtiType}（${result?.description?.name}），来测测你的吧！`,
      path: '/pages/index/index',
      imageUrl: '/images/share-mbti.png'
    }
  }
})
