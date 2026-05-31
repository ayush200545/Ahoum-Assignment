import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { 
  Calendar, Clock, DollarSign, Users, Award, ShieldAlert, ArrowLeft, Send,
  CheckCircle2, ChevronDown, ChevronUp, BookOpen, Sparkles, Unlock, ListChecks 
} from 'lucide-react'
import { sessionApi, bookingApi } from '../api'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setIsLoginOpen } = useAuthStore()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasBooked, setHasBooked] = useState(false)
  
  // Accordion curriculum control
  const [expandedModules, setExpandedModules] = useState([0])
  
  const [pendingBooking, setPendingBooking] = useState(null)

  const toggleModule = (index) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter((i) => i !== index))
    } else {
      setExpandedModules([...expandedModules, index])
    }
  }

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true)
      try {
        const res = await sessionApi.getSession(id)
        setSession(res.data)

        // Check if user has already booked this session (only if authenticated)
        const hasToken = !!localStorage.getItem('access_token')
        if (hasToken) {
          try {
            const bookingsRes = await bookingApi.getMyBookings()
            const myBookings = bookingsRes.data.results || bookingsRes.data
            const booked = myBookings.some((b) => b.session?.id === parseInt(id))
            setHasBooked(booked)
          } catch (bookingErr) {
            console.error('Failed to load user bookings status (likely expired token)', bookingErr)
          }
        }
      } catch (err) {
        toast.error('Failed to load session details.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [id, user])

  const handleBooking = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    try {
      // 1. Create booking
      const res = await bookingApi.createBooking({
        session_id: session.id,
        notes,
      })

      const newBooking = res.data

      if (session.is_free) {
        toast.success('Successfully registered for session!')
        navigate('/dashboard/user')
      } else {
        // Fetch real Razorpay Payment Link from backend
        toast.loading('Redirecting to secure payment portal...')
        const orderRes = await bookingApi.createRazorpayOrder(newBooking.id)
        
        // Redirect to the Razorpay hosted payment page
        if (orderRes.data && orderRes.data.short_url) {
          window.location.href = orderRes.data.short_url
        } else {
          toast.dismiss()
          toast.error('Failed to generate payment link.')
        }
      }
    } catch (err) {
      const errMsg = err.response?.data ? Object.values(err.response.data).flat().join(', ') : 'Booking failed'
      toast.error(errMsg)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const isCreator = user?.id === session.creator?.id
  const formatPrice = (price) => {
    const val = parseFloat(price)
    return val === 0 ? 'Free' : `₹${val.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16 transition-colors duration-300">
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-zinc-500 hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          <span>Back to catalog</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN: Details ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Banner Cover */}
            <div className="h-96 w-full rounded-3xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-600 relative border border-zinc-200/20 shadow-lg">
              {session.image ? (
                <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 opacity-90 flex items-center justify-center">
                  <span className="text-8xl">{session.category?.icon || '🎯'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 shadow-sm backdrop-blur-sm">
                  <span>{session.category?.icon}</span>
                  <span className="ml-1.5">{session.category?.name}</span>
                </span>
              </div>
            </div>

            {/* Core Info */}
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                {session.title}
              </h1>

              {/* Tags */}
              {Array.isArray(session.tags) && session.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {session.tags.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-150 mt-8 border-b border-zinc-100 dark:border-zinc-850 pb-2">
                About This Session
              </h3>
              <p className="mt-4 text-zinc-600 dark:text-zinc-350 leading-relaxed whitespace-pre-line text-sm">
                {session.description}
              </p>

              {/* Benefits: What you'll learn */}
              {Array.isArray(session.benefits) && session.benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-850 pb-2 flex items-center space-x-2">
                    <Sparkles className="text-violet-500" size={18} />
                    <span>What you'll learn</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {session.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start space-x-2 text-zinc-650 dark:text-zinc-350 text-sm">
                        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Curriculum Accordion */}
              {Array.isArray(session.curriculum) && session.curriculum.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-850 pb-2 flex items-center space-x-2">
                    <BookOpen className="text-indigo-500" size={18} />
                    <span>Course Curriculum</span>
                  </h3>
                  <div className="mt-4 space-y-3">
                    {session.curriculum.map((module, i) => {
                      const isExpanded = expandedModules.includes(i)
                      return (
                        <div key={i} className="border border-zinc-250 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20">
                          <button
                            type="button"
                            onClick={() => toggleModule(i)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30 transition-colors text-sm"
                          >
                            <div className="flex items-center space-x-3 pr-4">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              <span>{module.title || `Module ${i + 1}`}</span>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="text-xs text-zinc-400 font-medium">{module.duration}</span>
                              {isExpanded ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                            </div>
                          </button>

                          {isExpanded && Array.isArray(module.topics) && (
                            <div className="px-5 pb-4 pt-1 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/10 space-y-2">
                              {module.topics.map((topic, topicIdx) => (
                                <div key={topicIdx} className="flex items-center space-x-2.5 text-zinc-650 dark:text-zinc-350 text-xs py-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-350 dark:bg-zinc-600 shrink-0" />
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {Array.isArray(session.requirements) && session.requirements.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-850 pb-2 flex items-center space-x-2">
                    <ListChecks className="text-amber-500" size={18} />
                    <span>Requirements</span>
                  </h3>
                  <ul className="mt-4 space-y-2 text-zinc-650 dark:text-zinc-350 text-sm">
                    {session.requirements.map((req, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-primary shrink-0 mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Creator Panel */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={session.creator?.display_avatar}
                alt={session.creator?.username}
                className="w-20 h-20 rounded-3xl border border-zinc-200 dark:border-zinc-800 object-cover shadow-sm"
              />
              <div className="flex-grow text-center sm:text-left">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-violet-100 dark:bg-violet-950/40 rounded-full text-[10px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-widest">
                  <Award size={10} />
                  <span>Verified Creator</span>
                </span>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                  {session.creator?.first_name} {session.creator?.last_name}
                </h4>
                <p className="text-xs font-semibold text-zinc-400">@{session.creator?.username}</p>
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {session.creator?.bio || "No biography provided by the creator."}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Booking Widget ── */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 sticky top-24 shadow-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">
                  Admission Fee
                </span>
                <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mt-1.5 font-sans">
                  {formatPrice(session.price)}
                </span>
              </div>

              <div className="mt-6 space-y-4 border-t border-b border-zinc-100 dark:border-zinc-800/80 py-6 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Schedule</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-250">
                      {new Date(session.start_time).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-primary" />
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Duration</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-250">{session.duration_minutes} Minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users size={18} className="text-primary" />
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Availability</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-250">
                      {session.spots_remaining === 0 ? (
                        <span className="text-red-500 font-bold">Sold Out</span>
                      ) : (
                        `${session.spots_remaining} of ${session.max_participants} seats open`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                {!user ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        toast.success('Opening credentials dialog...')
                        setIsLoginOpen(true)
                      }}
                      className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-2xl hover:brightness-110 active:scale-98 transition-all text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2"
                    >
                      <Unlock size={16} />
                      <span>Login to Book Seat</span>
                    </button>
                    <p className="text-[10px] text-center text-zinc-400 font-medium">
                      🔒 You must be signed in to reserve your seat.
                    </p>
                  </div>
                ) : isCreator ? (
                  <button
                    disabled
                    className="w-full py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-bold rounded-2xl cursor-not-allowed text-sm"
                  >
                    You Created This Session
                  </button>
                ) : hasBooked ? (
                  <Link
                    to="/dashboard/user"
                    className="w-full py-4 block bg-emerald-500 text-white font-bold rounded-2xl text-center text-sm shadow-md shadow-emerald-500/10 hover:brightness-110 transition-all"
                  >
                    Booked Already — Open Dashboard
                  </Link>
                ) : session.spots_remaining === 0 ? (
                  <button
                    disabled
                    className="w-full py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-450 dark:text-zinc-550 font-bold rounded-2xl cursor-not-allowed text-sm"
                  >
                    Sold Out
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:brightness-110 active:scale-98 transition-all text-sm shadow-lg shadow-primary/20"
                  >
                    Book Seat Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Confirmation Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50">Confirm Reservation</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              You are booking a seat on: <span className="font-bold text-zinc-700 dark:text-zinc-300">{session.title}</span>
            </p>

            <form onSubmit={handleBooking} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Special Notes / Questions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. I want to learn about context API..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                ></textarea>
              </div>

              {/* Alert notice */}
              {!session.is_free && (
                <div className="flex items-start space-x-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs border border-amber-150/20">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <span>
                    This is a paid session. You will pay securely using Razorpay to complete your booking of {formatPrice(session.price)}.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-2xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send size={12} />
                  <span>{bookingLoading ? 'Processing...' : 'Confirm Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )

}
