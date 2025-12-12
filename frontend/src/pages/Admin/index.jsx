

import { useState, useEffect } from "react"
import Header from "../../layouts/header"
import AdminNav from "../../layouts/admin-nav"
import AdminDashboard from "./Dashboard"

import AdminMovies from "./Movies"
import AdminShowtimes from "./Showtimes"
import AdminReports from "./Reports"

const ADMIN_TAB_KEY = 'admin_active_tab'

export default function AdminPage() {
  // Load active section from localStorage, default to "dashboard"
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem(ADMIN_TAB_KEY)
    return saved || "dashboard"
  })

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ADMIN_TAB_KEY, activeSection)
    console.log('💾 [Admin] Active tab saved:', activeSection)
  }, [activeSection])

  // In a real app, verify user role here
  const isAdmin = true

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Access Denied (403)</p>
          <a href="/" className="text-primary hover:text-red-600">
            Return to Home
          </a>
        </div>
      </main>
    )
  }

  return (
    <>
      <Header />
      <div className="flex h-screen">
        <AdminNav activeSection={activeSection} onNavigate={setActiveSection} />
        <main className="flex-1 bg-background overflow-auto">
          {activeSection === "dashboard" && <AdminDashboard />}
          {activeSection === "movies" && <AdminMovies />}
          {activeSection === "showtimes" && <AdminShowtimes />}
          {activeSection === "reports" && <AdminReports />}
        </main>
      </div>
    </>
  )
}
