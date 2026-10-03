import type { Metadata } from 'next'
import { Outfit, Inter, Manrope } from 'next/font/google'
import './globals.css'
import { TransitionProvider } from '@/components/transition-provider'
import { Providers } from '@/components/providers'
import { cn } from "@/lib/utils";

const manropeHeading = Manrope({subsets:['latin'],variable:'--font-heading'});

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Offbeat India',
  description: 'Discover offbeat travel destinations in India',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", manrope.variable, manropeHeading.variable)}>
      <body className={outfit.className}>
        <Providers>
          <TransitionProvider>{children}</TransitionProvider>
        </Providers>
      </body>
    </html>
  )
}
