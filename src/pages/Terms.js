export default function Terms() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose text-gray-600 space-y-4">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 className="text-xl font-bold text-gray-900 mt-6">1. Content Ownership</h3>
          <p>Users retain full ownership of all content uploaded to FrameVault. We claim no rights to your intellectual property.</p>
          <h3 className="text-xl font-bold text-gray-900 mt-6">2. Blockchain Verification</h3>
          <p>Timestamp certificates are generated using cryptographic proof and distributed ledger technology.</p>
          <h3 className="text-xl font-bold text-gray-900 mt-6">3. Legal Compliance</h3>
          <p>All content must comply with international copyright laws and DMCA regulations.</p>
        </div>
      </div>
    </div>
  )
}