"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main dashboard at root
    router.replace("/")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
    </div>
  )
}
