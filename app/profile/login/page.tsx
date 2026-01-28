"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    router.push("/profile")
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">登录</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              手机号/邮箱
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入手机号或邮箱"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              密码
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700">
            登录
          </Button>

          <div className="flex justify-between text-sm">
            <Link href="/profile/forgot-password" className="text-purple-600">
              忘记密码
            </Link>
            <Link href="/profile/register" className="text-purple-600">
              注册账号
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
