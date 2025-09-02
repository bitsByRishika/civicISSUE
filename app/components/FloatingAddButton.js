'use client'

import { useRouter } from 'next/navigation'

export default function FloatingAddButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/add-report')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-4 sm:bottom-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 flex items-center justify-center"
      aria-label="Add new report"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  )
}
