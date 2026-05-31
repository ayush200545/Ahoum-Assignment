import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api'
import { User, Award, Shield, FileText, Camera, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    role: user?.role || 'user',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.display_avatar || '')

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('first_name', formData.first_name)
    data.append('last_name', formData.last_name)
    data.append('username', formData.username)
    data.append('bio', formData.bio)
    data.append('role', formData.role)
    if (avatarFile) {
      data.append('avatar', avatarFile)
    }

    try {
      const res = await authApi.updateMe(data)
      updateUser(res.data)
      toast.success('Profile updated successfully!')
      
      if (formData.role === 'creator') {
        navigate('/dashboard/creator')
      } else {
        navigate('/dashboard/user')
      }
    } catch (err) {
      toast.error('Failed to update profile settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleToggle = async () => {
    const nextRole = formData.role === 'creator' ? 'user' : 'creator'
    setLoading(true)
    try {
      const res = await authApi.updateMe({ role: nextRole })
      updateUser(res.data)
      setFormData({ ...formData, role: nextRole })
      toast.success(`Switched role to ${nextRole === 'creator' ? 'Creator' : 'Attendee'}!`)
      if (nextRole === 'creator') {
        navigate('/dashboard/creator')
      } else {
        navigate('/dashboard/user')
      }
    } catch (err) {
      toast.error('Failed to switch role.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Update your public profile, bio, and switch account type.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left panel: Avatar and Role */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card rounded-3xl p-6 flex flex-col items-center border border-zinc-200/50 dark:border-zinc-800/40 text-center shadow-sm">
              
              {/* Avatar upload trigger */}
              <div className="relative group">
                <img
                  src={avatarPreview}
                  alt={formData.username}
                  className="w-32 h-32 rounded-3xl object-cover border border-zinc-200 dark:border-zinc-850 shadow-md group-hover:brightness-90 transition-all"
                />
                <label className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-4 leading-none">
                {formData.first_name || formData.username}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">@{formData.username}</p>

              <div className="h-px w-full bg-zinc-150 dark:bg-zinc-800/80 my-6"></div>

              {/* Role Toggle Card */}
              <div className="w-full bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl p-4 text-left border border-zinc-150/10">
                <div className="flex items-center space-x-2">
                  {formData.role === 'creator' ? (
                    <Award className="text-violet-500" size={18} />
                  ) : (
                    <User className="text-indigo-500" size={18} />
                  )}
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                    {formData.role === 'creator' ? 'Creator Profile' : 'Attendee Profile'}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                  {formData.role === 'creator' 
                    ? "You can publish workshops, schedule bookings, and collect paid tickets."
                    : "You can book upcoming creator-led workshops and participate live."
                  }
                </p>
                <button
                  onClick={handleRoleToggle}
                  disabled={loading}
                  className="mt-4 w-full py-3 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center justify-center space-x-1"
                >
                  <span>Switch to {formData.role === 'creator' ? 'Attendee' : 'Creator'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Information forms */}
          <div className="md:col-span-2">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6 flex items-center space-x-2">
                <FileText size={18} className="text-primary" />
                <span>Personal Information</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="e.g. John"
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Doe"
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. johndoe"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Biography (Bio)</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Share your expertise, credentials, and achievements..."
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-850">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center space-x-1.5 min-w-[120px]"
                  >
                    <Check size={14} />
                    <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
