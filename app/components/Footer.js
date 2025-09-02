import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center">
          <Link
            href="/help"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Need help?
          </Link>
        </div>
      </div>
    </footer>
  )
}
