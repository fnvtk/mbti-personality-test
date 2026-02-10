"use client"
import { useRouter } from "next/navigation"
import { PhoneVerification } from "@/components/phone-verification"

export default function PhoneVerificationPage() {
  const router = useRouter()

  const handleComplete = () => {
    // 验证完成后跳转到首页或其他页面
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center p-4 border-b">
        <button onClick={() => router.back()} className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-medium flex-1 text-center">手机号验证</h1>
        <div className="w-10"></div>
      </div>

      <PhoneVerification onComplete={handleComplete} />
    </div>
  )
}
