"use client"

import { Home, Camera, User } from "lucide-react"
import Link from "next/link"

interface BottomNavProps {
  currentPath: string
}

export default function BottomNav({ currentPath }: BottomNavProps) {
  return (
    <div className="flex justify-around items-center p-4 border-t bg-white">
      <Link
        href="/"
        className={`flex flex-col items-center ${currentPath === "/" ? "text-purple-600" : "text-gray-500"}`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">首页</span>
      </Link>
      <Link
        href="/camera"
        className={`flex flex-col items-center ${
          currentPath === "/ai-test" ||
          currentPath === "/camera" ||
          currentPath === "/analysis" ||
          currentPath === "/report" ||
          currentPath.includes("result")
            ? "text-purple-600"
            : "text-gray-500"
        }`}
      >
        <div
          className={`rounded-full p-3 -mt-8 shadow-lg ${
            currentPath === "/ai-test" ||
            currentPath === "/camera" ||
            currentPath === "/analysis" ||
            currentPath === "/report" ||
            currentPath.includes("result")
              ? "bg-purple-600"
              : "bg-gray-400"
          }`}
        >
          <Camera className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs mt-1">查看报告</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center ${currentPath === "/profile" || currentPath.startsWith("/profile/") ? "text-purple-600" : "text-gray-500"}`}
      >
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">我的</span>
      </Link>
    </div>
  )
}
