"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// 数据库管理已整合到超管后台
export default function AdminDatabaseRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/superadmin/database")
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">正在跳转到超管后台...</p>
    </div>
  )
}
