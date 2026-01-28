import { put } from "@vercel/blob"

/**
 * 将照片上传到Blob存储
 * @param photoData 照片数据（ArrayBuffer）
 * @param userId 用户ID
 * @param angle 照片角度
 * @returns 上传后的URL
 */
export async function uploadPhotoToBlob(photoData: ArrayBuffer, userId: string, angle: string): Promise<string> {
  try {
    // 创建文件名
    const timestamp = Date.now()
    const filename = `${userId}_${angle}_${timestamp}.jpg`

    // 将ArrayBuffer转换为Blob
    const blob = new Blob([photoData], { type: "image/jpeg" })

    // 上传到Vercel Blob
    const { url } = await put(filename, blob, {
      access: "public",
    })

    return url
  } catch (error) {
    console.error("上传照片到Blob存储失败:", error)
    throw new Error(`上传照片失败: ${(error as Error).message}`)
  }
}

/**
 * 从Blob URL获取照片
 * @param url Blob URL
 * @returns 照片数据
 */
export async function getPhotoFromBlob(url: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`获取照片失败: ${response.status} ${response.statusText}`)
    }
    return await response.arrayBuffer()
  } catch (error) {
    console.error("从Blob获取照片失败:", error)
    throw new Error(`获取照片失败: ${(error as Error).message}`)
  }
}
