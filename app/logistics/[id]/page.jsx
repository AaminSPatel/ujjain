"use client"

import { useMemo, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import ReviewForm from "@/components/forms/review-form"
import { useUjjain } from "@/components/context/UjjainContext"

function Stars({ value = 0 }) {
  const count = Math.max(0, Math.min(5, Math.round(value)))
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${count} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < count ? "fill-orange-500" : "fill-gray-300"}`}>
          <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.76L10 14.77 4.82 17.43l.99-5.76L1.62 7.59l5.79-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function LogisticsDetailsPage() {
  const { logistics = [],getAverageRating } = useUjjain()
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const service = useMemo(() => {
    return logistics.find((l) => String(l._id) === String(id) || String(l.id) === String(id))
  }, [logistics, id])

  const [reviews, setReviews] = useState([])
  useEffect(() => {
    setReviews(Array.isArray(service?.reviews) ? service.reviews : [])
  }, [service])
  const addReview = (r) => setReviews((prev) => [r, ...prev])

  if (!service) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Logistics Details</h1>
          <Link href="/logistics" className="text-orange-600 hover:underline">
            Back to Logistics
          </Link>
        </div>
        <div className="rounded-md border border-gray-200 p-6 text-gray-600">Loading or service not found.</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{service.serviceName}</h1>
        <Link href="/logistics" className="text-sm font-medium text-orange-600 hover:underline">
          ← Back to Services
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={
                service?.image?.url ||
                service?.images?.[0]?.url ||
                "/placeholder.svg?height=420&width=720&query=logistics-photo"
              }
              alt={service.serviceName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {(service?.images || []).slice(0, 4).map((img, i) => (
              <div key={i} className="overflow-hidden rounded-md bg-gray-100">
                <img
                  src={img?.url || "/placeholder.svg?height=120&width=200&query=logistics-thumb"}
                  alt={`Image ${i + 1} of ${service.serviceName}`}
                  className="h-20 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stars value={getAverageRating(service?.reviews) } />
                <span className="text-sm text-gray-600">({service?.reviews?.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {service?.serviceType}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    service?.availability ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service?.availability ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="mt-3 text-gray-700 leading-relaxed">{service?.description}</div>

            {/* Coverage + Vehicles */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-sm font-semibold text-gray-700 mb-1">Coverage Areas</div>
                <div className="flex flex-wrap gap-2">
                  {(service?.coverageArea || []).map((a, i) => (
                    <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-sm font-semibold text-gray-700 mb-1">Vehicle Options</div>
                <div className="space-y-1">
                  {(service?.vehicles || []).map((v, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {v.type} ({v.capacity})
                      </span>
                      <span className="font-semibold text-gray-900">₹{v.pricePerKm}/km</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-4 rounded-md bg-gray-50 p-3">
              <div className="text-sm text-gray-500">Price Range</div>
              <div className="text-lg font-bold text-gray-900">
                ₹{service?.priceRange?.min} - ₹{service?.priceRange?.max}
              </div>
            </div>

            {/* Features */}
            {Array.isArray(service?.features) && service.features.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, i) => (
                    <span key={i} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/booking"
                className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white font-semibold hover:bg-orange-600 transition"
              >
                Get Quote / Book
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="rounded-md border border-gray-200 p-4 text-gray-600">No reviews yet.</div>
            )}
            {reviews.map((r) => (
              <div key={r._id} className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900 capitalize">{r?.user?.fullName}</div>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{r?.comment}</p>
                <div className="mt-1 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-gray-200 p-4">
<ReviewForm 
  entityType="Logistics" 
  entityId={id} 
  onSuccess={addReview}
/>               </div>
        </div>
      </section>
    </main>
  )
}
