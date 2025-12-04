import { Link } from "react-router-dom"

export default function BookingSummary({ movie, selectedSeats }) {
  const totalPrice = selectedSeats.length * movie.pricePerSeat

  return (
    <div className="bg-secondary/5 border border-border p-6 rounded-lg sticky top-24">
      <h3 className="font-bold text-lg mb-4">Booking Summary</h3>

      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Movie</span>
          <span className="text-foreground font-bold">{movie.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Date & Time</span>
          <span className="text-foreground font-bold">{movie.showtime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Hall</span>
          <span className="text-foreground font-bold">{movie.hall}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Seats</span>
          <span className="text-foreground font-bold">
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Subtotal</span>
          <span className="text-foreground">${(totalPrice / 1000).toFixed(0)}K</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Service Fee</span>
          <span className="text-foreground">$5K</span>
        </div>
        <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
          <span className="text-foreground">Total</span>
          <span className="text-primary text-lg">${(totalPrice / 1000 + 5).toFixed(0)}K</span>
        </div>
      </div>

      <Link to="/payment" aria-disabled={selectedSeats.length === 0} style={{ pointerEvents: selectedSeats.length === 0 ? 'none' : 'auto' }}>
        <button
          disabled={selectedSeats.length === 0}
          className={`w-full font-bold py-3 rounded-lg transition ${selectedSeats.length === 0
              ? "bg-secondary/20 text-secondary cursor-not-allowed"
              : "bg-primary hover:bg-red-600 text-background"
            }`}
        >
          Proceed to Payment
        </button>
      </Link>

      <p className="text-xs text-secondary text-center mt-4">Select seats to continue</p>
    </div>
  )
}
