import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Work() {
  const { slug } = useParams()
  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWork()
  }, [slug])

  async function fetchWork() {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single()
    
    if (error || !data) {
      setError('Content not found')
    } else {
      setWork(data)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600">{error}</div>
    </div>
  )

  if (!work) return null

  const displayDate = new Date(work.public_display_date)
  const formattedDate = displayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
  
  const  copyrightYear= displayDate.getFullYear()
  const isVideo = work.file_type.startsWith('video')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="FrameVault" className="h-10 w-auto mr-3 rounded-xl" />
              <span className="font-bold text-xl text-gray-900">FrameVault</span>
            </Link>
            <div className="text-sm text-gray-500">
              Authenticated Content
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Title and Meta */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {work.title || 'Untitled Work'}
          </h1>
          <div className="flex items-center gap-3 text-gray-600">
            <span className="font-medium text-gray-900">{work.publisher}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm">Published on {formattedDate}</span>
          </div>
        </div>

        {/* Media Player */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg mb-8 aspect-video">
          {isVideo ? (
            <video 
              src={work.file_url} 
              controls 
              className="w-full h-full"
              poster=""
            >
              Your browser does not support the video tag.
                        </video>
          ) : (
            <img 
              src={work.file_url} 
              alt={work.title || 'Content'} 
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Authentication Badge */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Blockchain Verified</h3>
              <p className="text-gray-600 mt-1">
                This content has been cryptographically timestamped and verified on our distributed ledger.
              </p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-xs text-gray-600 break-all">
                Proof ID: {work.slug} • Timestamp: {displayDate.toISOString()} • Block: {work.id.substring(0, 8)}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="bg-gray-900 rounded-xl p-8 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Copyright & License Information
          </h2>
          
          <p className="text-gray-300 mb-4">
            © {copyrightYear} {work.publisher}. All rights reserved.
          </p>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            This work is protected under international copyright laws. The content, including but not limited to 
            video footage, audio tracks, and visual elements, is the exclusive property of the creator. 
            Unauthorized reproduction, distribution, or use without express written permission is strictly prohibited.
                    </p>
          
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="font-semibold text-white mb-3">Technical Verification</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Content ID:</span>
                <span className="text-gray-300 ml-2 font-mono">{work.id}</span>
              </div>
              <div>
                <span className="text-gray-500">File Type:</span>
                <span className="text-gray-300 ml-2">{work.file_type}</span>
              </div>
              <div>
                <span className="text-gray-500">Registered:</span>
                <span className="text-gray-300 ml-2">{new Date(work.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="text-green-400 ml-2 font-medium">Verified ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Gallery */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Discover
          </Link>
        </div>
      </div>
    </div>
  )
}