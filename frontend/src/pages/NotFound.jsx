import React from 'react'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-55 dark:bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 text-center transition-colors">
      <div className="glass-card rounded-3xl p-8 sm:p-12 w-full max-w-md border border-zinc-200/50 dark:border-zinc-800/40 shadow-xl">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/20 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass size={32} className="animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        
        <h1 className="text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none font-sans">
          404
        </h1>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mt-4 leading-tight">
          Page Not Found
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
          The coordinates you entered did not resolve to an active workshop path.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          Return Home Catalog
        </Link>
      </div>
    </div>
  )
}
