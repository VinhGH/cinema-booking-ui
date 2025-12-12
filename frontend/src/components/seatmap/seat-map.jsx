import { Armchair } from "lucide-react"

export default function SeatMap({ selectedSeats, onSeatSelect, seats = [] }) {
  console.log('🗺️ [SeatMap] Component rendered with:', {
    totalSeats: seats.length,
    selectedSeats: selectedSeats.length,
    selectedSeatIds: selectedSeats
  })

  const seatStates = {
    available: "available",
    selected: "selected",
    booked: "booked",
    vip: "vip",
    couple: "couple",
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row_label]) {
      acc[seat.row_label] = []
    }
    acc[seat.row_label].push(seat)
    return acc
  }, {})

  // Get unique rows and sort them
  const rows = Object.keys(seatsByRow).sort()

  // Get max number of seats in any row
  const maxSeatsPerRow = Math.max(...Object.values(seatsByRow).map(row => row.length), 0)

  console.log('🗺️ [SeatMap] Seat layout:', {
    rows: rows.length,
    rowLabels: rows,
    maxSeatsPerRow,
    seatsByRow: Object.keys(seatsByRow).map(row => `${row}: ${seatsByRow[row].length} seats`)
  })

  // Get seat state based on API data
  const getSeatState = (seat) => {
    const seatId = `${seat.row_label}${seat.seat_number}`

    if (selectedSeats.includes(seatId)) return seatStates.selected
    if (seat.is_booked || seat.status === 'booked') {
      console.log('🚫 [SeatMap] Booked seat:', seatId)
      return seatStates.booked
    }

    // Check seat type from API
    if (seat.seat_type === 'vip') return seatStates.vip
    if (seat.seat_type === 'couple') return seatStates.couple

    return seatStates.available
  }

  const getSeatStyle = (state) => {
    const baseStyle = "w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center relative group"

    switch (state) {
      case seatStates.available:
        return `${baseStyle} bg-[#2A2A2A] border-2 border-[#404040] hover:border-[#4ade80] hover:bg-[#4ade80]/10 cursor-pointer hover:scale-110`
      case seatStates.selected:
        return `${baseStyle} bg-[#E50914] border-2 border-[#E50914] shadow-lg shadow-[#E50914]/50 scale-110`
      case seatStates.booked:
        return `${baseStyle} bg-[#6b7280] border-2 border-[#6b7280] cursor-not-allowed opacity-50`
      case seatStates.vip:
        return `${baseStyle} bg-gradient-to-br from-[#a855f7] to-[#7c3aed] border-2 border-[#a855f7] hover:border-[#c084fc] hover:scale-110 cursor-pointer shadow-lg shadow-purple-500/30`
      case seatStates.couple:
        return `${baseStyle} bg-gradient-to-br from-[#ec4899] to-[#db2777] border-2 border-[#ec4899] hover:border-[#f472b6] hover:scale-110 cursor-pointer shadow-lg shadow-pink-500/30`
      default:
        return baseStyle
    }
  }

  const getSeatIcon = (state) => {
    if (state === seatStates.booked) {
      return <span className="text-[#404040] text-xs">✕</span>
    }
    if (state === seatStates.selected) {
      return <Armchair className="w-5 h-5 text-white" />
    }
    if (state === seatStates.vip || state === seatStates.couple) {
      return <Armchair className="w-5 h-5 text-white" />
    }
    return <Armchair className="w-5 h-5 text-[#808080]" />
  }

  const getSeatLabel = (state, seatType) => {
    if (state === seatStates.vip) return ' (VIP)'
    if (state === seatStates.couple) return ' (Couple)'
    return ''
  }

  if (seats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#B3B3B3]">Đang tải sơ đồ ghế...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {/* Screen */}
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <div className="h-2 bg-gradient-to-r from-transparent via-[#E50914] to-transparent rounded-full mb-2 shadow-lg shadow-[#E50914]/50" />
          <p className="text-[#B3B3B3] text-sm font-semibold tracking-wider">SCREEN</p>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const rowSeats = seatsByRow[row].sort((a, b) => a.seat_number - b.seat_number)

          return (
            <div key={row} className="flex items-center gap-3">
              {/* Row Label */}
              <span className="w-8 text-center font-bold text-white text-sm bg-[#2A2A2A] rounded-lg py-2 border border-[#404040]">
                {row}
              </span>

              {/* Seats */}
              <div className="flex gap-2">
                {rowSeats.map((seat, index) => {
                  const seatId = `${seat.row_label}${seat.seat_number}`
                  const state = getSeatState(seat)
                  const isDisabled = state === seatStates.booked

                  // Add aisle gap after middle seat (if row has many seats)
                  const middleSeat = Math.floor(rowSeats.length / 2)
                  const aisleGap = index === middleSeat - 1 ? "mr-4" : ""

                  return (
                    <button
                      key={seat.id}
                      onClick={() => !isDisabled && onSeatSelect(seatId)}
                      disabled={isDisabled}
                      className={`${getSeatStyle(state)} ${aisleGap}`}
                      title={`${seatId}${getSeatLabel(state, seat.seat_type)}`}
                    >
                      {getSeatIcon(state)}

                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {seatId}
                        {getSeatLabel(state, seat.seat_type)}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Row Label (Right) */}
              <span className="w-8 text-center font-bold text-white text-sm bg-[#2A2A2A] rounded-lg py-2 border border-[#404040]">
                {row}
              </span>
            </div>
          )
        })}
      </div>

      {/* Column Numbers */}
      {rows.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="w-8" /> {/* Spacer for row label */}
          <div className="flex gap-2">
            {seatsByRow[rows[0]].sort((a, b) => a.seat_number - b.seat_number).map((seat, index) => {
              const middleSeat = Math.floor(seatsByRow[rows[0]].length / 2)
              const aisleGap = index === middleSeat - 1 ? "mr-4" : ""
              return (
                <span
                  key={seat.seat_number}
                  className={`w-10 text-center text-xs text-[#808080] ${aisleGap}`}
                >
                  {seat.seat_number}
                </span>
              )
            })}
          </div>
          <span className="w-8" /> {/* Spacer for row label */}
        </div>
      )}
    </div>
  )
}
