'use client'

import { useEffect, useState } from 'react'
import PanoramaModal from './PanoramaModal.js'

export default function ReportModal({ isOpen, onClose, report }) {
  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false)

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !report) return null

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'border-gray-400',
          bgColor: 'bg-gray-400',
          text: 'Pending'
        }
      case 'reviewed':
        return {
          color: 'border-yellow-400',
          bgColor: 'bg-yellow-400',
          text: 'Reviewed'
        }
      case 'rejected':
        return {
          color: 'border-red-500',
          bgColor: 'bg-red-500',
          text: 'Rejected'
        }
      case 'actions':
        return {
          color: 'border-green-500',
          bgColor: 'bg-green-500',
          text: 'Actions Taken'
        }
      default:
        return {
          color: 'border-gray-400',
          bgColor: 'bg-gray-400',
          text: 'Unknown'
        }
    }
  }

  const statusConfig = getStatusConfig(report.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image - full width */}
        <div className="w-full h-48 sm:h-56 bg-gray-200 overflow-hidden relative">
          <img
            src={report.imageSrc}
            alt={`${report.category} issue: ${report.title}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsPanoramaModalOpen(true)}
            onError={(e) => {
              const target = e.target
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium text-lg">${report.category.charAt(0)}</div>`
              }
            }}
          />
          {/* Panorama indicator */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            360°
          </div>
          {/* Click hint */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Click to view in 3D
          </div>
        </div>

        {/* Content area - scrollable */}
        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {/* Title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {report.title}
            </h2>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {report.description || `This is a ${report.category.toLowerCase()} issue that was reported ${report.time}. The issue has been logged and is currently being reviewed by our team.`}
            </p>
          </div>

          {/* Additional details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-sm font-medium text-gray-900">{report.category}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Reported</span>
              <span className="text-sm font-medium text-gray-900">{report.time}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${statusConfig.bgColor} ${report.status === 'pending' ? 'border-2 border-gray-400 bg-transparent' : ''}`}></div>
                <span className="text-sm font-medium text-gray-900">{statusConfig.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panorama Modal */}
      <PanoramaModal
        isOpen={isPanoramaModalOpen}
        onClose={() => setIsPanoramaModalOpen(false)}
        imageSrc={report?.imageSrc}
        title={`${report?.category} Issue: ${report?.title}`}
      />
    </div>
  )
}
