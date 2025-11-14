import { Geist, Geist_Mono, Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import AOSInit from '@/components/aos-init'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Anita\'s Hair Studio | Premium Hair Care',
  description: 'Experience premium hair care at Anita\'s Hair Studio. Expert stylists, modern techniques, and luxurious treatments.',
  generator: 'v0.app',
  icons: {
    icon: '/AnitaLogo.png',
    apple: '/AnitaLogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_poppins.variable} font-sans antialiased`}>
        <AOSInit />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
