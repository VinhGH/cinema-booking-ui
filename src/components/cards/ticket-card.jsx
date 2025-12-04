

export default function TicketCard({ ticket, onCancel }) {
  const isUpcoming = new Date(ticket.date) > new Date()
  const canCancel = isUpcoming && ticket.status === "confirmed"

  return (
    <div className="bg-secondary/5 border border-border rounded-lg p-6 flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-3">{ticket.movieTitle}</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <p className="text-secondary">Date</p>
            <p className="font-bold text-foreground">{ticket.date}</p>
          </div>
          <div>
            <p className="text-secondary">Time</p>
            <p className="font-bold text-foreground">{ticket.time}</p>
          </div>
          <div>
            <p className="text-secondary">Hall</p>
            <p className="font-bold text-foreground">{ticket.hall}</p>
          </div>
          <div>
            <p className="text-secondary">Seats</p>
            <p className="font-bold text-foreground">{ticket.seats.join(", ")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded ${
              ticket.status === "confirmed" ? "bg-success/20 text-success" : "bg-error/20 text-error"
            }`}
          >
            {ticket.status.toUpperCase()}
          </span>
          <span className="text-secondary">Ref: {ticket.id}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="text-secondary text-xs mb-1">QR Code</p>
          <div className="w-24 h-24 bg-foreground rounded flex items-center justify-center">
            <span className="text-background text-xs">▪▪▪▪▪</span>
          </div>
        </div>

        {canCancel && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to cancel this ticket?")) {
                onCancel()
              }
            }}
            className="text-error hover:text-red-600 text-sm font-bold transition"
          >
            Cancel Ticket
          </button>
        )}
      </div>
    </div>
  )
}
