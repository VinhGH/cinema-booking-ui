

export default function ShowtimeCard({ showtime, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 transition text-left ${
        isSelected ? "border-primary bg-primary/10" : "border-border bg-secondary/5 hover:border-primary/50"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-lg">{showtime.time}</p>
          <p className="text-secondary text-sm">{showtime.date}</p>
        </div>
        <span className="text-primary font-bold">${(showtime.price / 1000).toFixed(0)}K</span>
      </div>

      <div className="text-sm text-secondary mb-2">
        {showtime.hall} • {showtime.availableSeats} seats left
      </div>

      {showtime.availableSeats < 10 && (
        <p className="text-warning text-xs font-bold">⚠ Only {showtime.availableSeats} seats available</p>
      )}
    </button>
  )
}
