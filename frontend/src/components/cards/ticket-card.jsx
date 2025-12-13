import { Calendar, Clock, MapPin, Armchair, QrCode, X, CheckCircle, XCircle } from "lucide-react"

export default function TicketCard({ ticket, onCancel }) {
  // Combine date and time for accurate comparison
  const showDateTime = new Date(`${ticket.date}T${ticket.time}`)
  const now = new Date()
  const isUpcoming = showDateTime > now
  const canCancel = isUpcoming && (ticket.status === "confirmed" || ticket.status === "pending")
  const isCancelled = ticket.status === "cancelled"

  // Debug logging
  console.log('🎫 [TicketCard] Ticket:', ticket.id)
  console.log('  📅 Date:', ticket.date, 'Time:', ticket.time)
  console.log('  🕐 Show DateTime:', showDateTime.toLocaleString('vi-VN'))
  console.log('  🕐 Now:', now.toLocaleString('vi-VN'))
  console.log('  ⏰ isUpcoming:', isUpcoming)
  console.log('  📊 Status:', ticket.status)
  console.log('  ✅ canCancel:', canCancel)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          icon: CheckCircle
        }
      case "cancelled":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: XCircle
        }
      default:
        return {
          bg: "bg-[#2A2A2A]",
          border: "border-[#404040]",
          text: "text-[#B3B3B3]",
          icon: CheckCircle
        }
    }
  }

  const statusConfig = getStatusConfig(ticket.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className={`bg-[#1A1A1A] border-2 rounded-xl overflow-hidden transition-all duration-200 ${isCancelled
      ? 'border-[#404040] opacity-60'
      : 'border-[#404040] hover:border-[#E50914]'
      }`}>
      <div className="flex flex-col md:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{ticket.movieTitle}</h3>
              <p className="text-sm text-[#808080]">Mã Đặt Vé: {ticket.id}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border ${statusConfig.bg} ${statusConfig.border} flex items-center gap-2`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
              <span className={`text-sm font-semibold ${statusConfig.text} uppercase`}>
                {ticket.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#808080] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#808080]">Date</p>
                <p className="text-sm font-semibold text-white">{formatDate(ticket.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#808080] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#808080]">Time</p>
                <p className="text-sm font-semibold text-white">{ticket.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#808080] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#808080]">Hall</p>
                <p className="text-sm font-semibold text-white">{ticket.hall}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Armchair className="w-4 h-4 text-[#808080] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-[#808080]">Seats</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ticket.seats.map((seat) => (
                    <span
                      key={seat}
                      className="px-2 py-0.5 bg-[#E50914] text-white text-xs font-bold rounded"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Date */}
          <div className="text-xs text-[#808080]">
            Booked on {new Date(ticket.bookingDate).toLocaleDateString('vi-VN')}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-[#2A2A2A] border-t md:border-t-0 md:border-l border-[#404040] p-6 flex flex-col items-center justify-center min-w-[200px]">
          <div className="text-center mb-3">
            <QrCode className="w-5 h-5 text-[#808080] mx-auto mb-1" />
            <p className="text-xs text-[#808080]">Scan at entrance</p>
          </div>

          {/* QR Code Placeholder */}
          <div className={`w-32 h-32 rounded-lg flex items-center justify-center ${isCancelled ? 'bg-[#404040]' : 'bg-white'
            }`}>
            {isCancelled ? (
              <X className="w-16 h-16 text-[#808080]" />
            ) : (
              <div className="w-full h-full p-2">
                {/* Simple QR-like pattern */}
                <div className="grid grid-cols-8 gap-0.5 w-full h-full">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cancel Button */}
          {canCancel && (
            <button
              onClick={() => {
                // Calculate refund based on time until show
                const showDateTime = new Date(`${ticket.date}T${ticket.time}`)
                const now = new Date()
                const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60)

                let refundPercentage = 0
                if (hoursUntilShow >= 24) refundPercentage = 100
                else if (hoursUntilShow >= 2) refundPercentage = 50

                const message = refundPercentage > 0
                  ? `Bạn có chắc muốn hủy vé này?\n\nSố tiền hoàn lại: ${refundPercentage}% (${(ticket.totalAmount * refundPercentage / 100).toLocaleString('vi-VN')} ₫)\n\nTiền sẽ được hoàn vào ví của bạn.`
                  : `Bạn có chắc muốn hủy vé này?\n\n⚠️ Không được hoàn tiền (còn <2h trước suất chiếu)`

                if (window.confirm(message)) {
                  onCancel()
                }
              }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 w-full"
            >
              <X className="w-4 h-4" />
              Hủy Vé
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
