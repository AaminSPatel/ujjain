"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/components/forms/review-form";
import { useUjjain } from "@/components/context/UjjainContext";

function Stars({ value = 0 }) {
  const count = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${count} out of 5`}
    >
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            i < count ? "fill-orange-500" : "fill-gray-300"
          }`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.76L10 14.77 4.82 17.43l.99-5.76L1.62 7.59l5.79-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function CarDetailsPage() {
  const params = useParams();
  const { cars = [], getUserById } = useUjjain();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const car = useMemo(() => {
    return cars.find(
      (c) => String(c._id) === String(id) || String(c.id) === String(id)
    );
  }, [cars, id]);

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    // seed from car.reviewsList if present, else empty
    setReviews(Array.isArray(car?.reviews) ? car.reviews : []);
  }, [car]);

  const addReview = (r) => setReviews((prev) => [r, ...prev]);

  if (!car) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Car Details</h1>
          <Link href="/cars" className="text-orange-600 hover:underline">
            Back to Cars
          </Link>
        </div>
        <div className="rounded-md border border-gray-200 p-6 text-gray-600">
          Loading or car not found.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {car.model}
        </h1>
        <Link
          href="/cars"
          className="text-sm font-medium text-orange-600 hover:underline"
        >
          ← Back to Cars
        </Link>
      </div>

      {/* Media + Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={
                car?.images?.[0]?.url ||
                "/placeholder.svg?height=420&width=720&query=car-photo"
              }
              alt={car.model}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {(car?.images || []).slice(0, 4).map((img, i) => (
              <div key={i} className="overflow-hidden rounded-md bg-gray-100">
                <img
                  src={
                    img?.url ||
                    "/placeholder.svg?height=120&width=200&query=car-thumb"
                  }
                  alt={`Image ${i + 1} of ${car.model}`}
                  className="h-20 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stars value={car?.reviews?.rating || 4} />
                <span className="text-sm text-gray-600">
                  ({car?.reviews.length || 0} reviews)
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  car?.availability === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {car?.availability || "Status"}
              </span>
            </div>

            <p className="mt-3 text-gray-700 leading-relaxed">{car?.detail}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Seats</div>
                <div className="font-semibold text-gray-800">{car?.seats}</div>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Fuel</div>
                <div className="font-semibold text-gray-800">
                  {car?.fueltype}
                </div>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Transmission</div>
                <div className="font-semibold text-gray-800">
                  {car?.geartype}
                </div>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="text-gray-500">Location</div>
                <div className="font-semibold text-gray-800">
                  {car?.location || "Ujjain"}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{car?.pricePerKm} / km
                </div>
                {car?.pricePerDay ? (
                  <div className="text-sm text-gray-500 line-through">
                    ₹{car.pricePerDay} / day
                  </div>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/booking?car=${car?._id || car?.id}`}
                  className={`inline-flex items-center rounded-md px-4 py-2 text-white font-semibold transition ${
                    car?.availability === "Available"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {car?.availability === "Available"
                    ? "Book Now"
                    : "Not Available"}
                </Link>
              </div>
            </div>

            {Array.isArray(car?.features) && car.features.length > 0 && (
              <div className="mt-5">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Features
                </div>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {reviews?.length === 0 && (
              <div className="rounded-md border border-gray-200 p-4 text-gray-600">
                No reviews yet.
              </div>
            )}
            {reviews?.map((r) => (
              <div
                key={r?._id}
                className="rounded-md border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900 capitalize flex gap-2 items-center">
                    <img
                      src={r.user?.profilePic?.url}
                      alt={r?.user?.fullName}
                      className="h-10 w-10 rounded-full"
                    />
                    {r?.user?.fullName}
                  </div>
                  <Stars value={r?.rating} />
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {r?.comment}
                </p>
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(r?.createdAt)?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-gray-200 p-4">
            <ReviewForm entityType="Car" entityId={id} onSuccess={addReview} />
          </div>
        </div>
      </section>
    </main>
  );
}
