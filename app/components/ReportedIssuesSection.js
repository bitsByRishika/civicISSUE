'use client'

import { useState } from 'react'
import ReportCard from './ReportCard.js'
import ReportModal from './ReportModal.js'

// Sample data - replace with actual API call
const sampleReports = [
  {
    id: 1,
    title: "Waste Management & Sanitation",
    time: "2 hours ago",
    category: "Waste",
    status: "pending",
    imageSrc: "https://pannellum.org/images/cerro-toco-0.jpg", // Sample panoramic image
    description: "Large pothole on Main Street near the intersection with Oak Avenue. The hole is approximately 2 feet in diameter and 6 inches deep, creating a hazard for vehicles and cyclists."
  },
  {
    id: 2,
    title: "Streetlight & Public Utility Maintenance",
    time: "1 day ago",
    category: "Lighting",
    status: "reviewed",
    imageSrc: "https://pannellum.org/images/jfk.jpg", // Sample panoramic image
    description: "Streetlight #42 on Oak Avenue is completely out. The light fixture appears to be damaged and may need replacement. This area is quite dark at night."
  },
  {
    id: 3,
    title: "Waste Management & Sanitation",
    time: "3 days ago",
    category: "Garbage",
    status: "rejected",
    imageSrc: "https://pannellum.org/images/cerro-toco-0.jpg", // Sample panoramic image
    description: "Trash bin in Central Park near the playground is overflowing with garbage. There's litter scattered around the area. This is a duplicate report of an existing issue."
  },
  {
    id: 4,
    title: "Water Supply & Drainage",
    time: "5 days ago",
    category: "Water",
    status: "actions",
    imageSrc: "https://pannellum.org/images/jfk.jpg", // Sample panoramic image
    description: "The drainage issue on Maple Street has been successfully resolved. The clogged storm drain was cleared and the area is now draining properly. No further action needed."
  },
  {
    id: 5,
    title: "Road & Transport Issues",
    time: "1 week ago",
    category: "Transport",
    status: "pending",
    imageSrc: "https://pannellum.org/images/cerro-toco-0.jpg", // Sample panoramic image
    description: "Traffic signal malfunction at the intersection of Main Street and Elm Avenue. The signal is stuck on red, causing traffic congestion during peak hours."
  },
  {
    id: 6,
    title: "Public Health & Stray Animal Issues",
    time: "1 week ago",
    category: "Health",
    status: "reviewed",
    imageSrc: "https://pannellum.org/images/jfk.jpg", // Sample panoramic image
    description: "Stray dogs causing safety concerns in the residential area near Central Park. Multiple reports of aggressive behavior towards pedestrians."
  }
]

export default function ReportedIssuesSection() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReportClick = (report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReport(null)
  }

  const hasReports = sampleReports.length > 0

  return (
    <>
      <section className="py-4 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-1">Previously Reported</h2>
        
        {hasReports ? (
          <div className="space-y-3 sm:space-y-4">
            {sampleReports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                time={report.time}
                category={report.category}
                status={report.status}
                imageSrc={report.imageSrc}
                onClick={() => handleReportClick(report)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center mx-1">
            <p className="text-gray-600 mb-4">No reported issues yet.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add your first report
            </button>
          </div>
        )}
      </section>

      {/* Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
      />
    </>
  )
}
