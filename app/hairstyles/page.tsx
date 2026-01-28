"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowLeft, Sparkles, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import BottomNav from "@/components/bottom-nav"

const categories = ["全部", "女士", "男士"]
const lengths = ["全部", "长发", "中发", "短发"]

const hairstyles = [
  { id: 1, name: "法式刘海", gender: "女士", length: "中发", image: "/chinese-woman-french-bangs-hairstyle-elegant.jpg", hot: true },
  { id: 2, name: "慵懒大波浪", gender: "女士", length: "长发", image: "/chinese-woman-lazy-waves-long-hair-beautiful.jpg", hot: true },
  { id: 3, name: "高马尾", gender: "女士", length: "长发", image: "/chinese-woman-high-ponytail-hairstyle-sporty.jpg", hot: false },
  { id: 4, name: "空气刘海", gender: "女士", length: "中发", image: "/chinese-woman-air-bangs-korean-style-cute.jpg", hot: true },
  { id: 5, name: "复古港风", gender: "女士", length: "长发", image: "/chinese-woman-hong-kong-retro-hairstyle-glamorous.jpg", hot: false },
  { id: 6, name: "精灵短发", gender: "女士", length: "短发", image: "/chinese-woman-pixie-cut-short-hair-chic.jpg", hot: false },
  { id: 7, name: "锁骨发", gender: "女士", length: "中发", image: "/chinese-woman-collarbone-length-hair-trendy.jpg", hot: true },
  { id: 8, name: "羊毛卷", gender: "女士", length: "长发", image: "/chinese-woman-wool-curl-perm-hairstyle-cute.jpg", hot: false },
  { id: 9, name: "日系碎发", gender: "女士", length: "短发", image: "/chinese-woman-japanese-bob-hairstyle-natural.jpg", hot: false },
  { id: 10, name: "公主切", gender: "女士", length: "中发", image: "/chinese-woman-hime-cut-princess-hairstyle-elegant.jpg", hot: true },
  { id: 11, name: "寸头", gender: "男士", length: "短发", image: "/chinese-man-buzz-cut-short-hair-clean.jpg", hot: false },
  { id: 12, name: "纹理烫", gender: "男士", length: "短发", image: "/chinese-man-textured-perm-hairstyle-trendy.jpg", hot: true },
  { id: 13, name: "油头背梳", gender: "男士", length: "短发", image: "/chinese-man-slick-back-hairstyle-formal.jpg", hot: false },
  { id: 14, name: "中分微卷", gender: "男士", length: "中发", image: "/chinese-man-middle-part-wavy-hair-korean-style.jpg", hot: true },
  { id: 15, name: "韩式刘海", gender: "男士", length: "短发", image: "/chinese-man-korean-bangs-hairstyle-handsome.jpg", hot: true },
  {
    id: 16,
    name: "两边铲",
    gender: "男士",
    length: "短发",
    image: "/placeholder.svg?height=400&width=300",
    hot: false,
  },
  {
    id: 17,
    name: "狼尾头",
    gender: "男士",
    length: "中发",
    image: "/placeholder.svg?height=400&width=300",
    hot: false,
  },
  {
    id: 18,
    name: "飞机头",
    gender: "男士",
    length: "短发",
    image: "/placeholder.svg?height=400&width=300",
    hot: false,
  },
]

export default function HairstylesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedLength, setSelectedLength] = useState("全部")
  const [searchQuery, setSearchQuery] = useState("")
  const [hasImage, setHasImage] = useState(false)

  useEffect(() => {
    const image = localStorage.getItem("uploadedImage")
    setHasImage(!!image)
  }, [])

  const filteredStyles = hairstyles.filter((style) => {
    const matchCategory = selectedCategory === "全部" || style.gender === selectedCategory
    const matchLength = selectedLength === "全部" || style.length === selectedLength
    const matchSearch = style.name.includes(searchQuery)
    return matchCategory && matchLength && matchSearch
  })

  const handleSelectStyle = (style: (typeof hairstyles)[0]) => {
    localStorage.setItem("selectedStyle", style.name)
    localStorage.setItem("selectedStyleImage", style.image)
    router.push("/generate")
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col gradient-bg pb-24">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-40 left-0 w-60 h-60 bg-red-500/10 rounded-full blur-[80px]" />
      </div>

      {/* 头部 */}
      <header className="relative z-10 glass-nav sticky top-0">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-white">发型库</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 relative z-10 px-4 py-4">
        {/* 提示 */}
        {!hasImage && (
          <div className="glass-card rounded-2xl p-4 mb-4 border border-orange-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/90 font-medium">上传照片效果更佳</p>
                <p className="text-xs text-white/50 mt-0.5">AI会根据你的脸型推荐发型</p>
              </div>
              <button
                onClick={() => router.push("/upload")}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm"
              >
                去上传
              </button>
            </div>
          </div>
        )}

        {/* 搜索 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="搜索发型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-card border-white/10 pl-11 h-12 rounded-2xl text-white placeholder:text-white/40 bg-white/5"
          />
        </div>

        {/* 筛选标签 */}
        <div className="mb-5 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                    : "glass-button text-white/70 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {lengths.map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedLength === len
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* 发型列表 */}
        <div className="grid grid-cols-2 gap-3">
          {filteredStyles.map((style) => (
            <div
              key={style.id}
              onClick={() => handleSelectStyle(style)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10 group"
            >
              <div className="aspect-[3/4] relative bg-gradient-to-br from-white/10 to-white/5">
                <Image
                  src={style.image || "/placeholder.svg"}
                  alt={style.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
                {/* 热门标签 */}
                {style.hot && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-white fill-white" />
                    <span className="text-[10px] text-white font-medium">热门</span>
                  </div>
                )}
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* 信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-semibold text-white text-sm">{style.name}</p>
                  <p className="text-xs text-white/60 mt-0.5">
                    {style.gender} · {style.length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStyles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/50">暂无符合条件的发型</p>
            <p className="text-white/30 text-sm mt-1">试试其他筛选条件</p>
          </div>
        )}
      </main>

      <BottomNav currentPath="/hairstyles" />
    </div>
  )
}
