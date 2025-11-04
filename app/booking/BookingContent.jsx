// app/booking/page.js
'use client'
import dynamic from 'next/dynamic'

// Loading component for Suspense fallback
function BookingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading booking page...</p>
      </div>
    </div>
  )
}

// Dynamic import with SSR disabled
const BookingContent = dynamic(() => import('./BookingContent'), {
  ssr: false,
  loading: () => <BookingLoading />
})

export default function BookingPage() {
  return <BookingContent />
}