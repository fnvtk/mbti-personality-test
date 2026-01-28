"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FeedbackPage() {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    // Handle feedback submission
    router.back()
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-[17px]">意见反馈</h1>
        <div className="w-10" />
      </div>

      <div className="p-4 flex-1">
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="请描述您遇到的问题或建议..."
          className="min-h-[200px] rounded-lg"
        />

        <p className="mt-2 text-sm text-gray-500">感谢您的反馈，我们会认真考虑您的建议</p>

        <Button className="w-full mt-6" onClick={handleSubmit} disabled={!feedback.trim()}>
          提交反馈
        </Button>
      </div>
    </div>
  )
}
