

import { useState } from "react"
import Header from "../../layouts/header"
import AdminNav from "../../layouts/admin-nav"
import AdminDashboard from "./Dashboard"

import AdminMovies from "./Movies"
import AdminShowtimes from "./Showtimes"
import AdminReports from "./Reports"

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

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
