// pages/ai-test/index.js
Page({
  data: {},

  // 开始拍照
  startCamera() {
    wx.navigateTo({
      url: '/pages/ai-test/camera'
    })
  },

  // 上传照片
  uploadPhoto() {
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const tempFiles = res.tempFiles
        if (tempFiles.length > 0) {
          // 保存照片路径并跳转到结果页
          wx.setStorageSync('aiPhotos', tempFiles.map(f => f.tempFilePath))
          wx.navigateTo({
            url: '/pages/ai-test/result'
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: 'AI人脸性格分析 - 看看你的面相透露了什么性格密码',
      path: '/pages/ai-test/index'
    }
  }
})
