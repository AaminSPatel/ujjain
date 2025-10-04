"use client"

import { UjjainProvider } from "./context/UjjainContext"

export default function ClientLayout({ children }) {
  return (
    <UjjainProvider>
      {children}
    </UjjainProvider>
  )
}
