import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, CheckCircle, UserPlus } from 'lucide-react'
import Header from '../../layouts/header'
import { registrationApi } from '../../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Form, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for OTP
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, countdown])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Step 1: Submit registration form and request OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate Gmail only
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      setError('Email phải có định dạng @gmail.com')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setLoading(false)
      return
    }

    if (!formData.phone || formData.phone.length < 10) {
      setError('Số điện thoại phải có ít nhất 10 chữ số')
      setLoading(false)
      return
    }

    try {
      await registrationApi.requestOTP(formData.email)
      setStep(2)
      setCountdown(300)
      setCanResend(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input
  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOTP = [...otpCode]
    newOTP[index] = value
    setOtpCode(newOTP)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`reg-otp-${index + 1}`)?.focus()
    }
  }

  // Handle OTP paste
  const handleOTPPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOTP = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtpCode(newOTP)
  }

  // Step 2: Verify OTP and complete registration
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const code = otpCode.join('')

    if (code.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số')
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Complete registration
      await registrationApi.completeRegistration(
        formData.email,
        code,
        formData.fullName,
        formData.phone,
        formData.password
      )
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setError(null)
    setLoading(true)

    try {
      await registrationApi.requestOTP(formData.email)
      setOtpCode(['', '', '', '', '', ''])
      setCountdown(300)
      setCanResend(false)
      alert('Mã OTP mới đã được gửi!')
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi lại OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center px-8 pt-24 pb-12 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">CineBook</h1>
            <p className="text-gray-400">
              {step === 1 && 'Tạo tài khoản mới'}
              {step === 2 && 'Xác minh email'}
              {step === 3 && 'Đăng ký thành công'}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            {/* Header with icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {step === 1 && <UserPlus className="w-8 h-8 text-primary" />}
                {step === 2 && <Mail className="w-8 h-8 text-primary" />}
                {step === 3 && <CheckCircle className="w-8 h-8 text-primary" />}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {step === 1 && 'Đăng Ký'}
                {step === 2 && 'Nhập Mã OTP'}
                {step === 3 && 'Hoàn Tất'}
              </h2>
              {step === 2 && (
                <p className="text-gray-400 text-sm mt-2">
                  Mã OTP đã được gửi đến {formData.email}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Step 1: Registration Form */}
            {step === 1 && (
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Họ và Tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    placeholder="email@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Số Điện Thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    placeholder="0339464751"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Mật Khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Xác Nhận Mật Khẩu</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
                >
                  {loading ? 'Đang gửi OTP...' : 'Tiếp Tục'}
                </button>

                <p className="text-center text-gray-300">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-primary hover:text-red-600 font-medium transition-colors">
                    Đăng nhập ngay
                  </Link>
                </p>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                    Nhập 6 chữ số
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOTPPaste}>
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`reg-otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-gray-400 text-sm">
                      Mã hết hạn sau: <span className="text-primary font-bold">{formatTime(countdown)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading || !canResend}
                      className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
                >
                  {loading ? 'Đang xác minh...' : 'Xác Minh OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Quay lại
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="text-green-500">
                  <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Đăng Ký Thành Công!</h3>
                  <p className="text-gray-400">
                    Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  Đăng Nhập Ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
