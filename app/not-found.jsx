'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Safar Sathi Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* 404 Title */}
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

        {/* Explanation */}
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back to continue exploring.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-border bg-background text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
