interface PhoneVerificationProps {
  onComplete: () => void
}

export function PhoneVerification({ onComplete }: PhoneVerificationProps) {
  return (
    <div className="flex-1 p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="font-medium">申请获取并验证你的手机号</div>
          <div className="text-sm text-gray-500">订阅及资讯</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg text-center">189****7128</div>

        <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg" onClick={onComplete}>
          下一步
        </button>

        <div className="text-center">
          <button className="text-sm text-gray-500">不允许</button>
        </div>

        <div className="text-center">
          <button className="text-xs text-gray-400">使用其它号码</button>
        </div>
      </div>
    </div>
  )
}
