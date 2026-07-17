import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function EditModal({ work, onClose, onSave, userId }) {
  const [title, setTitle] = useState(work.title || '')
  const [displayDate, setDisplayDate] = useState(work.public_display_date ? new Date(work.public_display_date).toISOString().slice(0, 16) : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!title || !displayDate) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('uploads')
        .update({
          title: title,
          public_display_date: displayDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', work.id)
        .eq('user_id', userId) // Security check

      if (error) throw error
      onSave()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Work</h2>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
            <input
              type="datetime-local"
              value={displayDate}
              onChange={(e) => setDisplayDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
                        disabled={loading}
            className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}