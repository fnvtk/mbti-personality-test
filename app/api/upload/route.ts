import { NextResponse } from "next/server"
import { uploadPhotoToBlob } from "@/lib/blob-service"
import { photoService } from "@/lib/db-service"

export async function POST(request: Request) {
  try {
    // 获取认证头
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json(
        {
          code: 401,
          message: "未提供认证信息",
        },
        { status: 401 },
      )
    }

    // 从请求中获取表单数据
    const formData = await request.formData()
    const photo = formData.get("photo") as File
    const userId = formData.get("userId") as string
    const angle = formData.get("angle") as string

    if (!photo) {
      return NextResponse.json(
        {
          code: 1,
          message: "未上传照片",
        },
        { status: 400 },
      )
    }

    if (!userId) {
      return NextResponse.json(
        {
          code: 1,
          message: "未提供用户ID",
        },
        { status: 400 },
      )
    }

    // 上传照片到Blob存储
    const photoUrl = await uploadPhotoToBlob(await photo.arrayBuffer(), userId, angle || "unknown")

    // 保存照片记录到数据库
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const timestamp = Date.now()

    await photoService.addPhoto({
      id: photoId,
      userId,
      photoUrl,
      angle: angle || "unknown",
      timestamp,
    })

    // 返回上传成功的URL
    return NextResponse.json({
      code: 0,
      message: "上传成功",
      data: {
        url: photoUrl,
        id: photoId,
      },
    })
  } catch (error) {
    console.error("上传照片时出错:", error)
    return NextResponse.json(
      {
        code: 500,
        message: `上传照片失败: ${(error as Error).message}`,
      },
      { status: 500 },
    )
  }
}
