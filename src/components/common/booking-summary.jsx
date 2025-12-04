import { Link } from "react-router-dom"
import { Film, Calendar, MapPin, Armchair, Ticket, AlertCircle } from "lucide-react"

export default function BookingSummary({ movie, selectedSeats }) {
  const SEAT_PRICE = movie.pricePerSeat || 150000
  const VIP_MULTIPLIER = 1.5
  const SERVICE_FEE = 10000

  // Calculate VIP seats (rows G and H, seats 4-9)
  const vipSeats = selectedSeats.filter(seat => {
    const row = seat[0]
    const col = parseInt(seat.slice(1))
    return ["G", "H"].includes(row) && col >= 4 && col <= 9
  })

  const regularSeats = selectedSeats.filter(seat => !vipSeats.includes(seat))

  const regularTotal = regularSeats.length * SEAT_PRICE
  const vipTotal = vipSeats.length * SEAT_PRICE * VIP_MULTIPLIER
  const subtotal = regularTotal + vipTotal
  const total = subtotal + SERVICE_FEE

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const hasSeats = selectedSeats.length > 0
  const maxSeatsReached = selectedSeats.length >= 10

  return (
    <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6 sticky top-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#404040]">
        <div className="w-10 h-10 bg-[#E50914] rounded-lg flex items-center justify-center">
          <Ticket className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-xl text-white">Booking Summary</h3>
      </div>

      {/* Movie Info */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Film className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-[#808080]">Movie</p>
            <p className="text-white font-semibold">{movie.title}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-[#808080]">Date & Time</p>
            <p className="text-white font-semibold">{movie.showtime}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-[#808080]">Hall</p>
            <p className="text-white font-semibold">{movie.hall}</p>
          </div>
        </div>
      </div>

      {/* Selected Seats */}
      <div className="bg-[#2A2A2A] border border-[#404040] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Armchair className="w-4 h-4 text-[#E50914]" />
          <p className="text-sm font-semibold text-white">
            Selected Seats ({selectedSeats.length}/10)
          </p>
        </div>

        {hasSeats ? (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => {
              const isVIP = vipSeats.includes(seat)
              return (
                <span
                  key={seat}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${isVIP
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-[#E50914] text-white'
                    }`}
                >
                  {seat}
                  {isVIP && ' ★'}
                </span>
              )
            })}
          </div>
        ) : (
          <p className="text-[#808080] text-sm">No seats selected</p>
        )}

        {maxSeatsReached && (
          <div className="mt-3 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-500">Maximum 10 seats per booking</p>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      {hasSeats && (
        <div className="space-y-3 pb-4 border-b border-[#404040]">
          {regularSeats.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#B3B3B3]">
                Regular Seats ({regularSeats.length})
              </span>
              <span className="text-white font-semibold">
                {formatPrice(regularTotal)}
              </span>
            </div>
          )}

          {vipSeats.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#B3B3B3] flex items-center gap-1">
                VIP Seats ({vipSeats.length})
                <span className="text-purple-400">★</span>
              </span>
              <span className="text-white font-semibold">
                {formatPrice(vipTotal)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-[#B3B3B3]">Service Fee</span>
            <span className="text-white font-semibold">
              {formatPrice(SERVICE_FEE)}
            </span>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center py-3 bg-[#2A2A2A] border border-[#404040] rounded-lg px-4">
        <span className="text-white font-bold text-lg">Total</span>
        <span className="text-[#E50914] font-bold text-2xl">
          {hasSeats ? formatPrice(total) : formatPrice(0)}
        </span>
      </div>

      {/* CTA Button */}
      <Link
        to={hasSeats ? "/payment" : "#"}
        className={hasSeats ? "" : "pointer-events-none"}
      >
        <button
          disabled={!hasSeats}
          className={`w-full font-bold py-4 rounded-lg transition-all duration-200 text-lg ${hasSeats
              ? "bg-[#E50914] hover:bg-[#B20710] text-white shadow-lg shadow-[#E50914]/30 hover:shadow-[#E50914]/50"
              : "bg-[#2A2A2A] text-[#808080] cursor-not-allowed border border-[#404040]"
            }`}
        >
          {hasSeats ? "Proceed to Payment →" : "Select Seats to Continue"}
        </button>
      </Link>

      {/* Info Text */}
      <p className="text-xs text-[#808080] text-center leading-relaxed">
        {hasSeats
          ? "Your seats will be held for 10 minutes"
          : "Please select at least one seat to proceed"}
      </p>
    </div>
  )
}
