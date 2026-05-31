import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:items-center md:justify-between text-zinc-500 dark:text-zinc-400 text-sm">
        <div>
          &copy; {new Date().getFullYear()} Sessionly Marketplace. All rights reserved.
        </div>
        <div className="mt-4 md:mt-0 flex justify-center space-x-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  )
}
