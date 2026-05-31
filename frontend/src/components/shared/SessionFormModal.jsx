import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Calendar, Clock, DollarSign, ListCollapse } from 'lucide-react'
import { sessionApi } from '../../api'
import toast from 'react-hot-toast'

export default function SessionFormModal({ isOpen, onClose, sessionToEdit, onSuccess }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '0',
    duration_minutes: '60',
    max_participants: '10',
    start_time: '',
    tags: '',
    status: 'published'
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

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
    if (sessionToEdit) {
      setFormData({
        title: sessionToEdit.title,
        description: sessionToEdit.description,
        category_id: sessionToEdit.category?.id || '',
        price: sessionToEdit.price,
        duration_minutes: sessionToEdit.duration_minutes,
        max_participants: sessionToEdit.max_participants,
        start_time: sessionToEdit.start_time ? new Date(sessionToEdit.start_time).toISOString().slice(0, 16) : '',
        tags: Array.isArray(sessionToEdit.tags) ? sessionToEdit.tags.join(', ') : '',
        status: sessionToEdit.status || 'published'
      })
      setImagePreview(sessionToEdit.image || '')
    } else {
      setFormData({
        title: '',
        description: '',
        category_id: '',
        price: '0',
        duration_minutes: '60',
        max_participants: '10',
        start_time: '',
        tags: '',
        status: 'published'
      })
      setImageFile(null)
      setImagePreview('')
    }
  }, [sessionToEdit, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Build FormData
    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === 'tags') {
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        data.append('tags', JSON.stringify(tagsArray))
      } else {
        data.append(key, formData[key])
      }
    })

    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      if (sessionToEdit) {
        await sessionApi.updateSession(sessionToEdit.id, data)
        toast.success('Session updated successfully!')
      } else {
        await sessionApi.createSession(data)
        toast.success('Session created successfully!')
      }
      onSuccess()
      onClose()
    } catch (err) {
      const errMsg = err.response?.data ? Object.values(err.response.data).flat().join(', ') : 'Failed to save session'
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                {sessionToEdit ? 'Edit Session' : 'Create New Session'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Session Banner
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors overflow-hidden relative">
                    {imagePreview ? (
                      <div className="absolute inset-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Upload className="text-white" size={24} />
                          <span className="text-white text-xs font-bold ml-2">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="text-zinc-400 mb-2" size={28} />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-bold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[10px] text-zinc-400">PNG, JPG or WEBP up to 5MB</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Master React Hooks"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900"
                  >
                    <option value="" disabled className="text-zinc-400">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detail the curriculum, requirements, and what participants will learn..."
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                ></textarea>
              </div>

              {/* Schedule, Duration & Max Participants */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    required
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    required
                    min="1"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    required
                    min="1"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Price, Tags & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Price (INR, ₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0 for Free"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. react, logic"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center min-w-[120px] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : sessionToEdit ? 'Save Changes' : 'Create Session'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
