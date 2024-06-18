import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Cat URL - 在线查询网站信息',
  description: '使用 Cat URL，轻松查询任何网站的标题、描述、关键词和图标信息。快速、准确、免费地获取网站元数据。',
  keywords:
    'Cat URL, 网站信息查询, URL 信息查询, 网站元数据, 网站标题查询, 网站描述查询, 网站关键词查询, 网站图标查询, favicon 查询',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
