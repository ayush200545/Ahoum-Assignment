import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, FileText, CheckCircle2, ChevronRight, MessageSquare, Download, Users, Star, Award, ShieldCheck, Heart } from 'lucide-react'
import { bookingApi } from '../api'
import toast from 'react-hot-toast'

export default function CourseContent() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Interactive Syllabus Playlist
  const [activeLectureIdx, setActiveLectureIdx] = useState(0)
  const [activeTab, setActiveTab] = useState('notes') // notes, resources, discussion
  
  // Discussion state
  const [comments, setComments] = useState([
    { id: 1, name: 'Siddharth R.', role: 'Student', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', text: 'This lecture is absolutely phenomenal! The explanation of architecture patterns made it click instantly.', time: '2 hours ago', likes: 12, liked: false },
    { id: 2, name: 'Apoorva K.', role: 'Student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', text: 'Can anyone share the GitHub repository link for the deployment branch? Stumbled on step 4 of Docker integration.', time: '5 hours ago', likes: 4, liked: false },
    { id: 3, name: 'John Doe', role: 'Instructor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80', text: 'Great question, Apoorva! Just uploaded the final Docker Compose YAML in the Resources tab. Feel free to clone it!', time: '4 hours ago', likes: 8, liked: false }
  ])
  const [newComment, setNewComment] = useState('')

  // Pre-configured lectures content
  const lectures = [
    {
      title: '1. Course Introduction & Welcome',
      duration: '10:15',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      description: 'Welcome to the workshop! In this introduction lecture, we will cover the roadmap, setup our environment, and outline what you will achieve by the end of the course.',
      notes: 'Make sure you have Node.js v18+ and Docker Desktop installed on your machine before proceeding to module 2.'
    },
    {
      title: '2. Core Principles & Architecture',
      duration: '22:40',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      description: 'Dive deep into structural architectural choices, state management design patterns, and optimizing application routing protocols for robust scalability.',
      notes: 'Focus points:\n- Containerization models\n- Decoupled state management\n- Data hydration protocols'
    },
    {
      title: '3. Hands-on Interactive Practical',
      duration: '45:10',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Grab your terminal! We build the central database repositories, configure environment values, and deploy the backend container system sequentially.',
      notes: 'Download the source code templates in the "Resources" tab to code along with the session instructor!'
    },
    {
      title: '4. Testing, Security & Guarding',
      duration: '18:30',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Implement secure JWT user authorization headers, rate-limiting guards, and write thorough unit tests using standard mock frameworks.',
      notes: 'Remember to verify all environment keys in staging. Do not commit actual private keys into public version control.'
    },
    {
      title: '5. Production Deployment & CI/CD',
      duration: '14:05',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Wrap up the journey! Set up auto-deploy hooks, configure domain records, enable SSL, and set up alert notifications for runtime server exceptions.',
      notes: 'Congratulations on completing this masterclass workshop! Remember to claim your certificate of completion.'
    }
  ]

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true)
      try {
        const res = await bookingApi.getMyBookings()
        const myBookings = res.data.results || res.data
        const found = myBookings.find((b) => b.id === parseInt(bookingId))
        if (found) {
          setBooking(found)
        } else {
          toast.error('Reservation not found.')
          navigate('/dashboard/user')
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load course details.')
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [bookingId])

  const handleLike = (id) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          liked: !c.liked,
          likes: c.liked ? c.likes - 1 : c.likes + 1
        }
      }
      return c
    }))
  }

  const handlePostComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newObj = {
      id: comments.length + 1,
      name: 'Jane Doe',
      role: 'Student (You)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
      text: newComment,
      time: 'Just now',
      likes: 0,
      liked: false
    }

    setComments([newObj, ...comments])
    setNewComment('')
    toast.success('Comment posted successfully!')
  }

  const triggerDownload = (fileName) => {
    toast.success(`Downloading ${fileName}...`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-55 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const currentLecture = lectures[activeLectureIdx]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      
      {/* ── LMS Header ── */}
      <header className="bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/user"
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">
              {booking?.session.category?.name || 'Workshop Class'}
            </span>
            <h1 className="text-sm sm:text-base font-bold line-clamp-1 text-zinc-100">
              {booking?.session.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-full font-bold border border-emerald-500/20">
          <ShieldCheck size={14} />
          <span className="hidden sm:inline">Active Admission</span>
          <span className="sm:hidden">Active</span>
        </div>
      </header>

      {/* ── Main Dashboard Split View ── */}
      <div className="flex-grow flex flex-col lg:flex-row">
        
        {/* Left Column: Premium Video Player & Resource Tabs */}
        <div className="flex-grow lg:w-3/4 p-4 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Custom HTML5 Video Player Container */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
            <video
              key={currentLecture.videoUrl}
              src={currentLecture.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
            />
          </div>

          {/* Lecture Details Title */}
          <div className="border-b border-zinc-850 pb-5">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-50">
              {currentLecture.title}
            </h2>
            <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
              {currentLecture.description}
            </p>
          </div>

          {/* Details & Interactive Resource Tabs */}
          <div>
            {/* Tabs selector */}
            <div className="flex border-b border-zinc-850 mb-6 space-x-6">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Lecture Notes
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'resources'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Resources (3)
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`pb-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'discussion'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Discussion ({comments.length})
              </button>
            </div>

            <div className="bg-zinc-900/35 border border-zinc-850 rounded-2xl p-6 min-h-[160px]">
              <AnimatePresence mode="wait">
                
                {/* LECTURE NOTES */}
                {activeTab === 'notes' && (
                  <motion.div
                    key="tab-notes"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-4 text-sm text-zinc-300 leading-relaxed"
                  >
                    <div className="flex items-center space-x-2 text-violet-400">
                      <FileText size={16} />
                      <span className="font-bold uppercase tracking-wider text-[10px]">Key Focus & Prerequisites</span>
                    </div>
                    <p className="whitespace-pre-line bg-zinc-950/45 p-4 rounded-xl border border-zinc-850 font-mono text-xs text-zinc-400">
                      {currentLecture.notes}
                    </p>
                    <p>
                      Use the seek bar to review key intervals. This workshop outline represents the core curriculum compiled in collaboration with leading technical experts.
                    </p>
                  </motion.div>
                )}

                {/* DOWNLOADABLE RESOURCES */}
                {activeTab === 'resources' && (
                  <motion.div
                    key="tab-resources"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-3"
                  >
                    {[
                      { name: 'Lecture_Slides_Complete.pdf', size: '4.8 MB' },
                      { name: 'Full_Source_Code_Templates.zip', size: '12.4 MB' },
                      { name: 'Syllabus_CheatSheet.pdf', size: '1.2 MB' }
                    ].map((res) => (
                      <div
                        key={res.name}
                        className="flex items-center justify-between p-3.5 bg-zinc-950/50 hover:bg-zinc-950 border border-zinc-850 rounded-xl transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText size={16} className="text-violet-400" />
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">{res.name}</span>
                            <span className="text-[10px] text-zinc-500">{res.size}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerDownload(res.name)}
                          className="p-2 bg-zinc-800 hover:bg-zinc-755 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* DISCUSSION THREAD */}
                {activeTab === 'discussion' && (
                  <motion.div
                    key="tab-discussion"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-6"
                  >
                    {/* Add comment form */}
                    <form onSubmit={handlePostComment} className="flex items-start space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                        alt="Jane Doe"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-grow space-y-2">
                        <textarea
                          placeholder="Ask a question or share some thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={2}
                          className="w-full bg-zinc-950/60 border border-zinc-850 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-violet-500 placeholder-zinc-600 resize-none"
                        />
                        <div className="text-right">
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-bold shadow-md hover:shadow-violet-600/10 transition-colors"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Comments list */}
                    <div className="space-y-4">
                      {comments.map((c) => (
                        <div key={c.id} className="flex space-x-3 p-3 bg-zinc-950/20 border border-zinc-850/60 rounded-xl">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-zinc-200">{c.name}</span>
                                <span className={`text-[8px] font-black uppercase ml-2 px-1.5 py-0.5 rounded ${
                                  c.role === 'Instructor' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-800 text-zinc-450'
                                }`}>
                                  {c.role}
                                </span>
                              </div>
                              <span className="text-[9px] text-zinc-550">{c.time}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                              {c.text}
                            </p>
                            
                            <div className="mt-2.5 flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() => handleLike(c.id)}
                                className={`flex items-center space-x-1 text-[10px] font-semibold transition-colors ${
                                  c.liked ? 'text-pink-500' : 'text-zinc-550 hover:text-zinc-350'
                                }`}
                              >
                                <Heart size={10} className={c.liked ? 'fill-pink-500' : ''} />
                                <span>{c.likes} likes</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Syllabus Playlist Sidebar */}
        <div className="lg:w-1/4 bg-zinc-950/40 border-l border-zinc-850 p-4 sm:p-6 overflow-y-auto">
          <h3 className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-4">
            Workshop Lectures Playlist
          </h3>
          
          <div className="space-y-2">
            {lectures.map((lecture, idx) => (
              <button
                key={lecture.title}
                onClick={() => setActiveLectureIdx(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  idx === activeLectureIdx
                    ? 'bg-violet-600/10 border-violet-500 text-white'
                    : 'bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  idx === activeLectureIdx ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-450'
                }`}>
                  <Play size={12} className={idx === activeLectureIdx ? 'fill-white' : ''} />
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-bold block line-clamp-1">{lecture.title}</span>
                  <span className="text-[10px] text-zinc-550 block mt-0.5">{lecture.duration} Mins</span>
                </div>
                {idx < activeLectureIdx && (
                  <CheckCircle2 size={12} className="text-emerald-500 shrink-0 self-center" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl text-center space-y-3">
            <span className="text-xl">🏆</span>
            <div>
              <span className="text-xs font-bold block text-zinc-200">Claim Workshop Certificate</span>
              <p className="text-[9px] text-zinc-500 mt-1">Complete all lectures to unlock certification.</p>
            </div>
            <button
              disabled
              className="w-full py-2 bg-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 cursor-not-allowed"
            >
              Locked (20% Completed)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
