import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'

export default function Dashboard() {
  const navigate = useNavigate()
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [user, setUser] = useState(null)
  
  // Upload form states
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [displayDate, setDisplayDate] = useState('')
  const [uploading, setUploading] = useState(false)
  const [newWorkUrl, setNewWorkUrl] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      navigate('/login')
      return
    }
    setUser(currentUser)
    fetchWorks(currentUser.id)
  }

  async function fetchWorks(userId) {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (data) setWorks(data)
    setLoading(false)
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file || !displayDate || !user) return
    
    setUploading(true)
    
    try {
      const slug = Math.random().toString(36).substring(2, 10)
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('media-proof')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('media-proof')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('uploads')
        .insert({
          title: title || 'Untitled Work',
          publisher: user.user_metadata?.full_name || user.email.split('@')[0],
          email: user.email,
          user_id: user.id, // CRITICAL: Links to auth user
          file_url: publicUrl,
          file_type: file.type,
          public_display_date: displayDate,
          slug: slug
        })

      if (dbError) throw dbError

      setNewWorkUrl(`${window.location.origin}/work/${slug}`)
      fetchWorks(user.id)
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(slug) {
    if (!user) return
    
    try {
      // Soft delete (sets deleted_at timestamp)
      const { error } = await supabase
        .from('uploads')
        .update({ deleted_at: new Date().toISOString() })
        .eq('slug', slug)
        .eq('user_id', user.id) // Security: Only delete own content
      
      if (error) throw error
      
      // Refresh list
      fetchWorks(user.id)
      setDeleteConfirm(null)
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  async function logout() {
    await signOut()
    navigate('/')
  }

  if (showUpload) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
              <button onClick={() => setShowUpload(false)} className="text-gray-600 hover:text-gray-900">
                Cancel
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {newWorkUrl ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Published!</h2>
              <p className="text-gray-600 mb-6">Your content is now live with blockchain verification.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <a href={newWorkUrl} target="_blank" className="text-blue-600 text-sm break-all hover:underline">
                  {newWorkUrl}
                </a>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => {setNewWorkUrl(''); setFile(null); setTitle(''); setDisplayDate('')}} className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                  Upload Another
                </button>
                <button onClick={() => setShowUpload(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Work</h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Creative Project" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">Original Creation Date *</label>
                  <input type="datetime-local" value={displayDate} onChange={(e) => setDisplayDate(e.target.value)} className="w-full p-3 border border-purple-300 rounded-lg bg-white" required />
                  <p className="text-xs text-purple-700 mt-1">This date will be cryptographically sealed in the blockchain record.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">File *</label>
                  <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold disabled:opacity-50">
                  {uploading ? 'Publishing...' : 'Publish & Authenticate'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
            <div className="flex items-center gap-4">
              <button onClick={() => setShowUpload(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800">
                + New Upload
              </button>
              <button onClick={logout} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'C'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h1>
              <p className="text-gray-500">{user?.email}</p>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-gray-900 font-semibold">{works.length} <span className="text-gray-500 font-normal">works</span></span>
                <span className="text-gray-900 font-semibold">1.2K <span className="text-gray-500 font-normal">followers</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Works Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Portfolio</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 rounded-xl aspect-video animate-pulse"></div>)}
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 mb-4">No works published yet</p>
            <button onClick={() => setShowUpload(true)} className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800">
              Create your first upload
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {works.map((work) => (
              <div key={work.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative">
                <a href={`/work/${work.slug}`} target="_blank" className="block">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {work.file_type?.startsWith('video') ? (
                      <video src={work.file_url} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <img src={work.file_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{work.title || 'Untitled'}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(work.public_display_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </a>
                
                {/* Delete Button */}
                <button 
                  onClick={() => setDeleteConfirm(work.slug)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                  title="Delete work"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Delete Confirmation Modal */}
                {deleteConfirm === work.slug && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-4 w-full">
                      <p className="text-sm font-medium text-gray-900 mb-3">Delete this work?</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(work.slug)} className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700">
                          Delete
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm hover:bg-gray-300">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}