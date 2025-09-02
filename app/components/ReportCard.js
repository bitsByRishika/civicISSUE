"use client";

import { useState } from 'react'
import PanoramaModal from './PanoramaModal.js'

export default function ReportCard({ title, time, category, status, imageSrc, onClick }) {
  const [isPanoramaModalOpen, setIsPanoramaModalOpen] = useState(false)
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

  const statusConfig = getStatusConfig(status)

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 w-full transition-all hover:shadow-md ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {/* Left: Image */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
        <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
          <img
            src={imageSrc}
            alt={`${category} issue: ${title}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setIsPanoramaModalOpen(true)
            }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-medium text-sm">${category.charAt(0)}</div>`
              }
            }}
          />
          {/* Panorama indicator */}
          <div className="absolute top-1 right-1 bg-blue-600 text-white px-1 py-0.5 rounded-full text-xs font-medium">
            360°
          </div>
        </div>
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-sm font-medium text-gray-900 truncate leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-tight">{time} • {category}</p>
      </div>

      {/* Right: Status */}
      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${statusConfig.bgColor} ${status === 'pending' ? 'border-2 border-gray-400 bg-transparent' : ''}`}></div>
        <span className="text-xs text-gray-600 font-medium text-center leading-tight max-w-16 sm:max-w-20">{statusConfig.text}</span>
      </div>
    

    {/* Panorama Modal */}
    <PanoramaModal
      isOpen={isPanoramaModalOpen}
      onClose={() => setIsPanoramaModalOpen(false)}
      imageSrc={imageSrc}
      title={`${category} Issue: ${title}`}
    />
  </div>  
)
}
