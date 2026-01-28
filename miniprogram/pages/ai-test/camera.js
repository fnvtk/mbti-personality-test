// pages/ai-test/camera.js
Page({
  data: {
    photos: [],
    photoIndex: 0,
    guideTexts: ['请正对镜头', '请向左转45°', '请向右转45°'],
    guideText: '请正对镜头'
  },

  onLoad() {
    this.cameraContext = wx.createCameraContext()
  },

  // 拍照
  takePhoto() {
    if (this.data.photos.length >= 3) {
      wx.showToast({ title: '已拍满3张', icon: 'none' })
      return
    }

    this.cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        const photos = [...this.data.photos, res.tempImagePath]
        const photoIndex = photos.length
        const guideText = this.data.guideTexts[photoIndex] || '拍摄完成'
        
        this.setData({
          photos,
          photoIndex,
          guideText
        })

        if (photos.length === 3) {
          wx.showToast({ title: '拍摄完成', icon: 'success' })
        }
      },
      fail: (err) => {
        wx.showToast({ title: '拍照失败', icon: 'none' })
        console.error('拍照失败:', err)
      }
    })
  },

  // 删除照片
  deletePhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.photos.filter((_, i) => i !== index)
    const photoIndex = photos.length
    const guideText = this.data.guideTexts[photoIndex] || '请正对镜头'
    
    this.setData({
      photos,
      photoIndex,
      guideText
    })
  },

  // 完成拍照，开始分析
  completeCapture() {
    wx.setStorageSync('aiPhotos', this.data.photos)
    wx.navigateTo({
      url: '/pages/ai-test/result'
    })
  },

  // 相机错误
  onCameraError(e) {
    console.error('相机错误:', e)
    wx.showModal({
      title: '相机权限',
      content: '请允许使用相机权限以进行AI人脸分析',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting()
        }
      }
    })
  }
})
