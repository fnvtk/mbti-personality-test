"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Share } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ShareTemplate {
  id: number
  content: string
  images: string[]
}

export default function ShareMomentsPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate | null>(null)

  // Simulated backend data
  const shareTemplates: ShareTemplate[] = [
    {
      id: 1,
      content: "刚刚用AI面诊测试了我的肌肤状态，准确度很高！推荐大家也来试试～",
      images: Array(4).fill("/placeholder.svg"),
    },
    {
      id: 2,
      content: "AI智能检测肌肤问题，还能获得专业护肤建议，太神奇了！",
      images: Array(6).fill("/placeholder.svg"),
    },
  ]

  const handleShare = () => {
    // Handle WeChat Moments sharing logic here
    router.back()
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px]">分享到朋友圈</h1>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {/* Content Editor */}
        <Card className="mb-4">
          <div className="p-4 space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="说点什么..."
              className="min-h-[100px] border-none shadow-none resize-none"
            />

            {/* Image Grid */}
            {selectedTemplate && (
              <div className="grid grid-cols-3 gap-1">
                {selectedTemplate.images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Share Templates */}
        <h2 className="text-sm font-medium mb-2">分享模板</h2>
        <div className="space-y-4">
          {shareTemplates.map((template) => (
            <Card
              key={template.id}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setContent(template.content)
                setSelectedTemplate(template)
              }}
            >
              <p className="text-sm mb-3">{template.content}</p>
              <div className="grid grid-cols-3 gap-1">
                {template.images.slice(0, 9).map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Template ${template.id} preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-white border-t">
        <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={handleShare}>
          分享到朋友圈
        </Button>
      </div>
    </div>
  )
}
