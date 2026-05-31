import React, { useEffect, useState } from 'react'
import { sessionApi, bookingApi } from '../api'
import { Calendar, Clock, Edit2, Trash2, Plus, Users, Check, Ban } from 'lucide-react'
import toast from 'react-hot-toast'
import SessionFormModal from '../components/shared/SessionFormModal'
import { motion } from 'framer-motion'

export default function CreatorDashboard() {
  const [sessions, setSessions] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sessions') // 'sessions' or 'bookings'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const sessRes = await sessionApi.getMySessions()
      setSessions(sessRes.data.results || sessRes.data)

      const bookRes = await bookingApi.getCreatorBookings()
      setBookings(bookRes.data.results || bookRes.data)
    } catch (err) {
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return
    try {
      await sessionApi.deleteSession(id)
      toast.success('Session deleted successfully!')
      loadData()
    } catch (err) {
      toast.error('Failed to delete session.')
    }
  }

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, status)
      toast.success(`Booking status updated to ${status}!`)
      loadData()
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Creator Hub
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Organize events, review attendees, and track workshop metrics.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSession(null)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center space-x-1.5 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all w-fit"
          >
            <Plus size={16} />
            <span>Create Session</span>
          </button>
        </header>

        {/* Tabs switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8 space-x-6">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'sessions'
                ? 'border-primary text-primary'
                : 'border-transparent text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            My Sessions
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'bookings'
                ? 'border-primary text-primary'
                : 'border-transparent text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Bookings & Attendees
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : activeTab === 'sessions' ? (
          /* ── MY SESSIONS GRID ── */
          sessions.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl p-6">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No sessions published</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Click "Create Session" in the top right to launch your first session.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/40 relative shadow-sm"
                >
                  <div>
                    {/* Status accent */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full font-bold text-zinc-600 dark:text-zinc-350">
                        {session.category?.name}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        session.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30' : 'bg-zinc-150 text-zinc-800 dark:bg-zinc-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-4 leading-tight">
                      {session.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                      {session.description}
                    </p>

                    {/* Meta stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
                      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-2 rounded-xl">
                        <p className="text-[9px] text-zinc-400 uppercase">Admission</p>
                        <p className="text-xs font-black mt-0.5 text-zinc-800 dark:text-zinc-200 font-sans">
                          {parseFloat(session.price) === 0 ? 'Free' : `₹${parseFloat(session.price)}`}
                        </p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-2 rounded-xl">
                        <p className="text-[9px] text-zinc-400 uppercase">Duration</p>
                        <p className="text-xs font-black mt-0.5 text-zinc-800 dark:text-zinc-200">{session.duration_minutes}m</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-2 rounded-xl">
                        <p className="text-[9px] text-zinc-400 uppercase">Attendees</p>
                        <p className="text-xs font-black mt-0.5 text-zinc-800 dark:text-zinc-200">
                          {session.bookings_count} / {session.max_participants}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-6 flex items-center space-x-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                    <button
                      onClick={() => {
                        setSelectedSession(session)
                        setIsModalOpen(true)
                      }}
                      className="flex-grow py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold rounded-2xl flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Edit2 size={12} />
                      <span>Edit Info</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="px-4 py-3 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold rounded-2xl flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ── BOOKINGS OVERVIEW TABLE ── */
          bookings.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl p-6">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-zinc-850 dark:text-zinc-200">No bookings yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Attendees will appear here once bookings start rolling in.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                  <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-[10px] text-zinc-400 uppercase tracking-widest font-black text-left">
                    <tr>
                      <th className="px-6 py-4">Attendee</th>
                      <th className="px-6 py-4">Session Info</th>
                      <th className="px-6 py-4">Reserved On</th>
                      <th className="px-6 py-4">Status / Payment</th>
                      <th className="px-6 py-4">Special Notes</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/80 text-sm text-zinc-700 dark:text-zinc-300">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                        {/* Attendee info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={booking.user?.display_avatar}
                              alt={booking.user?.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-zinc-100">{booking.user?.first_name || booking.user?.username}</p>
                              <p className="text-xs text-zinc-450 dark:text-zinc-500">{booking.user?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Session title */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-[200px]">{booking.session.title}</p>
                          <p className="text-[10px] text-zinc-400">{booking.session.category?.name}</p>
                        </td>

                        {/* Date booked */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {new Date(booking.booked_at).toLocaleDateString()}
                        </td>

                        {/* Status badges */}
                        <td className="px-6 py-4 whitespace-nowrap space-y-1">
                          <div className="flex space-x-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                              {booking.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-350">
                              {booking.payment_status}
                            </span>
                          </div>
                        </td>

                        {/* Notes */}
                        <td className="px-6 py-4">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">
                            {booking.notes || <span className="text-zinc-400 dark:text-zinc-600">None</span>}
                          </p>
                        </td>

                        {/* Confirm / Cancel status action triggers */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          {booking.status !== 'cancelled' ? (
                            <div className="flex justify-end space-x-2">
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                  className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                                  title="Confirm booking"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                className="p-2 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                                title="Cancel booking"
                              >
                                <Ban size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-red-500 font-bold">Cancelled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      {/* Session creation modal */}
      <SessionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessionToEdit={selectedSession}
        onSuccess={loadData}
      />
    </div>
  )
}
