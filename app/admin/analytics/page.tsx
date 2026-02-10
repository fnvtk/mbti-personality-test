"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Brain, Users, Target } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => {
      if (d.code === 200) setStats(d.data)
    })
  }, [])

  const distribution = stats?.tests?.typeDistribution || []
  const total = stats?.tests?.total || 1

  // 按分类分组
  const categories = {
    '分析师': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    '外交官': ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    '守护者': ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    '探险家': ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
  }

  const categoryColors: Record<string, string> = {
    '分析师': 'bg-purple-500',
    '外交官': 'bg-green-500',
    '守护者': 'bg-blue-500',
    '探险家': 'bg-amber-500',
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">数据分析</h1>
        <p className="text-sm text-gray-500">MBTI类型分布与用户行为分析</p>
      </div>

      {/* 分类统计 */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(categories).map(([category, types]) => {
          const count = distribution
            .filter((d: any) => types.includes(d._id))
            .reduce((sum: number, d: any) => sum + d.count, 0)
          const pct = Math.round((count / total) * 100)
          
          return (
            <Card key={category} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[category]}`} />
                  <span className="text-sm font-semibold">{category}</span>
                </div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-gray-500">{pct}% · {types.join('/')}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 完整类型分布 */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">16种类型完整分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {distribution.map((item: any) => (
              <div key={item._id} className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs font-mono font-bold text-purple-600">{item._id}</p>
                <p className="text-lg font-bold">{item.count}</p>
                <p className="text-[10px] text-gray-400">{Math.round((item.count / total) * 100)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
