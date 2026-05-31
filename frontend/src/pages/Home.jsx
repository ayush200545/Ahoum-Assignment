import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { sessionApi } from '../api'
import SessionCard from '../components/shared/SessionCard'
import SkeletonCard from '../components/shared/SkeletonCard'

export default function Home() {
  const [sessions, setSessions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('-created_at')

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const res = await sessionApi.getCategories()
        setCategories(res.data.results || res.data)
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      try {
        const params = {
          ordering: sortBy,
        }
        if (searchTerm) params.search = searchTerm
        if (selectedCategory) params.category = selectedCategory

        const res = await sessionApi.getSessions(params)
        setSessions(res.data.results || res.data)
      } catch (err) {
        console.error('Failed to load sessions', err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search slightly
    const delayDebounceFn = setTimeout(() => {
      fetchSessions()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* ── HERO BANNER with animated gradient background ── */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 dark:from-zinc-950 dark:via-purple-950/20 dark:to-zinc-950 text-white border-b border-zinc-200/10">
        
        {/* Animated Gradient Ambient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.2),transparent)] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-white/15"
          >
            <Sparkles size={12} className="text-violet-400" />
            <span>Discover Expert-Led Workshops</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-150 to-zinc-350 font-sans"
          >
            Connect, Learn, and<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Grow in Live Sessions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl mx-auto mt-6 text-base sm:text-lg text-zinc-300 font-medium"
          >
            Book personalized interactive workshops from industry specialists. Zero friction, instant setup.
          </motion.p>
        </div>
      </section>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="glass-panel p-4 rounded-3xl shadow-xl dark:shadow-zinc-950/40 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 border border-zinc-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md">
          
          {/* Search box */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by keywords, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-white transition-all placeholder:text-zinc-500 dark:placeholder:text-zinc-400 font-medium"
            />
          </div>

          {/* sorting and filters */}
          <div className="flex space-x-3 items-center">
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-3.5 text-zinc-400 dark:text-zinc-500" size={16} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-8 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-800 dark:text-white font-medium cursor-pointer transition-all"
              >
                <option value="-created_at" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">Latest Added</option>
                <option value="price" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">Price: Low to High</option>
                <option value="-price" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">Price: High to Low</option>
                <option value="start_time" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">Nearest Start Date</option>
              </select>
            </div>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold transition-colors text-zinc-700 dark:text-zinc-300"
              >
                Clear Category
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 w-full">
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
              selectedCategory === ''
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <span>🎯</span>
            <span>All Catalog</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── SESSION CATALOG GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 w-full flex-grow">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-card rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No sessions found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Try adjusting your keyword searches or category selections.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SessionCard session={session} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
