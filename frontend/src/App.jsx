import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Layouts
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'

// Pages
import Home from './pages/Home'
import SessionDetail from './pages/SessionDetail'
import AuthCallback from './pages/AuthCallback'
import UserDashboard from './pages/UserDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import CourseContent from './pages/CourseContent'

// Guard for authenticated users
function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuthStore()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-55 dark:bg-zinc-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/" replace />
}

export default function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Toast Notifier */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
              borderRadius: '1rem',
              border: '1px solid hsl(var(--border))',
              fontSize: '0.875rem',
            },
          }}
        />

        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sessions/:id" element={<SessionDetail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Guarded Dashboard Pages */}
            <Route
              path="/dashboard/user"
              element={
                <AuthGuard>
                  <UserDashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard/creator"
              element={
                <AuthGuard>
                  <CreatorDashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="/courses/:bookingId"
              element={
                <AuthGuard>
                  <CourseContent />
                </AuthGuard>
              }
            />

            {/* fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  )
}
