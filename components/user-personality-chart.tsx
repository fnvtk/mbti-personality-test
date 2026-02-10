"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserPersonalityChartProps {
  mbtiScores?: {
    E?: number
    I?: number
    S?: number
    N?: number
    T?: number
    F?: number
    J?: number
    P?: number
  }
  pdpScores?: {
    tiger?: number
    peacock?: number
    koala?: number
    owl?: number
    chameleon?: number
  }
  discScores?: {
    D?: number
    I?: number
    S?: number
    C?: number
  }
}

export function UserPersonalityChart({ mbtiScores, pdpScores, discScores }: UserPersonalityChartProps) {
  const mbtiCanvasRef = useRef<HTMLCanvasElement>(null)
  const pdpCanvasRef = useRef<HTMLCanvasElement>(null)
  const discCanvasRef = useRef<HTMLCanvasElement>(null)

  // 绘制MBTI雷达图
  useEffect(() => {
    if (!mbtiCanvasRef.current || !mbtiScores) return

    const canvas = mbtiCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // 绘制背景
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.stroke()

    // 绘制内部圆环
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // 绘制轴线
    const dimensions = ["E/I", "S/N", "T/F", "J/P"]
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]

    dimensions.forEach((dim, i) => {
      const angle = angles[i]
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 1
      ctx.stroke()

      // 绘制标签
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)
      ctx.fillText(dim, labelX, labelY)
    })

    // 计算数据点
    const dataPoints = [
      { value: mbtiScores.E || 0, opposite: mbtiScores.I || 0 },
      { value: mbtiScores.S || 0, opposite: mbtiScores.N || 0 },
      { value: mbtiScores.T || 0, opposite: mbtiScores.F || 0 },
      { value: mbtiScores.J || 0, opposite: mbtiScores.P || 0 },
    ]

    const normalizedPoints = dataPoints.map((point) => {
      const total = point.value + point.opposite
      return total > 0 ? point.value / total : 0.5
    })

    // 绘制数据多边形
    ctx.beginPath()
    normalizedPoints.forEach((value, i) => {
      const angle = angles[i]
      const distance = value * radius
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
    ctx.fill()
    ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
    ctx.lineWidth = 2
    ctx.stroke()

    // 绘制数据点
    normalizedPoints.forEach((value, i) => {
      const angle = angles[i]
      const distance = value * radius
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(59, 130, 246, 1)"
      ctx.fill()
    })
  }, [mbtiScores])

  // 绘制PDP雷达图
  useEffect(() => {
    if (!pdpCanvasRef.current || !pdpScores) return

    const canvas = pdpCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // 绘制背景
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.stroke()

    // 绘制内部圆环
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // 绘制轴线
    const dimensions = ["老虎", "孔雀", "无尾熊", "猫头鹰", "变色龙"]
    const numDimensions = dimensions.length
    const angles = Array.from({ length: numDimensions }, (_, i) => (i * 2 * Math.PI) / numDimensions)

    dimensions.forEach((dim, i) => {
      const angle = angles[i]
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 1
      ctx.stroke()

      // 绘制标签
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)
      ctx.fillText(dim, labelX, labelY)
    })

    // 计算数据点
    const dataPoints = [
      pdpScores.tiger || 0,
      pdpScores.peacock || 0,
      pdpScores.koala || 0,
      pdpScores.owl || 0,
      pdpScores.chameleon || 0,
    ]

    // 找出最大值用于归一化
    const maxValue = Math.max(...dataPoints, 1) // 至少为1，避免除以0

    // 绘制数据多边形
    ctx.beginPath()
    dataPoints.forEach((value, i) => {
      const angle = angles[i]
      const normalizedValue = value / maxValue
      const distance = normalizedValue * radius
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fillStyle = "rgba(245, 158, 11, 0.2)"
    ctx.fill()
    ctx.strokeStyle = "rgba(245, 158, 11, 0.8)"
    ctx.lineWidth = 2
    ctx.stroke()

    // 绘制数据点
    dataPoints.forEach((value, i) => {
      const angle = angles[i]
      const normalizedValue = value / maxValue
      const distance = normalizedValue * radius
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(245, 158, 11, 1)"
      ctx.fill()
    })
  }, [pdpScores])

  // 绘制DISC雷达图
  useEffect(() => {
    if (!discCanvasRef.current || !discScores) return

    const canvas = discCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // 绘制背景
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.stroke()

    // 绘制内部圆环
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    // 绘制轴线
    const dimensions = ["D型", "I型", "S型", "C型"]
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]

    dimensions.forEach((dim, i) => {
      const angle = angles[i]
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 1
      ctx.stroke()

      // 绘制标签
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)
      ctx.fillText(dim, labelX, labelY)
    })

    // 计算数据点
    const dataPoints = [discScores.D || 0, discScores.I || 0, discScores.S || 0, discScores.C || 0]

    // 找出最大值用于归一化
    const maxValue = Math.max(...dataPoints, 1) // 至少为1，避免除以0

    // 绘制数据多边形
    ctx.beginPath()
    dataPoints.forEach((value, i) => {
      const angle = angles[i]
      const normalizedValue = value / maxValue
      const distance = normalizedValue * radius
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)"
    ctx.fill()
    ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
    ctx.lineWidth = 2
    ctx.stroke()

    // 绘制数据点
    dataPoints.forEach((value, i) => {
      const angle = angles[i]
      const normalizedValue = value / maxValue
      const distance = normalizedValue * radius
      const x = centerX + distance * Math.cos(angle)
      const y = centerY + distance * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(16, 185, 129, 1)"
      ctx.fill()
    })
  }, [discScores])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {mbtiScores && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">MBTI维度分析</CardTitle>
            <CardDescription>性格类型偏好分布</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas ref={mbtiCanvasRef} width={200} height={200} className="w-full h-auto" />
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="flex justify-between">
                <span>外向 (E):</span>
                <span className="font-medium">{mbtiScores.E || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>内向 (I):</span>
                <span className="font-medium">{mbtiScores.I || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>感觉 (S):</span>
                <span className="font-medium">{mbtiScores.S || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>直觉 (N):</span>
                <span className="font-medium">{mbtiScores.N || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>思考 (T):</span>
                <span className="font-medium">{mbtiScores.T || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>情感 (F):</span>
                <span className="font-medium">{mbtiScores.F || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>判断 (J):</span>
                <span className="font-medium">{mbtiScores.J || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>感知 (P):</span>
                <span className="font-medium">{mbtiScores.P || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pdpScores && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">PDP类型分析</CardTitle>
            <CardDescription>个人发展剖析</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas ref={pdpCanvasRef} width={200} height={200} className="w-full h-auto" />
            <div className="grid grid-cols-1 gap-2 mt-4 text-xs">
              <div className="flex justify-between">
                <span>老虎:</span>
                <span className="font-medium">{pdpScores.tiger || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>孔雀:</span>
                <span className="font-medium">{pdpScores.peacock || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>无尾熊:</span>
                <span className="font-medium">{pdpScores.koala || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>猫头鹰:</span>
                <span className="font-medium">{pdpScores.owl || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>变色龙:</span>
                <span className="font-medium">{pdpScores.chameleon || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {discScores && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">DISC行为风格</CardTitle>
            <CardDescription>行为风格评估</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas ref={discCanvasRef} width={200} height={200} className="w-full h-auto" />
            <div className="grid grid-cols-1 gap-2 mt-4 text-xs">
              <div className="flex justify-between">
                <span>支配型 (D):</span>
                <span className="font-medium">{discScores.D || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>影响型 (I):</span>
                <span className="font-medium">{discScores.I || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>稳定型 (S):</span>
                <span className="font-medium">{discScores.S || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>服从型 (C):</span>
                <span className="font-medium">{discScores.C || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
