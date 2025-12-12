import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Header from '../../layouts/header'
import Footer from '../../layouts/footer'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const { user, login } = useAuth()
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('')
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(300) // 5 minutes
    const [canResend, setCanResend] = useState(false)
    const [wasLoggedIn, setWasLoggedIn] = useState(!!user) // Track if user was logged in when entering this page

    // Countdown timer
    useState(() => {
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

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await authApi.requestPasswordReset(email)
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
            document.getElementById(`otp-${index + 1}`)?.focus()
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

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        const code = otpCode.join('')

        if (code.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 chữ số')
            return
        }

        setError('')
        setLoading(true)

        try {
            await authApi.verifyResetOTP(email, code)
            setStep(3)
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn')
        } finally {
            setLoading(false)
        }
    }

    // Resend OTP
    const handleResendOTP = async () => {
        setError('')
        setLoading(true)

        try {
            await authApi.requestPasswordReset(email)
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

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }

        setLoading(true)

        try {
            const code = otpCode.join('')
            await authApi.resetPassword(email, code, newPassword)

            // If user was logged in when they started this flow, auto-login with new password
            if (wasLoggedIn) {
                alert('Đặt lại mật khẩu thành công! Đang đăng nhập lại...')
                try {
                    await login(email, newPassword)
                    navigate('/profile')
                } catch (loginErr) {
                    alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.')
                    navigate('/login')
                }
            } else {
                // User came from login page - redirect to login
                alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
                navigate('/login')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        {/* Back button */}
                        <button
                            onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {step === 1 ? 'Quay lại đăng nhập' : 'Quay lại'}
                        </button>

                        {/* Card */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {step === 1 && <Mail className="w-8 h-8 text-primary" />}
                                    {step === 2 && <Lock className="w-8 h-8 text-primary" />}
                                    {step === 3 && <CheckCircle className="w-8 h-8 text-primary" />}
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {step === 1 && 'Quên mật khẩu?'}
                                    {step === 2 && 'Nhập mã OTP'}
                                    {step === 3 && 'Đặt mật khẩu mới'}
                                </h1>
                                <p className="text-gray-400">
                                    {step === 1 && 'Nhập email để nhận mã OTP'}
                                    {step === 2 && `Mã OTP đã được gửi đến ${email}`}
                                    {step === 3 && 'Tạo mật khẩu mới cho tài khoản'}
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Step 1: Email */}
                            {step === 1 && (
                                <form onSubmit={handleRequestOTP} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                    </button>
                                </form>
                            )}

                            {/* Step 2: OTP */}
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
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOTPChange(index, e.target.value)}
                                                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
                                    </button>
                                </form>
                            )}

                            {/* Step 3: New Password */}
                            {step === 3 && (
                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Ít nhất 6 ký tự"
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Nhập lại mật khẩu mới"
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
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
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
