import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Header from "../../layouts/header"
import PaymentForm from "../../components/common/payment-form"
import OrderSummary from "../../components/common/OrderSummary"
import { bookingsApi } from "../../services/api"

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // null, 'success', 'error'
  const [error, setError] = useState(null)
  const [bookingId, setBookingId] = useState(null)

  // Get booking data from navigation state
  const bookingData = location.state?.bookingData

  console.log('💳 [Payment] Page loaded')
  console.log('💳 [Payment] Booking data from navigation:', bookingData)

  // Redirect if no booking data
  if (!bookingData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0D0D0D] py-8">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <p className="text-secondary text-xl mb-4">Không tìm thấy thông tin đặt vé</p>
                <Link to="/" className="text-primary hover:underline">
                  ← Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  const handlePayment = async (formData) => {
    console.log('💳 [Payment] Payment initiated')
    console.log('💳 [Payment] Form data:', formData)

    setIsProcessing(true)
    setError(null)

    try {
      const bookingPayload = {
        showtime_id: bookingData.showtime.id,
        seats: bookingData.seats.ids,
        concessions: [], // Can add concessions later
        points_used: 0, // Can add points later
        payment_method: formData.paymentMethod,
      }

      console.log('📦 [Payment] Booking payload:', JSON.stringify(bookingPayload, null, 2))
      console.log('📦 [Payment] Seats array:', bookingPayload.seats)
      console.log('📦 [Payment] Seats count:', bookingPayload.seats.length)

      // Create booking
      console.log('🔄 [Payment] Calling bookings API...')
      const booking = await bookingsApi.create(bookingPayload)
      console.log('✅ [Payment] Booking created successfully:', booking)

      // Success
      setBookingId(booking.id)
      setPaymentStatus('success')

      // Navigate to home page after 3 seconds
      console.log('🎫 [Payment] Redirecting to home page in 3 seconds...')
      setTimeout(() => {
        navigate('/', {
          state: {
            bookingSuccess: true,
            bookingId: booking.id,
            bookingCode: booking.booking_code,
            message: 'Đặt vé thành công!'
          }
        })
      }, 3000)
    } catch (err) {
      console.error('❌ [Payment] Booking creation error:', err)
      console.error('❌ [Payment] Error message:', err.message)
      console.error('❌ [Payment] Error stack:', err.stack)
      setError(err.message || 'Đã xảy ra lỗi khi tạo booking. Vui lòng thử lại.')
      setPaymentStatus('error')
      setIsProcessing(false)
    }
  }

  // Format booking data for OrderSummary component
  const orderSummaryData = {
    movie: bookingData.movie.title,
    showtime: bookingData.showtime.date,
    hall: bookingData.showtime.hall,
    cinema: bookingData.showtime.cinema,
    seats: bookingData.seats.labels,
    ticketCount: bookingData.seats.count,
    subtotal: bookingData.pricing.subtotal,
    serviceFee: bookingData.pricing.serviceFee,
    total: bookingData.pricing.total,
  }

  console.log('📋 [Payment] Order summary data:', orderSummaryData)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0D0D0D] py-8">
        <div className="max-w-7xl mx-auto px-8">

          {/* Nút quay lại */}
          <Link
            to={-1}
            className="inline-flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại chọn ghế</span>
          </Link>

          {/* Tiêu đề trang */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Thanh Toán Đơn Hàng</h1>
            <p className="text-[#B3B3B3]">
              Giao dịch được bảo mật bằng chuẩn mã hóa an toàn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form thanh toán */}
            <div className="lg:col-span-2">

              {/* Hiển thị lỗi thanh toán */}
              {paymentStatus === 'error' && error && (
                <div className="mb-6 bg-red-500/10 border-2 border-red-500 rounded-xl p-6 animate-slide-up">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-red-500 font-bold text-lg mb-2">Thanh toán thất bại</h3>
                      <p className="text-red-400 mb-4">{error}</p>

                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Vui lòng kiểm tra lại thông tin và thử lại.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setPaymentStatus(null)
                            setError(null)
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                          Thử lại
                        </button>

                        <button
                          onClick={() => navigate(-1)}
                          className="bg-[#2A2A2A] hover:bg-[#333333] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 border border-[#404040]"
                        >
                          Chọn ghế lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thành công */}
              {paymentStatus === 'success' && (
                <div className="mb-6 bg-green-500/10 border-2 border-green-500 rounded-xl p-8 animate-slide-up">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-green-500 font-bold text-2xl mb-2">Thanh toán thành công!</h3>
                    <p className="text-green-400 mb-4">
                      Đơn vé của bạn đã được xác nhận. Thông tin vé đã được gửi qua email.
                    </p>
                    {bookingId && (
                      <p className="text-[#B3B3B3] text-sm mb-2">
                        Mã đặt vé: <span className="text-white font-mono">{bookingId}</span>
                      </p>
                    )}
                    <p className="text-[#B3B3B3] text-sm">Đang chuyển đến trang vé...</p>
                  </div>
                </div>
              )}

              {/* Form chỉ hiển thị khi chưa thanh toán thành công */}
              {paymentStatus !== 'success' && (
                <PaymentForm
                  onSubmit={handlePayment}
                  isProcessing={isProcessing}
                  bookingData={orderSummaryData}
                />
              )}
            </div>

            {/* Chi tiết hóa đơn */}
            <div className="lg:col-span-1">
              <OrderSummary bookingData={orderSummaryData} />
            </div>
          </div>

          {/* Thông tin bảo mật */}
          <div className="mt-8 bg-[#1A1A1A] border border-[#404040] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Bảo mật thanh toán</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#B3B3B3]">
              <div>
                <p className="font-semibold text-white mb-1">🔒 SSL mã hóa</p>
                <p>Thông tin được bảo vệ bằng SSL 256-bit</p>
              </div>

              <div>
                <p className="font-semibold text-white mb-1">💳 Tuân thủ PCI</p>
                <p>Không lưu trữ thông tin thẻ của bạn</p>
              </div>

              <div>
                <p className="font-semibold text-white mb-1">✓ Đáng tin cậy</p>
                <p>Được nhiều khách hàng lựa chọn</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
