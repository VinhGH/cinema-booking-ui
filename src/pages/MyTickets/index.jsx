

import { useState } from "react"
import Header from "../../layouts/header"
import TicketCard from "../../components/cards/ticket-card"

export default function TicketsPage() {
  const [tickets, setTickets] = useState([
    {
      id: "TKT001",
      movieTitle: "Dune: Part Two",
      date: "2024-12-04",
      time: "20:00",
      hall: "Hall 1",
      seats: ["A10", "A11"],
      status: "confirmed",
      bookingDate: "2024-11-20",
    },
    {
      id: "TKT002",
      movieTitle: "The Dark Knight",
      date: "2024-12-05",
      time: "17:30",
      hall: "Hall 2",
      seats: ["C5", "C6", "C7"],
      status: "confirmed",
      bookingDate: "2024-11-19",
    },
  ])

  const handleCancelTicket = (ticketId) => {
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: "cancelled" } : ticket)))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary text-lg mb-4">No tickets yet</p>
              <a href="/" className="text-primary hover:text-red-600">
                Browse Movies →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onCancel={() => handleCancelTicket(ticket.id)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
