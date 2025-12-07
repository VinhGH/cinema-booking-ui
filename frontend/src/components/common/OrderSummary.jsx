import { useState, useEffect } from "react"
import { Film, Calendar, MapPin, Armchair, Clock, Tag } from "lucide-react"

export default function OrderSummary({ bookingData }) {
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    // Redirect or show timeout message
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const isUrgent = timeLeft < 120 // Less than 2 minutes

    return (
        <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6 sticky top-24 space-y-6">
            {/* Timer */}
            <div className={`p-4 rounded-lg border-2 ${isUrgent
                    ? 'bg-red-500/10 border-red-500 animate-pulse'
                    : 'bg-[#2A2A2A] border-[#404040]'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-[#E50914]'}`} />
                        <span className={`text-sm font-semibold ${isUrgent ? 'text-red-500' : 'text-white'}`}>
                            Time Remaining
                        </span>
                    </div>
                    <span className={`text-2xl font-bold font-mono ${isUrgent ? 'text-red-500' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
                {isUrgent && (
                    <p className="text-xs text-red-400 mt-2">⚠️ Hurry! Your seats will be released soon</p>
                )}
            </div>

            {/* Order Summary Header */}
            <div className="pb-4 border-b border-[#404040]">
                <h3 className="text-xl font-bold text-white">Order Summary</h3>
            </div>

            {/* Movie Info */}
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Film className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-[#808080]">Movie</p>
                        <p className="text-white font-semibold">{bookingData?.movie || "Dune: Part Two"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-[#808080]">Date & Time</p>
                        <p className="text-white font-semibold">{bookingData?.showtime || "Dec 4, 2024 - 20:00"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-[#808080]">Hall</p>
                        <p className="text-white font-semibold">{bookingData?.hall || "Hall 1"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Armchair className="w-5 h-5 text-[#808080] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-[#808080]">Seats</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {(bookingData?.seats || ["A5", "A6"]).map((seat) => (
                                <span
                                    key={seat}
                                    className="px-2 py-1 bg-[#E50914] text-white text-xs font-bold rounded"
                                >
                                    {seat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#404040]">
                <div className="flex justify-between text-sm">
                    <span className="text-[#B3B3B3]">Tickets ({bookingData?.ticketCount || 2})</span>
                    <span className="text-white font-semibold">
                        {formatPrice(bookingData?.subtotal || 300000)}
                    </span>
                </div>

                {bookingData?.discount && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-400 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Discount
                        </span>
                        <span className="text-green-400 font-semibold">
                            -{formatPrice(bookingData.discount)}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span className="text-[#B3B3B3]">Service Fee</span>
                    <span className="text-white font-semibold">
                        {formatPrice(bookingData?.serviceFee || 10000)}
                    </span>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 bg-[#2A2A2A] border border-[#404040] rounded-lg px-4">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-[#E50914] font-bold text-2xl">
                    {formatPrice(bookingData?.total || 310000)}
                </span>
            </div>

            {/* Info */}
            <div className="bg-[#2A2A2A] border border-[#404040] rounded-lg p-3">
                <p className="text-xs text-[#B3B3B3] leading-relaxed">
                    By completing this purchase, you agree to our terms and conditions.
                    Tickets are non-refundable once payment is confirmed.
                </p>
            </div>
        </div>
    )
}
