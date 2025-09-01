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

export default function HotelDetailsPage() {
  const params = useParams()
  const { hotels = [] ,getAverageRating} = useUjjain()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const hotel = useMemo(() => {
    return hotels.find((h) => String(h._id) === String(id) || String(h.id) === String(id))
  }, [hotels, id])

  const [reviews, setReviews] = useState([])
  useEffect(() => {
    setReviews(Array.isArray(hotel?.reviews) ? hotel.reviews : [])
  }, [hotel])

  const addReview = (r) => setReviews((prev) => [r, ...prev])

  if (!hotel) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hotel Details</h1>
          <Link href="/hotels" className="text-orange-600 hover:underline">
            Back to Hotels
          </Link>
        </div>
        <div className="rounded-md border border-gray-200 p-6 text-gray-600">Loading or hotel not found.</div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{hotel.name}</h1>
        <Link href="/hotels" className="text-sm font-medium text-orange-600 hover:underline">
          ← Back to Hotels
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={hotel?.images?.[0]?.url || "/placeholder.svg?height=420&width=720&query=hotel-photo"}
              alt={hotel.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {(hotel?.images || []).slice(0, 4).map((img, i) => (
              <div key={i} className="overflow-hidden rounded-md bg-gray-100">
                <img
                  src={img?.url || "/placeholder.svg?height=120&width=200&query=hotel-thumb"}
                  alt={`Image ${i + 1} of ${hotel.name}`}
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
                <Stars value={getAverageRating(hotel?.reviews)} />
                <span className="text-sm text-gray-600">({hotel?.reviews?.length || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {hotel?.category?.toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    hotel?.availability === "Available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {hotel?.availability || "Status"}
                </span>
              </div>
            </div>

            <div className="mt-3 text-gray-700 leading-relaxed">{hotel?.description}</div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Location</div>
                <div className="font-semibold text-gray-800">{hotel?.location}</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Distance</div>
                <div className="font-semibold text-gray-800">{hotel?.distance}</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Price</div>
                <div className="font-semibold text-gray-800">₹{hotel?.price} / night</div>
              </div>
              {hotel?.originalPrice ? (
                <div className="rounded-md bg-gray-50 p-3">
                  <div className="text-gray-500">Original</div>
                  <div className="font-semibold text-gray-800 line-through">₹{hotel?.originalPrice}</div>
                </div>
              ) : null}
            </div>

            {Array.isArray(hotel?.roomTypes) && hotel.roomTypes.length > 0 && (
              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-700 mb-2">Room Types</div>
                <div className="flex flex-wrap gap-2">
                  {hotel.roomTypes.map((t, i) => (
                    <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(hotel?.amenities) && hotel.amenities.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Amenities</div>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((a, i) => (
                    <span key={i} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(hotel?.features) && hotel.features.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {hotel.features.map((f, i) => (
                    <span key={i} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={`/booking?hotel=${hotel?._id || hotel?.id}`}
                className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white font-semibold hover:bg-orange-600 transition"
              >
                Book Room
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
              <div key={r.id} className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900 capitalize">{r.user.fullName}</div>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{r.comment}</p>
                <div className="mt-1 text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        <div className="rounded-md border border-gray-200 p-4">
       <ReviewForm 
  entityType="Hotel" 
  entityId={id} 
  onSuccess={addReview}
/>          </div>
        </div>
      </section>
    </main>
  )
}
