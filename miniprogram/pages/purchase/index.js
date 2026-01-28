// pages/purchase/index.js
const payment = require('../../utils/payment')

Page({
  data: {
    isVIP: false,
    vipExpireText: '',
    testCount: 0,
    selectedVIP: 'quarter', // 默认选中季度
    selectedCount: 0,
    purchaseType: 'vip', // 'vip' | 'count'
    totalPrice: '49.9',
    purchasing: false
  },

  onLoad() {
    this.loadUserBenefits()
  },

  onShow() {
    this.loadUserBenefits()
  },

  // 加载用户权益
  loadUserBenefits() {
    const benefits = payment.getUserBenefits()
    
    let vipExpireText = ''
    if (benefits.isVIP && benefits.vipInfo) {
      const expireDate = new Date(benefits.vipInfo.expireDate)
      if (benefits.vipInfo.vipType === 'lifetime') {
        vipExpireText = '永久有效'
      } else {
        const year = expireDate.getFullYear()
        const month = String(expireDate.getMonth() + 1).padStart(2, '0')
        const day = String(expireDate.getDate()).padStart(2, '0')
        vipExpireText = `有效期至 ${year}-${month}-${day}`
      }
    }
    
    this.setData({
      isVIP: benefits.isVIP,
      vipExpireText,
      testCount: benefits.testCount
    })
  },

  // 选择VIP套餐
  selectVIP(e) {
    const type = e.currentTarget.dataset.type
    const prices = {
      month: '19.9',
      quarter: '49.9',
      year: '99',
      lifetime: '199'
    }
    
    this.setData({
      selectedVIP: type,
      selectedCount: 0,
      purchaseType: 'vip',
      totalPrice: prices[type]
    })
  },

  // 选择次数包
  selectCount(e) {
    const count = parseInt(e.currentTarget.dataset.count)
    const prices = {
      1: '3.9',
      10: '29',
      50: '99'
    }
    
    this.setData({
      selectedVIP: '',
      selectedCount: count,
      purchaseType: 'count',
      totalPrice: prices[count]
    })
  },

  // 购买单次测试
  buySingle(e) {
    const type = e.currentTarget.dataset.type
    const names = {
      mbti: 'MBTI性格测试',
      disc: 'DISC行为测试',
      pdp: 'PDP动物性格',
      ai: 'AI人脸分析'
    }
    const prices = {
      mbti: '9.9',
      disc: '6.9',
      pdp: '6.9',
      ai: '19.9'
    }
    
    wx.showModal({
      title: `解锁${names[type]}`,
      content: `支付 ¥${prices[type]} 永久解锁该测试`,
      confirmText: '立即解锁',
      confirmColor: '#F43F5E',
      success: (res) => {
        if (res.confirm) {
          this.purchaseSingleTest(type)
        }
      }
    })
  },

  // 购买单次测试
  purchaseSingleTest(type) {
    this.setData({ purchasing: true })
    
    payment.purchaseSingleTest(type, 
      () => {
        this.setData({ purchasing: false })
        this.loadUserBenefits()
        wx.showToast({
          title: '解锁成功',
          icon: 'success'
        })
      },
      () => {
        this.setData({ purchasing: false })
      }
    )
  },

  // 处理购买
  handlePurchase() {
    if (this.data.purchasing) return
    
    this.setData({ purchasing: true })
    
    if (this.data.purchaseType === 'vip' && this.data.selectedVIP) {
      // 购买VIP
      payment.purchaseVIP(this.data.selectedVIP,
        () => {
          this.setData({ purchasing: false })
          this.loadUserBenefits()
          wx.showToast({
            title: '开通成功',
            icon: 'success'
          })
        },
        () => {
          this.setData({ purchasing: false })
        }
      )
    } else if (this.data.purchaseType === 'count' && this.data.selectedCount > 0) {
      // 购买次数
      payment.purchaseTestCount(this.data.selectedCount,
        () => {
          this.setData({ purchasing: false })
          this.loadUserBenefits()
          wx.showToast({
            title: '购买成功',
            icon: 'success'
          })
        },
        () => {
          this.setData({ purchasing: false })
        }
      )
    } else {
      this.setData({ purchasing: false })
      wx.showToast({
        title: '请选择套餐',
        icon: 'none'
      })
    }
  },

  onShareAppMessage() {
    return {
      title: 'MBTI性格测试 - 开通VIP，无限畅测',
      path: '/pages/purchase/index'
    }
  }
})
