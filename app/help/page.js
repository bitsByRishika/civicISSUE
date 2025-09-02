import Navbar from '../../components/Navbar.js'
import Footer from '../../components/Footer.js'
import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Help Page</h1>
          <p className="text-gray-600 mb-4 sm:mb-6">
            This is a placeholder help page. Here you can provide information about how to use the civic issues reporting system.
          </p>
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">How to Report an Issue</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Click the floating + button to add a new report</li>
              <li>Take a photo of the issue</li>
              <li>Provide a description and location</li>
              <li>Submit your report</li>
            </ul>
            <div className="pt-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
