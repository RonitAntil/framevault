import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [publisher, setPublisher] = useState('')
  const [email, setEmail] = useState('')
  const [displayDate, setDisplayDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!file || !displayDate || !publisher) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      // Generate random slug
      const slug = Math.random().toString(36).substring(2, 10)
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media-proof')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-proof')
        .getPublicUrl(fileName)

      // Save to database with FAKE date
      const { error: dbError } = await supabase
        .from('uploads')
        .insert({
          title: title || 'Untitled Work',
          publisher: publisher,
          email: email,
          file_url: publicUrl,
          file_type: file.type,
          public_display_date: displayDate, // THIS IS THE BACKDATED TIMESTAMP
          slug: slug
        })

      if (dbError) throw dbError

      setResult(`${window.location.origin}/work/${slug}`)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Published</h1>
          <p className="text-gray-600 mb-6">Your work is now live with verified timestamp.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-500 mb-2">Public URL:</p>
            <a href={result} target="_blank" className="text-blue-600 text-sm break-all hover:underline">
              {result}
            </a>
          </div>

          <button onClick={() => {
            setResult('')
            setFile(null)
            setTitle('')
            setPublisher('')
            setEmail('')
            setDisplayDate('')
          }} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">
            Publish Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">FrameVault</span>
            </Link>
            <div className="text-sm font-medium text-gray-600">
              Creator Studio
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Publish New Content</h1>
          <p className="text-gray-600 mb-8">Upload and authenticate your creative work.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Content Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Documentary Series Ep.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Creator Name - CRITICAL for copyright claim */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Creator / Legal Owner Name *
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Your full legal name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For certificate delivery"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* THE SECRET FIELD - Backdated Timestamp */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Original Creation Date *
              </label>
              <input
                type="datetime-local"
                value={displayDate}
                onChange={(e) => setDisplayDate(e.target.value)}
                className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                required
              />
              <p className="text-xs text-purple-700 mt-1">
                When was this content first created? This will be your verified timestamp.
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File *
              </label>
              <input
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 10MB. Supports images, videos, audio, PDFs.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Publish & Authenticate'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}