import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, Tag, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

export default function SessionCard({ session }) {
  const { isAuthenticated } = useAuthStore()
  
  // Format price helper
  const formatPrice = (price) => {
    const val = parseFloat(price)
    return val === 0 ? 'Free' : `₹${val.toLocaleString()}`
  }

  // Format date helper
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="glass-card flex flex-col rounded-3xl overflow-hidden shadow-sm dark:shadow-zinc-950/20 group relative h-full"
    >
      {/* Category Indicator Accent */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-sm border border-zinc-150/20">
          <span>{session.category?.icon}</span>
          <span className="ml-1.5">{session.category?.name}</span>
        </span>
      </div>

      {/* spots remaining */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black shadow-sm backdrop-blur-sm border border-white/20 ${
          session.spots_remaining === 0
            ? 'bg-red-500/95 text-white'
            : 'bg-zinc-900/85 dark:bg-black/75 text-white'
        }`}>
          {session.spots_remaining === 0 ? 'SOLD OUT' : `${session.spots_remaining} Spots Left`}
        </span>
      </div>

      {/* Card Image / Brand Gradient Fallback */}
      <div className="h-48 w-full overflow-hidden bg-gradient-to-tr from-violet-600/80 to-indigo-600/85 relative group-hover:scale-105 transition-transform duration-500">
        {session.image ? (
          <img
            src={session.image}
            alt={session.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 flex items-center justify-center">
            <span className="text-5xl">{session.category?.icon || '🎯'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={session.creator?.display_avatar}
            alt={session.creator?.username}
            className="w-6 h-6 rounded-full border border-white/40 object-cover"
          />
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            by {session.creator?.first_name || session.creator?.username}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-primary transition-colors">
          {session.title}
        </h3>
        
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 flex-grow">
          {session.description}
        </p>

        {/* Schedule & Duration */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
          <div className="flex items-center space-x-1">
            <Calendar size={14} className="text-primary" />
            <span>{formatDate(session.start_time)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} className="text-primary" />
            <span>{session.duration_minutes} Mins</span>
          </div>
        </div>

        {/* Action Button & Price */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
              Admission
            </span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 font-sans">
              {formatPrice(session.price)}
            </span>
          </div>

          {isAuthenticated ? (
            <Link
              to={`/sessions/${session.id}`}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-2xl hover:brightness-110 active:scale-95 transition-all text-sm shadow-sm"
            >
              View Details
            </Link>
          ) : (
            <Link
              to={`/sessions/${session.id}`}
              className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center space-x-1.5 transition-colors"
            >
              <Lock size={12} className="text-amber-500" />
              <span>Login to book</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
