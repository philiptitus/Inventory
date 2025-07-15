import type { Metadata } from 'next'
import './globals.css'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'YIS',
  description: 'Inventory System',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://www.youthfund.go.ke/wp-content/uploads/2016/08/logo2.jpg" type="image/jpeg" />
      </head>
      <body>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
