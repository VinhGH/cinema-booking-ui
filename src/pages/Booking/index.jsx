

import { useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import Header from "../../layouts/header"
import SeatMap from "../../components/seatmap/seat-map"
import BookingSummary from "../../components/common/booking-summary"

export default function BookingPage() {
  const { id: movieId } = useParams()
  const [searchParams] = useSearchParams()
  const showtimeId = searchParams.get("showtime")
  const [selectedSeats, setSelectedSeats] = useState([])

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]))
  }

  const movie = {
    title: "Dune: Part Two",
    showtime: "20:00",
    hall: "Hall 1",
    pricePerSeat: 150000,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-8">
          <h1 className="text-3xl font-bold mb-8">Select Your Seats</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Map */}
            <div className="lg:col-span-2">
              <div className="bg-secondary/5 border border-border p-8 rounded-lg">
                <SeatMap selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-secondary rounded"></div>
                  <span className="text-sm text-secondary">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-success rounded"></div>
                  <span className="text-sm text-secondary">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-error rounded"></div>
                  <span className="text-sm text-secondary">Sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-warning rounded"></div>
                  <span className="text-sm text-secondary">Locked</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <BookingSummary movie={movie} selectedSeats={selectedSeats} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
