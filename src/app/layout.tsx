import type { Metadata } from 'next'

import './global.css'
 
export const metadata: Metadata = {
  title: 'My App',
  description: 'Sample of RAG GenAI to generate summary of candidates CV',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
