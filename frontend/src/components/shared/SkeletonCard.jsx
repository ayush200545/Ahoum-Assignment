import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="glass-card flex flex-col rounded-3xl overflow-hidden shadow-sm dark:shadow-zinc-950/20 animate-pulse border border-zinc-200/50 dark:border-zinc-800/40">
      {/* Skeleton Image */}
      <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800"></div>

      {/* Skeleton Content */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Creator avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>

        {/* Title */}
        <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>

        {/* Schedule */}
        <div className="flex justify-between border-t border-zinc-150 dark:border-zinc-800/80 pt-4">
          <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>

        {/* Price & Action */}
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-1">
            <div className="h-2.5 w-10 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          </div>
          <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
}
