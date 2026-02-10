"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// 企业管理已迁移至超管端，自动重定向
export default function AdminEnterprisePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/superadmin/enterprises")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500">企业管理已迁移至超管端，正在跳转...</p>
      </div>
    </div>
  )
}
