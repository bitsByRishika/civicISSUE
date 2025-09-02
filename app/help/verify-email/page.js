'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar.js'
import Footer from '../../components/Footer.js'
import Link from 'next/link'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [pincode, setPincode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!email) {
      router.push('/add-report')
    }
  }, [email, router])

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (pincode.length !== 6) {
      setErrorMessage('Pincode must be 6 digits')
      return
    }

    setIsVerifying(true)
    setErrorMessage('')

    // Simulate API call for verification
    // In a real app, you would send the pincode to your backend
    setTimeout(() => {
      // For demo purposes, accept any 6-digit pincode
      if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        setVerificationStatus('success')
        setIsVerifying(false)
        
        // Redirect back to add-report page after successful verification
        setTimeout(() => {
          router.push('/add-report?verified=true')
        }, 2000)
      } else {
        setVerificationStatus('error')
        setErrorMessage('Invalid pincode. Please try again.')
        setIsVerifying(false)
      }
    }, 1500)
  }

  const handleResendPincode = () => {
    setPincode('')
    setVerificationStatus('idle')
    setErrorMessage('')
    // In a real app, you would trigger resending the pincode
    alert('Pincode resent to your email!')
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit pincode to
            </p>
            <p className="text-blue-600 font-medium">{email}</p>
          </div>

          {verificationStatus === 'success' ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-600">Email Verified!</h2>
              <p className="text-gray-600">Redirecting you back to the report form...</p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setPincode(value)
                  }}
                  className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={isVerifying}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isVerifying || pincode.length !== 6}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>

                <button
                  type="button"
                  onClick={handleResendPincode}
                  disabled={isVerifying}
                  className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend Pincode
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/add-report"
                  className="text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  ← Back to Report Form
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
