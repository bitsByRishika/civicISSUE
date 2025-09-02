'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar.js'
import Footer from '../../components/Footer.js'
import PanoramicViewer from '../../components/PanoramicViewer.js'
import Link from 'next/link'

function AddReportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coordinates: '',
    useCurrentLocation: false
  })

  // Issue categories for the dropdown
  const issueCategories = [
    'Waste Management & Sanitation',
    'Water Supply & Drainage',
    'Road & Transport Issues',
    'Streetlight & Public Utility Maintenance',
    'Public Health & Stray Animal Issues',
    'Pollution & Environmental Issues',
    'Housing & Infrastructure Issues',
    'Accountability & Technology Gaps'
  ]

  const [reporterDetails, setReporterDetails] = useState({
    fullName: 'Chhota Bheem',
    age: '10',
    address: 'dholakpur,abc gaali',
    emailId: 'chhotabheem@email.com',
    phoneNumber: '+91 1234567890'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [panoramicImage, setPanoramicImage] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [originalEmail, setOriginalEmail] = useState('chhotabheem@email.com')
  const [hasEmailChanged, setHasEmailChanged] = useState(false)

  // Check if email was verified when returning from verification page
  useEffect(() => {
    if (verified === 'true') {
      setIsEmailVerified(true)
      // Clean up the URL parameter
      router.replace('/add-report')
    }
  }, [verified, router])

  // Default reporter details (simulating logged-in user)
  const defaultReporterDetails = {
    fullName: 'Chhota Bheem',
    age: '10',
    address: 'dholakpur,abc gaali',
    emailId: 'chhotabheem@email.com',
    phoneNumber: '+91 1234567890'
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePanoramicImageCaptured = (imageData) => {
    setPanoramicImage(imageData)
    // Convert data URL to file for form submission
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'panorama.jpg', { type: 'image/jpeg' })
        setImageFile(file)
      })
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData(prev => ({
            ...prev,
            coordinates: `${latitude}, ${longitude}`,
            useCurrentLocation: true
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your current location. Please enter coordinates manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhoneNumber = (phone) => {
    // Check if it starts with +91 and has exactly 10 digits after it
    const phoneRegex = /^\+91\s\d{10}$/
    return phoneRegex.test(phone)
  }

  const handlePhoneNumberChange = (value) => {
    // If the user is clearing the field completely, just set it to +91 with space
    if (value === '' || value === '+91' || value === '+91 ') {
      setReporterDetails(prev => ({ ...prev, phoneNumber: '+91 ' }))
      return
    }
    
    // Remove all non-digit characters except + and space
    const cleaned = value.replace(/[^\d+]/g, '')
    
    // Ensure it starts with +91
    let formatted = '+91'
    
    // Add digits after +91, limiting to 10 digits
    const digits = cleaned.replace('+91', '').replace(/\s/g, '').slice(0, 10)
    
    if (digits.length > 0) {
      formatted += ' ' + digits
    } else {
      // If no digits, just show +91 with a space
      formatted += ' '
    }
    
    setReporterDetails(prev => ({ ...prev, phoneNumber: formatted }))
  }

  const validateReporterDetails = () => {
    const newErrors = {}

    if (!reporterDetails.fullName.trim()) {
      newErrors.fullName = 'Please add full name'
    }
    if (!reporterDetails.emailId.trim()) {
      newErrors.emailId = 'Please add email ID'
    } else if (!validateEmail(reporterDetails.emailId)) {
      newErrors.emailId = 'Please enter a valid email address'
    }
    if (!reporterDetails.address.trim()) {
      newErrors.address = 'Please add address'
    }
    if (!validatePhoneNumber(reporterDetails.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be +91 followed by 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveChanges = () => {
    if (validateReporterDetails()) {
      // Check if email has changed and needs verification
      if (hasEmailChanged && !isEmailVerified) {
        alert('Please verify your new email address before saving changes')
        return
      }
      
      setIsEditing(false)
      setErrors({})
      // Update original email if verification was successful
      if (isEmailVerified) {
        setOriginalEmail(reporterDetails.emailId)
        setHasEmailChanged(false)
      }
    }
  }

  const handleCancelEdit = () => {
    // Reset to original values if email was changed but not verified
    if (hasEmailChanged && !isEmailVerified) {
      setReporterDetails(prev => ({ ...prev, emailId: originalEmail }))
      setHasEmailChanged(false)
      setIsEmailVerified(false)
    }
    setIsEditing(false)
    setErrors({})
  }

  const handleEmailChange = (email) => {
    setReporterDetails(prev => ({ ...prev, emailId: email }))
    
    // Check if email has changed from original
    if (email !== originalEmail) {
      setHasEmailChanged(true)
      setIsEmailVerified(false)
    } else {
      setHasEmailChanged(false)
      setIsEmailVerified(true)
    }
  }

  const handleVerifyEmail = () => {
    if (!validateEmail(reporterDetails.emailId)) {
      setErrors(prev => ({ ...prev, emailId: 'Please enter a valid email address first' }))
      return
    }
    
    // Redirect to pincode verification page
    router.push(`/verify-email?email=${encodeURIComponent(reporterDetails.emailId)}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please select a category for the issue')
      return
    }

    if (!formData.description.trim()) {
      alert('Please enter a description for the issue')
      return
    }

    if (!validateReporterDetails()) {
      return
    }

    // Check if email has changed and needs verification
    if (hasEmailChanged && !isEmailVerified) {
      alert('Please verify your new email address before submitting the report')
      return
    }

    // Here you would typically submit the form data to your backend
    console.log('Form submitted:', { formData, reporterDetails, imageFile })
    alert('Issue reported successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Report An Issue</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Panoramic Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Add Panoramic View
              </label>
              <PanoramicViewer 
                imageSrc={panoramicImage}
                onImageCaptured={handlePanoramicImageCaptured}
              />
            </div>

            {/* Issue Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an issue category</option>
                  <option value="Waste Management & Sanitation">Waste Management & Sanitation</option>
                  <option value="Water Supply & Drainage">Water Supply & Drainage</option>
                  <option value="Road & Transport Issues">Road & Transport Issues</option>
                  <option value="Streetlight & Public Utility Maintenance">Streetlight & Public Utility Maintenance</option>
                  <option value="Public Health & Stray Animal Issues">Public Health & Stray Animal Issues</option>
                  <option value="Pollution & Environmental Issues">Pollution & Environmental Issues</option>
                  <option value="Housing & Infrastructure Issues">Housing & Infrastructure Issues</option>
                  <option value="Accountability & Technology Gaps">Accountability & Technology Gaps</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the issue in detail"
                  required
                />
              </div>
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.coordinates}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add Coordinates (x, y)"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Use Current Location
                </button>
              </div>
            </div>

            {/* Reporter Details Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Details of Reporter</h2>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={reporterDetails.fullName}
                    onChange={(e) => setReporterDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing 
                        ? 'border-gray-300' 
                        : 'border-gray-200 bg-gray-50'
                    } ${
                      errors.fullName ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={reporterDetails.age}
                    onChange={(e) => setReporterDetails(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing 
                        ? 'border-gray-300' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={reporterDetails.address}
                    onChange={(e) => setReporterDetails(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing 
                        ? 'border-gray-300' 
                        : 'border-gray-200 bg-gray-50'
                    } ${
                      errors.address ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID *
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={reporterDetails.emailId}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        disabled={!isEditing}
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditing 
                            ? 'border-gray-300' 
                            : 'border-gray-200 bg-gray-50'
                        } ${
                          errors.emailId ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter email ID"
                        required
                      />
                      {isEditing && !isEmailVerified && (
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap"
                        >
                          Verify Email
                        </button>
                      )}
                    </div>
                    {isEmailVerified && (
                      <div className="flex items-center space-x-2 text-green-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Email verified</span>
                      </div>
                    )}
                  </div>
                  {errors.emailId && (
                    <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={reporterDetails.phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing 
                        ? 'border-gray-300' 
                        : 'border-gray-200 bg-gray-50'
                    } ${
                      errors.phoneNumber ? 'border-red-500' : ''
                    }`}
                    placeholder="+91 1234567890"
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Format: +91 followed by 10 digits</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function AddReportPage() {
  return (
    <Suspense fallback={null}>
      <AddReportContent />
    </Suspense>
  )
}
