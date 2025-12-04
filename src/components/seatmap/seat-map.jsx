import { Armchair } from "lucide-react"

export default function SeatMap({ selectedSeats, onSeatSelect }) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const cols = 12

  const seatStates = {
    available: "available",
    selected: "selected",
    sold: "sold",
    vip: "vip",
    pending: "pending",
  }

  // Simulate seat states with more realistic distribution
  const getSeatState = (row, col) => {
    const seatId = `${row}${col}`

    if (selectedSeats.includes(seatId)) return seatStates.selected

    // Sold seats (scattered)
    const soldSeats = ["A3", "A8", "B5", "B6", "C2", "C9", "D4", "D7", "E3", "E10", "F5", "F8"]
    if (soldSeats.includes(seatId)) return seatStates.sold

    // VIP seats (last two rows, middle seats)
    if (["G", "H"].includes(row) && col >= 4 && col <= 9) {
      return seatStates.vip
    }

    // Pending seats (very few)
    const pendingSeats = ["C5", "D6"]
    if (pendingSeats.includes(seatId)) return seatStates.pending

    return seatStates.available
  }

  const getSeatStyle = (state) => {
    const baseStyle = "w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center relative group"

    switch (state) {
      case seatStates.available:
        return `${baseStyle} bg-[#2A2A2A] border-2 border-[#404040] hover:border-[#4ade80] hover:bg-[#4ade80]/10 cursor-pointer hover:scale-110`
      case seatStates.selected:
        return `${baseStyle} bg-[#E50914] border-2 border-[#E50914] shadow-lg shadow-[#E50914]/50 scale-110`
      case seatStates.sold:
        return `${baseStyle} bg-[#6b7280] border-2 border-[#6b7280] cursor-not-allowed opacity-50`
      case seatStates.vip:
        return `${baseStyle} bg-gradient-to-br from-[#a855f7] to-[#7c3aed] border-2 border-[#a855f7] hover:border-[#c084fc] hover:scale-110 cursor-pointer shadow-lg shadow-purple-500/30`
      case seatStates.pending:
        return `${baseStyle} bg-[#fbbf24] border-2 border-[#fbbf24] cursor-not-allowed animate-pulse-seat`
      default:
        return baseStyle
    }
  }

  const getSeatIcon = (state) => {
    if (state === seatStates.sold) {
      return <span className="text-[#404040] text-xs">✕</span>
    }
    if (state === seatStates.selected) {
      return <Armchair className="w-5 h-5 text-white" />
    }
    if (state === seatStates.vip) {
      return <Armchair className="w-5 h-5 text-white" />
    }
    if (state === seatStates.pending) {
      return <span className="text-white text-xs">⏳</span>
    }
    return <Armchair className="w-5 h-5 text-[#808080]" />
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
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-3">
            {/* Row Label */}
            <span className="w-8 text-center font-bold text-white text-sm bg-[#2A2A2A] rounded-lg py-2 border border-[#404040]">
              {row}
            </span>

            {/* Seats */}
            <div className="flex gap-2">
              {Array.from({ length: cols }).map((_, colIndex) => {
                const col = colIndex + 1
                const seatId = `${row}${col}`
                const state = getSeatState(row, col)
                const isDisabled = state === seatStates.sold || state === seatStates.pending

                // Add aisle gap after seat 6
                const aisleGap = col === 6 ? "mr-4" : ""

                return (
                  <button
                    key={seatId}
                    onClick={() => !isDisabled && onSeatSelect(seatId)}
                    disabled={isDisabled}
                    className={`${getSeatStyle(state)} ${aisleGap}`}
                    title={`${seatId}${state === seatStates.vip ? ' (VIP)' : ''}`}
                  >
                    {getSeatIcon(state)}

                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {seatId}
                      {state === seatStates.vip && " (VIP)"}
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
        ))}
      </div>

      {/* Column Numbers */}
      <div className="flex items-center gap-3">
        <span className="w-8" /> {/* Spacer for row label */}
        <div className="flex gap-2">
          {Array.from({ length: cols }).map((_, colIndex) => {
            const col = colIndex + 1
            const aisleGap = col === 6 ? "mr-4" : ""
            return (
              <span
                key={col}
                className={`w-10 text-center text-xs text-[#808080] ${aisleGap}`}
              >
                {col}
              </span>
            )
          })}
        </div>
        <span className="w-8" /> {/* Spacer for row label */}
      </div>
    </div>
  )
}
