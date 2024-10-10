import { Inter } from 'next/font/google'
import { Providers } from './Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './global.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'DataDuck',
  description: 'AI-powered data analysis tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var mode = localStorage.getItem('theme');
                var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                if (!mode && supportDarkMode) document.documentElement.classList.add('dark');
                if (!mode) return;
                document.documentElement.classList.add(mode);
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body className={`${inter.variable} font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}