import { useState, useEffect } from "react"
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Armchair, Info } from "lucide-react"
import Header from "../../layouts/header"
import SeatMap from "../../components/seatmap/seat-map"
import BookingSummary from "../../components/common/booking-summary"
import { moviesApi, showtimesApi } from "../../services/api"

export default function BookingPage() {
  const { id: movieId } = useParams()
  const [searchParams] = useSearchParams()
  const showtimeId = searchParams.get("showtime")
  const navigate = useNavigate()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [movie, setMovie] = useState(null)
  const [showtime, setShowtime] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        console.log('🎬 [Booking] Starting to fetch booking data...')
        console.log('📍 [Booking] Movie ID:', movieId)
        console.log('📍 [Booking] Showtime ID:', showtimeId)

        setLoading(true)
        setError(null)

        if (!showtimeId) {
          throw new Error("Showtime ID is required")
        }

        // Fetch movie, showtime, and seat data in parallel
        console.log('🔄 [Booking] Fetching movie, showtime, and seats in parallel...')
        const [movieData, showtimeData, seatData] = await Promise.all([
          moviesApi.getById(movieId),
          showtimesApi.getById(showtimeId),
          showtimesApi.getSeats(showtimeId)
        ])

        console.log('✅ [Booking] Movie data received:', movieData)
        console.log('✅ [Booking] Showtime data received:', showtimeData)
        console.log('✅ [Booking] Seats data received:', seatData.length, 'seats')

        setMovie(movieData)
        setShowtime(showtimeData)
        setSeats(seatData)

        console.log('🎉 [Booking] All data loaded successfully!')
      } catch (err) {
        console.error('❌ [Booking] Error fetching booking data:', err)
        console.error('❌ [Booking] Error details:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingData()
  }, [movieId, showtimeId])

  const handleSeatSelect = (seatId) => {
    console.log('🪑 [Booking] Seat clicked:', seatId)
    setSelectedSeats((prev) => {
      // Giới hạn tối đa 10 ghế
      if (!prev.includes(seatId) && prev.length >= 10) {
        console.warn('⚠️ [Booking] Maximum 10 seats reached!')
        return prev
      }
      const newSeats = prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]

      console.log('🪑 [Booking] Selected seats updated:', newSeats)
      return newSeats
    })
  }

  // Prepare booking info for summary component
  const bookingInfo = movie && showtime ? {
    title: movie.title,
    poster: movie.poster_url || movie.poster,
    showtime: `${new Date(showtime.show_date).toLocaleDateString('vi-VN')} - ${showtime.show_time}`,
    hall: showtime.halls?.name || 'N/A',
    cinema: showtime.halls?.cinemas?.name || 'N/A',
    pricePerSeat: showtime.price,
    showtimeId: showtime.id,
    movieId: movie.id
  } : null

  if (bookingInfo) {
    console.log('📋 [Booking] Booking info prepared:', bookingInfo)
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

          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-secondary">Đang tải thông tin đặt vé...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-red-500 text-xl mb-4">Lỗi: {error}</p>
                <Link to={`/movie/${movieId}`} className="text-primary hover:underline">
                  ← Quay lại trang phim
                </Link>
              </div>
            </div>
          ) : !movie || !showtime ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-secondary text-xl">Không tìm thấy thông tin đặt vé</p>
                <Link to="/" className="mt-4 inline-block text-primary hover:underline">
                  ← Về trang chủ
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Tiêu đề trang */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Chọn Ghế Ngồi</h1>
                <p className="text-[#B3B3B3]">
                  Vui lòng chọn ghế cho phim <span className="text-white font-semibold">{movie.title}</span>
                </p>
              </div>

              {/* Bố cục nội dung */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Khu vực sơ đồ ghế */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bản đồ ghế */}
                  <div className="bg-[#1A1A1A] border border-[#404040] rounded-xl p-8 overflow-x-auto">
                    <SeatMap
                      selectedSeats={selectedSeats}
                      onSeatSelect={handleSeatSelect}
                      seats={seats}
                    />
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

                      {/* Couple */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#ec4899] to-[#db2777] border-2 border-[#ec4899] rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/30">
                          <Armchair className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-[#B3B3B3]">Couple</span>
                      </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="mt-4 bg-[#2A2A2A] border border-[#404040] rounded-lg p-3">
                      <p className="text-xs text-[#B3B3B3] leading-relaxed">
                        <span className="text-white font-semibold">Lưu ý:</span>
                        {' '}Ghế VIP có giá bằng 1.5 lần ghế thường. Ghế Couple có giá bằng 1.3 lần ghế thường. Mỗi lượt đặt chỉ được chọn tối đa 10 ghế.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sidebar tổng quan đặt vé */}
                <div className="lg:col-span-1">
                  <BookingSummary
                    movie={bookingInfo}
                    selectedSeats={selectedSeats}
                    seats={seats}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
