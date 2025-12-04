import { Calendar, Clock, MapPin, Users, Star, Play, Info } from "lucide-react"
import { useState } from "react"

export default function ShowtimeSelector({ showtimes = [], onSelect, selectedShowtime }) {
    const [selectedDate, setSelectedDate] = useState(null)

    // Group showtimes by date
    const showtimesByDate = showtimes.reduce((acc, showtime) => {
        if (!acc[showtime.date]) {
            acc[showtime.date] = []
        }
        acc[showtime.date].push(showtime)
        return acc
    }, {})

    const dates = Object.keys(showtimesByDate).sort()

    // Auto-select first date if none selected
    if (!selectedDate && dates.length > 0) {
        setSelectedDate(dates[0])
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (date.toDateString() === today.toDateString()) {
            return "Hôm Nay"
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Ngày Mai"
        }

        return date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    return (
        <div className="space-y-6">
            {/* Date Selector */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E50914]" />
                    Chọn Ngày
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {dates.map((date) => (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${selectedDate === date
                                ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/30'
                                : 'bg-[#2A2A2A] text-[#B3B3B3] hover:bg-[#333333] hover:text-white border border-[#404040]'
                                }`}
                        >
                            {formatDate(date)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Showtime Grid */}
            {selectedDate && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#E50914]" />
                        Chọn Suất Chiếu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {showtimesByDate[selectedDate]?.map((showtime) => {
                            const isSelected = selectedShowtime?.id === showtime.id
                            const isLowSeats = showtime.availableSeats < 10
                            const isSoldOut = showtime.availableSeats === 0

                            return (
                                <button
                                    key={showtime.id}
                                    onClick={() => !isSoldOut && onSelect(showtime)}
                                    disabled={isSoldOut}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSoldOut
                                        ? 'bg-[#1A1A1A] border-[#404040] opacity-50 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-[#E50914]/10 border-[#E50914] shadow-lg shadow-[#E50914]/20'
                                            : 'bg-[#2A2A2A] border-[#404040] hover:border-[#E50914] hover:bg-[#333333]'
                                        }`}
                                >
                                    {/* Time */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`text-2xl font-bold ${isSoldOut ? 'text-[#808080]' : 'text-white'
                                            }`}>
                                            {showtime.time}
                                        </span>
                                        {isSelected && !isSoldOut && (
                                            <div className="w-6 h-6 bg-[#E50914] rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hall & Price */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-[#B3B3B3]">
                                            <MapPin className="w-4 h-4" />
                                            <span>{showtime.hall}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#B3B3B3]">
                                            <Users className="w-4 h-4" />
                                            <span className={isLowSeats && !isSoldOut ? 'text-yellow-500 font-semibold' : ''}>
                                                {isSoldOut ? 'Hết Vé' : `${showtime.availableSeats} ghế còn lại`}
                                            </span>
                                        </div>
                                        <div className="text-[#E50914] font-bold text-base mt-2">
                                            {formatPrice(showtime.price)}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
