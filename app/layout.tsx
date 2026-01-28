import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'MBTI人格测试 - 神仙团队AI性格分析',
  description: '专业的MBTI、DISC、PDP人格测试系统，支持个人版和企业版，AI智能分析您的性格类型',
  keywords: 'MBTI, 性格测试, 人格测试, DISC, PDP, 职业性格, 团队分析',
  authors: [{ name: '卡若' }],
  generator: 'Next.js',
  applicationName: 'MBTI人格测试',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MBTI测试',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
