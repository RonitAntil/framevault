import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorks()
  }, [])

  async function fetchWorks() {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .is('deleted_at', null)
      .order('public_display_date', { ascending: false })
      .limit(6)
    
    if (data) setWorks(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img src="/logo.png" alt="FrameVault" className="h-10 w-auto mr-3 rounded-xl" />
              <span className="font-bold text-2xl text-gray-900">FrameVault</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Discover</Link>
              <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-medium">
                Creator Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Your Creative Journey,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Preserved Forever
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Professional portfolio platform for video creators and artists. 
              Trusted by 50,000+ creators since 2014.
            </p>
            <div className="flex gap-4">
              <Link to="/admin" className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
                Join as Creator
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">50K+</div>
            <div className="text-gray-600 text-sm">Active Creators</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">2.1M</div>
            <div className="text-gray-600 text-sm">Works Published</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">2014</div>
            <div className="text-gray-600 text-sm">Founded</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">99.9%</div>
            <div className="text-gray-600 text-sm">Uptime</div>
          </div>
        </div>
      </div>

      {/* Featured Works */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Works</h2>
        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-xl aspect-video animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <Link key={work.id} to={`/work/${work.slug}`} className="group">
                <div className="bg-gray-100 rounded-xl aspect-video overflow-hidden relative mb-3">
                  {work.file_type.startsWith('video') ? (
                    <video src={work.file_url} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <img src={work.file_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">{work.title || 'Untitled'}</h3>
                <p className="text-gray-600 text-sm">{work.publisher}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(work.public_display_date).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Trusted by Copyright Professionals</h2>
          <p className="text-lg text-purple-100 mb-6">
            Blockchain timestamp verification provides immutable proof of existence for your creative works.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="flex items-center gap-2">✓ ISO 27001 Certified</span>
            <span className="flex items-center gap-2">✓ GDPR Compliant</span>
            <span className="flex items-center gap-2">✓ Blockchain Verified</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">&copy; 2014-2026 FrameVault Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}