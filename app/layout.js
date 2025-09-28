import './globals.css'

export const metadata = {
  title: 'Restaurant AI - Next Generation Dining',
  description: 'AI-powered restaurant management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
