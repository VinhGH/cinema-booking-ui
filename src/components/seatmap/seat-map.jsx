

export default function SeatMap({ selectedSeats, onSeatSelect }) {
  const rows = ["A", "B", "C", "D", "E", "F"]
  const cols = 10

  const seatStates = {
    available: "available",
    selected: "selected",
    sold: "sold",
    locked: "locked",
    pending: "pending",
  }

  // Simulate seat states
  const getSeatState = (row, col) => {
    const seatId = `${row}${col}`
    if (selectedSeats.includes(seatId)) return seatStates.selected
    if ([`${row}2`, `${row}5`].includes(seatId)) return seatStates.sold
    if (Math.random() > 0.95) return seatStates.locked
    if (Math.random() > 0.97) return seatStates.pending
    return seatStates.available
  }

  const getSeatColor = (state) => {
    switch (state) {
      case seatStates.available:
        return "bg-white border-2 border-secondary hover:border-primary cursor-pointer"
      case seatStates.selected:
        return "bg-success border-2 border-success"
      case seatStates.sold:
        return "bg-error border-2 border-error cursor-not-allowed"
      case seatStates.locked:
        return "bg-warning border-2 border-warning cursor-not-allowed"
      case seatStates.pending:
        return "bg-secondary border-2 border-secondary animate-pulse-seat cursor-not-allowed"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center mb-4">
        <p className="text-foreground text-sm font-bold">SCREEN</p>
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent my-2 w-48"></div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-3">
            <span className="w-6 text-center font-bold text-secondary text-sm">{row}</span>
            <div className="flex gap-2">
              {Array.from({ length: cols }).map((_, colIndex) => {
                const seatId = `${row}${colIndex + 1}`
                const state = getSeatState(row, colIndex + 1)
                const isDisabled =
                  state === seatStates.sold || state === seatStates.locked || state === seatStates.pending

                return (
                  <button
                    key={seatId}
                    onClick={() => !isDisabled && onSeatSelect(seatId)}
                    disabled={isDisabled}
                    className={`w-8 h-8 rounded text-xs font-bold transition ${getSeatColor(state)}`}
                    title={seatId}
                  >
                    {colIndex + 1}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
