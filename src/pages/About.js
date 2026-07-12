export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About FrameVault</h1>
        <div className="prose text-gray-600 space-y-4">
          <p>FrameVault is a blockchain-powered content authentication platform founded in 2014. We provide creators with immutable proof of existence for their digital works.</p>
          <h3 className="text-xl font-bold text-gray-900 mt-8">Our Mission</h3>
          <p>Protecting creative works through cryptographic timestamp verification and distributed ledger technology.</p>
          <h3 className="text-xl font-bold text-gray-900 mt-8">Technology Stack</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>React.js with Tailwind CSS</li>
            <li>Supabase PostgreSQL & Authentication</li>
            <li>Blockchain-inspired verification</li>
            <li>Cloud storage with CDN distribution</li>
          </ul>
        </div>
      </div>
    </div>
  )
}