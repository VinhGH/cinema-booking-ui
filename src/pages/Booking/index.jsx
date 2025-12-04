import { useState } from "react"
import { useParams, useSearchParams, Link } from "react-router-dom"
import { ArrowLeft, Armchair, Info } from "lucide-react"
import Header from "../../layouts/header"
import SeatMap from "../../components/seatmap/seat-map"
import BookingSummary from "../../components/common/booking-summary"
import { getMovieById } from "../../data/movies"

export default function BookingPage() {
  const { id: movieId } = useParams()
  const [searchParams] = useSearchParams()
  const showtimeId = searchParams.get("showtime")
  const [selectedSeats, setSelectedSeats] = useState([])

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => {
      // Giới hạn tối đa 10 ghế
      if (!prev.includes(seatId) && prev.length >= 10) {
        return prev
      }
      return prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    })
  }

  // Lấy dữ liệu phim
  const movie = getMovieById(movieId)

  // Mock data nếu không tìm thấy
  const movieData = movie || {
    title: "Dune: Phần Hai",
    poster: "/placeholder.svg"
  }

  // Mock data suất chiếu
  const showtimeData = {
    date: "04/12/2024",
    time: "20:00",
    hall: "Phòng chiếu 1",
    pricePerSeat: 150000,
  }

  const bookingInfo = {
    ...movieData,
    showtime: `${showtimeData.date} - ${showtimeData.time}`,
    hall: showtimeData.hall,
    pricePerSeat: showtimeData.pricePerSeat,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0D0D0D] py-8">
        <div className="max-w-7xl mx-auto px-8">
          {/* Nút quay lại */}
          <Link
            to={`/movie/${movieId}`}
            className="inline-flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại thông tin phim</span>
          </Link>

          {/* Tiêu đề trang */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Chọn Ghế Ngồi</h1>
            <p className="text-[#B3B3B3]">
              Vui lòng chọn ghế cho phim <span className="text-white font-semibold">{movieData.title}</span>
            </p>
          </div>

          {/* Bố cục nội dung */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Khu vực sơ đồ ghế */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bản đồ ghế */}
              <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-8 overflow-x-auto">
                <SeatMap selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
              </div>

              {/* Chú thích ghế */}
              <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-[#E50914]" />
                  <h3 className="font-bold text-white">Trạng thái ghế</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Ghế trống */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2A2A2A] border-2 border-[#404040] rounded-lg flex items-center justify-center">
                      <Armchair className="w-5 h-5 text-[#808080]" />
                    </div>
                    <span className="text-sm text-[#B3B3B3]">Trống</span>
                  </div>

                  {/* Đang chọn */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E50914] border-2 border-[#E50914] rounded-lg flex items-center justify-center shadow-lg shadow-[#E50914]/50">
                      <Armchair className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-[#B3B3B3]">Đã chọn</span>
                  </div>

                  {/* Đã bán */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6b7280] border-2 border-[#6b7280] rounded-lg flex items-center justify-center opacity-50">
                      <span className="text-[#404040] text-xs">✕</span>
                    </div>
                    <span className="text-sm text-[#B3B3B3]">Đã bán</span>
                  </div>

                  {/* VIP */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#a855f7] to-[#7c3aed] border-2 border-[#a855f7] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Armchair className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-[#B3B3B3]">VIP</span>
                  </div>

                  {/* Chờ xử lý */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#fbbf24] border-2 border-[#fbbf24] rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">⏳</span>
                    </div>
                    <span className="text-sm text-[#B3B3B3]">Tạm giữ</span>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="mt-4 bg-[#2A2A2A] border border-[#404040] rounded-lg p-3">
                  <p className="text-xs text-[#B3B3B3] leading-relaxed">
                    <span className="text-white font-semibold">Lưu ý:</span>
                    Ghế VIP (hàng G-H, trung tâm) có giá bằng 1.5 lần ghế thường. Mỗi lượt đặt chỉ được chọn tối đa 10 ghế.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar tổng quan đặt vé */}
            <div className="lg:col-span-1">
              <BookingSummary movie={bookingInfo} selectedSeats={selectedSeats} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
