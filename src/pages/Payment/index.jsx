import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Header from "../../layouts/header"
import PaymentForm from "../../components/common/payment-form"
import OrderSummary from "../../components/common/OrderSummary"

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // null, 'success', 'error'
  const [error, setError] = useState(null)

  // Mock thông tin đặt vé (trong thực tế lấy từ context/state)
  const bookingData = {
    movie: "Dune: Phần Hai",
    showtime: "04/12/2024 - 20:00",
    hall: "Phòng chiếu 1",
    seats: ["A5", "A6"],
    ticketCount: 2,
    subtotal: 300000,
    serviceFee: 10000,
    total: 310000,
  }

  const handlePayment = async (formData) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Giả lập thời gian xử lý thanh toán
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Giả lập lỗi thanh toán ngẫu nhiên (20% thất bại)
      if (Math.random() > 0.8) {
        throw new Error("Thanh toán bị từ chối. Vui lòng kiểm tra lại thông tin thẻ và thử lại.")
      }

      // Thành công
      setPaymentStatus('success')

      // Chuyển đến trang vé sau 3 giây
      setTimeout(() => {
        window.location.href = "/tickets"
      }, 3000)
    } catch (err) {
      setError(err.message)
      setPaymentStatus('error')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0D0D0D] py-8">
        <div className="max-w-7xl mx-auto px-8">

          {/* Nút quay lại */}
          <Link
            to="/booking/1"
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
                          Ghế bạn chọn đã được trả lại. Hãy chọn lại ghế để tiếp tục đặt vé.
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

                        <Link to="/booking/1">
                          <button className="bg-[#2A2A2A] hover:bg-[#333333] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 border border-[#404040]">
                            Chọn ghế lại
                          </button>
                        </Link>
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
                    <p className="text-[#B3B3B3] text-sm">Đang chuyển đến trang vé...</p>
                  </div>
                </div>
              )}

              {/* Form chỉ hiển thị khi chưa thanh toán thành công */}
              {paymentStatus !== 'success' && (
                <PaymentForm
                  onSubmit={handlePayment}
                  isProcessing={isProcessing}
                  bookingData={bookingData}
                />
              )}
            </div>

            {/* Chi tiết hóa đơn */}
            <div className="lg:col-span-1">
              <OrderSummary bookingData={bookingData} />
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
