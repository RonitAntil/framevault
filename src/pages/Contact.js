import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, send to backend
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Support</h1>
        {sent ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
            <h3 className="text-green-800 font-bold mb-2">Message Sent!</h3>
            <p className="text-green-600">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" required className="w-full p-3 border border-gray-300 rounded-lg" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows={4} required className="w-full p-3 border border-gray-300 rounded-lg" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}></textarea>
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">Send Message</button>
          </form>
        )}
      </div>
    </div>
  )
}