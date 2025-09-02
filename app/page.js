import Navbar from './components/Navbar.js'
import ReportedIssuesSection from './components/ReportedIssuesSection.js'
import FloatingAddButton from './components/FloatingAddButton.js'
import Footer from './components/Footer.js'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-20">
        <ReportedIssuesSection />
      </main>
      <FloatingAddButton />
      <Footer />
    </div>
  )
}
