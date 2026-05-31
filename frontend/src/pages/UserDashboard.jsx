import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingApi } from '../api'
import { Calendar, Clock, DollarSign, Ban, ShieldCheck, CreditCard, PlayCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function UserDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' or 'past'

  const loadBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingApi.getMyBookings()
      setBookings(res.data.results || res.data)
    } catch (err) {
      toast.error('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('razorpay_payment_id') && urlParams.get('razorpay_payment_link_id')) {
      const confirmPayment = async () => {
        const loadingToast = toast.loading('Verifying secure payment via Razorpay...')
        try {
          await bookingApi.confirmRazorpayPayment({
            razorpay_payment_id: urlParams.get('razorpay_payment_id'),
            razorpay_payment_link_id: urlParams.get('razorpay_payment_link_id'),
            razorpay_payment_link_reference_id: urlParams.get('razorpay_payment_link_reference_id'),
            razorpay_payment_link_status: urlParams.get('razorpay_payment_link_status'),
            razorpay_signature: urlParams.get('razorpay_signature'),
          })
          toast.dismiss(loadingToast)
          toast.success('Payment verified! Your seat is booked.')
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
          loadBookings()
        } catch (err) {
          toast.dismiss(loadingToast)
          toast.error('Payment verification failed or was cancelled.')
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
          loadBookings()
        }
      }
      confirmPayment()
    } else {
      loadBookings()
    }
  }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingApi.updateBookingStatus(bookingId, 'cancelled')
      toast.success('Booking cancelled successfully!')
      loadBookings()
    } catch (err) {
      toast.error('Failed to cancel booking.')
    }
  }

  const handlePay = async (bookingId) => {
    try {
      toast.loading('Redirecting to Razorpay payment portal...')
      const res = await bookingApi.createRazorpayOrder(bookingId)
      if (res.data && res.data.short_url) {
        window.location.href = res.data.short_url
      } else {
        toast.dismiss()
        toast.error('Failed to generate payment link.')
      }
    } catch (err) {
      toast.dismiss()
      toast.error('Failed to start checkout session.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-blue-150 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
      case 'failed': return 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-450'
    }
  }

  const filterBookings = () => {
    const now = new Date()
    return bookings.filter((b) => {
      const sessionDate = new Date(b.session.start_time)
      const isPast = sessionDate < now
      if (activeTab === 'upcoming') {
        return !isPast && b.status !== 'cancelled'
      } else {
        return isPast || b.status === 'cancelled'
      }
    })
  }

  const filtered = filterBookings()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            My Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Browse and manage your active live workshop reservations.
          </p>
        </header>

        {/* Tab switchers */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8 space-x-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'upcoming'
                ? 'border-primary text-primary'
                : 'border-transparent text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'past'
                ? 'border-primary text-primary'
                : 'border-transparent text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Past & Cancelled
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl p-6">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No sessions found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {activeTab === 'upcoming' ? "You don't have any upcoming bookings scheduled." : "No past history found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/40 relative shadow-sm"
              >
                <div>
                  {/* Top info and status */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full font-bold text-zinc-600 dark:text-zinc-350">
                      {booking.session.category?.name}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-4 leading-tight">
                    {booking.session.title}
                  </h3>

                  {/* Creator Info */}
                  <div className="flex items-center space-x-2 mt-3">
                    <img
                      src={booking.session.creator?.display_avatar}
                      alt={booking.session.creator?.username}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Hosted by {booking.session.creator?.first_name || booking.session.creator?.username}
                    </span>
                  </div>

                  {/* Dates & duration */}
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-primary" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {new Date(booking.session.start_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className="text-primary" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{booking.session.duration_minutes} Mins</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                  <div className="mt-6 flex items-center space-x-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                    {booking.status === 'confirmed' && (
                      <Link
                        to={`/courses/${booking.id}`}
                        className="flex-grow py-3 bg-gradient-to-r from-violet-600 to-indigo-650 text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-violet-500/10 text-center"
                      >
                        <PlayCircle size={14} />
                        <span>Start Learning</span>
                      </Link>
                    )}
                    {booking.payment_status === 'pending' && !booking.session.is_free && (
                      <button
                        onClick={() => handlePay(booking.id)}
                        className="flex-grow py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10"
                      >
                        <CreditCard size={14} />
                        <span>Pay & Complete Book</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-3 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold rounded-2xl flex items-center space-x-1 transition-colors shrink-0"
                    >
                      <Ban size={14} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
