import React from 'react'
import Link from 'next/link'
// import { ThemeSwitcher } from './ThemeSwitcher'

const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 dark:bg-primary-800 text-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-primary-200 transition-colors">
          DataDuck
        </Link>
        <div className="flex items-center space-x-6">
          <ul className="hidden md:flex space-x-6">
            <li><NavLink href="/upload">Upload</NavLink></li>
            <li><NavLink href="/analyze">Analyze</NavLink></li>
            <li><NavLink href="/visualize">Visualize</NavLink></li>
          </ul>
          {/* <ThemeSwitcher /> */}
        </div>
      </nav>
    </header>
  )
}

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="hover:text-primary-200 transition-colors font-medium">
    {children}
  </Link>
)

export default Header